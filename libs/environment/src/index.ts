import { Logging } from '@google-cloud/logging';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import admin, { ServiceAccount } from 'firebase-admin';
import { MongoClient } from 'mongodb';
import bs58 from 'bs58';
import { Connection, Keypair } from '@solana/web3.js';

let _mongoClient: MongoClient;

export const PROJECT_ID = process.env.PROJECT_ID!;

const logging = new Logging({ projectId: PROJECT_ID });
const logger = logging.log(PROJECT_ID);
const metadata = {
  labels: {
    app: PROJECT_ID,
  },
};

export const log = async (
  message: string,
  payload: Record<string, any> = {},
  error = false
) => {
  if (PROJECT_ID === 'local') {
    console.log(message, payload);
  } else {
    try {
      const entry = logger.entry(metadata, {
        payload: { ...payload },
        message,
      });
      if (error) {
        await logger.error(entry);
      } else {
        await logger.write(entry);
      }
    } catch (e) {}
  }
};

const getFirebaseSecret = async () => {
  const client = new SecretManagerServiceClient();
  const [response] = await client.accessSecretVersion({
    name: `projects/${PROJECT_ID}/secrets/firebase/versions/latest`,
  });
  const secretString = response.payload?.data?.toString();
  return JSON.parse(secretString!) as ServiceAccount;
};

const getMongoSecret = async () => {
  const client = new SecretManagerServiceClient();
  const [response] = await client.accessSecretVersion({
    name: `projects/${PROJECT_ID}/secrets/mongo-password/versions/latest`,
  });
  const secretString = response?.payload?.data?.toString();
  return secretString;
};

export const getMongoClient = async () => {
  if (!_mongoClient) {
    const creds = {
      username: 'admin',
      password: await getMongoSecret(),
    };

    _mongoClient = new MongoClient(
      `mongodb+srv://${creds.username}:${creds.password}@w3balance-db.rt2cm.mongodb.net/?retryWrites=true&w=majority`
    );
    try {
      _mongoClient = await _mongoClient.connect();
    } catch (e) {
      await log('Error in getMongoClient', { e });
    }
  }
  return _mongoClient.db(PROJECT_ID === 'w3balance-dev' ? 'dev' : 'prod');
};

export const initFirebase = async () => {
  if (!admin.apps.length) {
    const sa = await getFirebaseSecret();
    admin.initializeApp({
      credential: admin.credential.cert(sa as ServiceAccount),
    });
  }
};

export const getPayerWallet = async () => {
  const client = new SecretManagerServiceClient();
  const [response] = await client.accessSecretVersion({
    name: `projects/${PROJECT_ID}/secrets/wallet/versions/latest`,
  });
  const secretString = response?.payload?.data?.toString();
  return Keypair.fromSecretKey(bs58.decode(secretString!));
};

const url =
  'https://devnet.helius-rpc.com/?api-key=0c7e899d-480b-4f6f-9d6d-6e980dad3442';

export const connection = new Connection(url, 'confirmed');
