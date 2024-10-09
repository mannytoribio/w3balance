import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { EnrichedTransaction } from 'helius-sdk';
import express from 'express';
import { getProgram, programId } from '@libs/environment';
import { Keypair, PublicKey } from '@solana/web3.js';
import {
  getDepositPortfolioCol,
  getPortfolioCol,
  getTokenAllocationCol,
  getWithdrawPortfolioCol,
} from '@libs/data';
import { BN, BorshCoder, utils } from '@project-serum/anchor';
import { supportTokens } from '@libs/program';
import { scheduleBalanceJob } from '@libs/balancer';

interface PortfolioInstructionData {
  uniqueName: string;
  delegatedRebalanceAddress: string;
  updateFrequency: number;
}

interface PortfolioTokenAllocationInstructionData {
  tokenMint: string;
  percentage: number;
}

interface DepositPortfolioInstructionData {
  amount: BN;
}

const PROJECT_ID = process.env.PROJECT_ID!;

const handleCreatePortfolioInstruction = async (
  signer: string,
  data: PortfolioInstructionData,
  txSignature: string
) => {
  console.log(
    'Creating portfolio',
    signer,
    JSON.stringify(data),
    data.uniqueName
  );
  const col = await getPortfolioCol();
  const [portfolioAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode('portfolio')),
      new PublicKey(signer).toBuffer(),
      Buffer.from(utils.bytes.utf8.encode(data.uniqueName)),
    ],
    programId
  );
  await col.updateOne(
    { accountKey: portfolioAccount.toString() },
    {
      $set: {
        accountKey: portfolioAccount.toString(),
        createdAt: new Date(),
        name: data.uniqueName,
        rebalanceFrequency: data.updateFrequency,
        txSignature,
        // TODO: we may want to use actual users at some point;
        userId: signer,
        userKey: signer,
      },
    },
    { upsert: true }
  );

  return portfolioAccount.toString();
};

const handleAddPortfolioTokenAllocationInstruction = async (
  signer: string,
  data: PortfolioTokenAllocationInstructionData,
  accounts: string[],
  txSignature: string
) => {
  console.log('Adding portfolio token allocation');
  const col = await getPortfolioCol();
  const existingPortfolio = await col.findOne({
    // instead of trying to figure out which account is the portfolio,
    // lets let mongo tell us;
    accountKey: { $in: accounts },
  });
  // This should always exists if its valid.
  if (!existingPortfolio) {
    console.log('Portfolio does not exist');
    return;
  }
  const tokenAllocationCol = await getTokenAllocationCol();
  const [portfolioTokenAllocationAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode('portfolio_token_allocation')),
      new PublicKey(existingPortfolio.accountKey).toBuffer(),
      new PublicKey(signer).toBuffer(),
      new PublicKey(data.tokenMint).toBuffer(),
    ],
    programId
  );
  await tokenAllocationCol.updateOne(
    { accountKey: portfolioTokenAllocationAccount.toString() },
    {
      $set: {
        accountKey: portfolioTokenAllocationAccount.toString(),
        percentage: data.percentage,
        portfolioId: existingPortfolio._id.toString(),
        tokenMint: data.tokenMint.toString(),
        userId: signer,
        userKey: signer,
        txSignature,
      },
    },
    { upsert: true }
  );
};

const handleDepositPortfolioInstruction = async (
  signer: string,
  data: DepositPortfolioInstructionData,
  accounts: string[],
  txSignature: string
) => {
  const col = await getTokenAllocationCol();
  const existingPortfolioAllocation = await col.findOne({
    // instead of trying to figure out which account is the portfolio,
    // lets let mongo tell us;
    accountKey: { $in: accounts },
  });
  if (!existingPortfolioAllocation) {
    console.log('Portfolio allocation does not exist');
    return;
  }
  const depositCol = await getDepositPortfolioCol();
  await depositCol.updateOne(
    { txSignature },
    {
      $set: {
        amount: data.amount.toNumber(),
        portfolioAllocationId: existingPortfolioAllocation._id.toString(),
        portfolioId: existingPortfolioAllocation.portfolioId,
        txSignature,
        userId: signer,
        userKey: signer,
        createdAt: new Date(),
        // TODO: this is a bad way to do this but demo gonna demo;
        mintToken: supportTokens.find((s) => s.name === 'USDC')!.devnetAddress,
      },
    },
    { upsert: true }
  );
};

const handleWithdrawPortfolioInstruction = async (
  signer: string,
  data: DepositPortfolioInstructionData,
  accounts: string[],
  txSignature: string
) => {
  const col = await getTokenAllocationCol();
  const existingPortfolioAllocation = await col.findOne({
    // instead of trying to figure out which account is the portfolio,
    // lets let mongo tell us;
    accountKey: { $in: accounts },
  });
  if (!existingPortfolioAllocation) {
    console.log('Portfolio allocation does not exist');
    return;
  }
  const withdraw = await getWithdrawPortfolioCol();
  await withdraw.updateOne(
    { txSignature },
    {
      $set: {
        amount: data.amount.toNumber(),
        portfolioAllocationId: existingPortfolioAllocation._id.toString(),
        portfolioId: existingPortfolioAllocation.portfolioId,
        txSignature,
        userId: signer,
        userKey: signer,
        createdAt: new Date(),
        // TODO: this is a bad way to do this but demo gonna demo;
        mintToken: supportTokens.find((s) =>
          accounts.includes(s.devnetAddress)
        )!.devnetAddress,
      },
    },
    { upsert: true }
  );
};

const getHeliusAuthSecret = async () => {
  const client = new SecretManagerServiceClient();
  const [response] = await client.accessSecretVersion({
    name: `projects/${PROJECT_ID}/secrets/helius-auth/versions/latest`,
  });
  const secretString = response.payload?.data?.toString();
  return secretString;
};

const app = express();
app.use(express.json());
app.post('/helius', async (req, res) => {
  const secret = await getHeliusAuthSecret();
  if (req.headers?.authorization !== secret) {
    return res.status(401).send('Authorization Error');
  }
  const body = req.body as { '0': EnrichedTransaction };
  const tx = body['0'];
  try {
    let accountKey = '';
    const program = await getProgram(Keypair.generate());
    const rawInstructions = tx.instructions.filter(
      (i) => i.programId === programId.toString()
    );
    const coder = new BorshCoder(program.idl);
    const instructions = rawInstructions.map((i) => ({
      instruction: coder.instruction.decode(i.data, 'base58')!,
      accounts: i.accounts,
    }));
    const signer = tx.accountData.find(
      (a) => a.nativeBalanceChange < 0
    )!.account;
    if (instructions.find((i) => i.instruction.name === 'createPortfolio')) {
      const { data } = instructions.find(
        (i) => i.instruction.name === 'createPortfolio'
      )!.instruction.data as { data: PortfolioInstructionData };
      accountKey = await handleCreatePortfolioInstruction(
        signer,
        data,
        tx.signature
      );
    }
    if (
      instructions.find(
        (i) => i.instruction.name === 'addPortfolioTokenAllocation'
      )
    ) {
      const addPortfolioTokenAllocationInstructions = instructions.filter(
        (i) => i.instruction.name === 'addPortfolioTokenAllocation'
      );
      await Promise.all(
        addPortfolioTokenAllocationInstructions.map(async (i) => {
          const { data } = i.instruction.data as {
            data: PortfolioTokenAllocationInstructionData;
          };
          await handleAddPortfolioTokenAllocationInstruction(
            signer,
            data,
            i.accounts,
            tx.signature
          );
        })
      );
    }
    if (instructions.find((i) => i.instruction.name === 'depositPortfolio')) {
      const instruction = instructions.find(
        (i) => i.instruction.name === 'depositPortfolio'
      );
      const { data } = instruction!.instruction.data as {
        data: DepositPortfolioInstructionData;
      };
      await handleDepositPortfolioInstruction(
        signer,
        data,
        instruction!.accounts,
        tx.signature
      );
    }
    if (instructions.find((i) => i.instruction.name === 'withdrawPortfolio')) {
      console.log('Handling withdraw');
      const instruction = instructions.find(
        (i) => i.instruction.name === 'withdrawPortfolio'
      );
      const { data } = instruction!.instruction.data as {
        data: DepositPortfolioInstructionData;
      };
      await handleWithdrawPortfolioInstruction(
        signer,
        data,
        instruction!.accounts,
        tx.signature
      );
    }
    console.log(accountKey);
    if (accountKey) {
      await scheduleBalanceJob(accountKey, true);
    }
  } catch (error) {
    console.error('Error processing transaction', error);
  }

  return res.status(200).send({});
});

app.listen(8080, () => {
  console.log('listening on 8080');
});
