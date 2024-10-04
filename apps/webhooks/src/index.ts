// import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// const PROJECT_ID = process.env.PROJECT_ID!;

// const getHeliusAuthSecret = async () => {
//   const client = new SecretManagerServiceClient();
//   const [response] = await client.accessSecretVersion({
//     name: `projects/${PROJECT_ID}/secrets/helius-auth/versions/latest`,
//   });
//   const secretString = response.payload?.data?.toString();
//   return secretString;
// };

// const app = express();
// app.use(express.json());
// app.post('/helius', async (req, res) => {
//   const secret = await getHeliusAuthSecret();
//   if (req.headers?.authorization !== secret) {
//     return res.status(401).send('Authorization Error');
//   }
//   const body = req.body as { '0': EnrichedTransaction };
//   const tx = body['0'];
//   await log('webhook', tx);
//   try {
//     const program = await getProgram(Keypair.generate());
//     const instruction = tx.instructions.find(
//       (i) => i.programId === programId.toString()
//     );
//   } catch (error) {
//     console.error('Error processing transaction', error);
//   }

//   return res.status(200).send({});
// });

// app.listen(8080, () => {
//   console.log('listening on 8080');
// });
