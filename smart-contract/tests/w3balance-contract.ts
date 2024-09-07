import * as anchor from '@project-serum/anchor';
import { W3balanceContract } from '../target/types/w3balance_contract';
import chai, { expect } from 'chai';
import {
  createMint,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';
import chaiAsPromised from 'chai-as-promised';
import { PriceServiceConnection } from '@pythnetwork/price-service-client';
import {
  InstructionWithEphemeralSigners,
  PythSolanaReceiver,
} from '@pythnetwork/pyth-solana-receiver';
import { Program, Wallet } from '@coral-xyz/anchor';

chai.use(chaiAsPromised);

// Configure the client to use the local cluster.
anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace
  .W3BalanceContract as Program<W3balanceContract>;

const connection = anchor.getProvider().connection;

const createPortfolio = async (uniqueName: string) => {
  const owner = anchor.web3.Keypair.generate();
  const [portfolioAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('portfolio')),
      owner.publicKey.toBuffer(),
      Buffer.from(anchor.utils.bytes.utf8.encode(uniqueName)),
    ],
    program.programId
  );
  const airdropTx = await connection.requestAirdrop(
    owner.publicKey,
    2000000000
  );
  await connection.confirmTransaction(airdropTx);

  await program.methods
    .createPortfolio({
      uniqueName: uniqueName,
    })
    .accounts({
      portfolioAccount,
      payer: owner.publicKey,
    })
    .signers([owner])
    .rpc();

  return {
    portfolioAccount,
    owner,
  };
};

const addPortfolioTokenAllocation = async (
  owner: anchor.web3.Keypair,
  portfolioAccount: anchor.web3.PublicKey,
  percentage: number = 50
) => {
  const decimals = 9;
  const mint = await createMint(
    connection,
    owner,
    owner.publicKey,
    null,
    decimals
  );
  const [portfolioTokenAllocationAccount] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(
          anchor.utils.bytes.utf8.encode('portfolio_token_allocation')
        ),
        owner.publicKey.toBuffer(),
        mint.toBuffer(),
      ],
      program.programId
    );
  const portfolioTokenAllocationTokenAccount = getAssociatedTokenAddressSync(
    mint,
    portfolioAccount,
    true
  );

  await program.methods
    .addPortfolioTokenAllocation({
      tokenMint: mint,
      percentage,
    })
    .accounts({
      portfolioAccount,
      portfolioTokenAllocationTokenAccount,
      mintAccount: mint,
      payer: owner.publicKey,
      portfolioTokenAllocationAccount,
    })
    .signers([owner])
    .rpc();

  return {
    mint,
    portfolioTokenAllocationTokenAccount,
    portfolioTokenAllocationAccount,
  };
};

const depositPortfolio = async (
  owner: anchor.web3.Keypair,
  portfolioAccount: anchor.web3.PublicKey,
  portfolioTokenAllocationAccount: anchor.web3.PublicKey,
  portfolioTokenAllocationTokenAccount: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey,
  amount: number
) => {
  const ownerTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    owner,
    mint,
    owner.publicKey,
    true
  );
  await mintTo(
    connection,
    owner,
    mint,
    ownerTokenAccount.address,
    owner,
    amount * 10 ** 9
  );
  await program.methods
    .depositPortfolio({
      amount: new anchor.BN(amount * 10 ** 9),
    })
    .accounts({
      payer: owner.publicKey,
      portfolioTokenAllocationTokenAccount,
      portfolioTokenAllocationAccount,
      portfolioAccount,
      payerTokenAccount: ownerTokenAccount.address,
    })
    .signers([owner])
    .rpc();

  return {
    ownerTokenAccount,
  };
};

const withdrawalPortfolio = async (
  owner: anchor.web3.Keypair,
  ownerTokenAccount: anchor.web3.PublicKey,
  portfolioAccount: anchor.web3.PublicKey,
  portfolioTokenAllocationAccount: anchor.web3.PublicKey,
  portfolioTokenAllocationTokenAccount: anchor.web3.PublicKey,
  amount: number
) => {
  await program.methods
    .withdrawalPortfolio({
      amount: new anchor.BN(amount * 10 ** 9),
    })
    .accounts({
      payer: owner.publicKey,
      portfolioTokenAllocationTokenAccount,
      portfolioTokenAllocationAccount,
      portfolioAccount,
      payerTokenAccount: ownerTokenAccount,
    })
    .signers([owner])
    .rpc();
};

describe('w3balance-contract', () => {
  it('Creates a Portfolio', async () => {
    const uniqueName = 'My First Portfolio';
    const { portfolioAccount } = await createPortfolio(uniqueName);
    const portfolio = await program.account.portfolio.fetch(portfolioAccount);
    expect(portfolio.uniqueName === uniqueName);
  });

  it('Adds a Portfolio Token Allocation', async () => {
    const { portfolioAccount, owner } = await createPortfolio(
      'My First Portfolio'
    );
    const { mint, portfolioTokenAllocationAccount } =
      await addPortfolioTokenAllocation(owner, portfolioAccount, 50);
    const portfolioTokenAllocation =
      await program.account.portfolioTokenAllocation.fetch(
        portfolioTokenAllocationAccount
      );
    expect(portfolioTokenAllocation.percentage).to.equal(50);
  });

  it('Fails when adding a portfolio that goes over 100 percent allocation', async () => {
    const { portfolioAccount, owner } = await createPortfolio(
      'My First Portfolio'
    );
    await addPortfolioTokenAllocation(owner, portfolioAccount, 50);
    await expect(
      addPortfolioTokenAllocation(owner, portfolioAccount, 51)
    ).to.eventually.be.rejectedWith(
      'Portfolio token allocation exceeds 100 percent'
    );
  });

  it('Deposits tokens into Portfolio Token Allocation', async () => {
    const { portfolioAccount, owner } = await createPortfolio(
      'My First Portfolio'
    );
    const {
      mint,
      portfolioTokenAllocationAccount,
      portfolioTokenAllocationTokenAccount,
    } = await addPortfolioTokenAllocation(owner, portfolioAccount, 50);
    await depositPortfolio(
      owner,
      portfolioAccount,
      portfolioTokenAllocationAccount,
      portfolioTokenAllocationTokenAccount,
      mint,
      100
    );
    const portfolioTokenAllocationBalance =
      await program.provider.connection.getTokenAccountBalance(
        portfolioTokenAllocationTokenAccount
      );
    expect(portfolioTokenAllocationBalance.value.uiAmount).to.equal(100);
  });

  it('Withdraws tokens from Portfolio Token Allocation', async () => {
    const { portfolioAccount, owner } = await createPortfolio(
      'My First Portfolio'
    );
    const {
      mint,
      portfolioTokenAllocationAccount,
      portfolioTokenAllocationTokenAccount,
    } = await addPortfolioTokenAllocation(owner, portfolioAccount, 50);
    const { ownerTokenAccount } = await depositPortfolio(
      owner,
      portfolioAccount,
      portfolioTokenAllocationAccount,
      portfolioTokenAllocationTokenAccount,
      mint,
      100
    );
    await withdrawalPortfolio(
      owner,
      ownerTokenAccount.address,
      portfolioAccount,
      portfolioTokenAllocationAccount,
      portfolioTokenAllocationTokenAccount,
      100
    );
    const portfolioTokenAllocationBalance =
      await program.provider.connection.getTokenAccountBalance(
        portfolioTokenAllocationTokenAccount
      );
    expect(portfolioTokenAllocationBalance.value.uiAmount).to.equal(0);
    const ownerTokenBalance =
      await program.provider.connection.getTokenAccountBalance(
        ownerTokenAccount.address
      );
    expect(ownerTokenBalance.value.uiAmount).to.equal(100);
  });

  it.only('Rebalances Portfolio', async () => {
    const { portfolioAccount, owner } = await createPortfolio(
      'My First Portfolio'
    );
    const {
      mint,
      portfolioTokenAllocationAccount,
      portfolioTokenAllocationTokenAccount,
    } = await addPortfolioTokenAllocation(owner, portfolioAccount, 50);

    const SOL_PRICE_FEED_ID =
      '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d';
    const priceServiceConnection = new PriceServiceConnection(
      'https://hermes.pyth.network/',
      { priceFeedRequestConfig: { binary: true } }
    );

    const pythSolanaReceiver = new PythSolanaReceiver({
      connection,
      wallet: new Wallet(owner),
    });

    const transactionBuilder = pythSolanaReceiver.newTransactionBuilder({
      closeUpdateAccounts: true,
    });

    const priceUpdateData = await priceServiceConnection.getLatestVaas([
      SOL_PRICE_FEED_ID,
    ]);

    await transactionBuilder.addPostPriceUpdates([priceUpdateData[0]]);

    await transactionBuilder.addPriceConsumerInstructions(
      async (
        getPriceUpdateAccount: (priceFeedId: string) => anchor.web3.PublicKey
      ): Promise<InstructionWithEphemeralSigners[]> => {
        const instructions = [
          {
            instruction: await program.methods
              .rebalancePortfolio()
              .accounts({
                priceUpdate: getPriceUpdateAccount(SOL_PRICE_FEED_ID),
                portfolioAccount,
                payer: owner.publicKey,
              })
              .instruction(),
            signers: [owner],
          },
        ];
        return instructions;
      }
    );
    console.log('Submitting Tx');
    await pythSolanaReceiver.provider.sendAll(
      await transactionBuilder.buildVersionedTransactions({
        // computeUnitPriceMicroLamports: 50000,
      })
    );
  });
});
