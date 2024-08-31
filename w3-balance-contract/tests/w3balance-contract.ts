import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { W3balanceContract } from '../target/types/w3balance_contract';
import chai, { expect } from 'chai';
import {
  createMint,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

// Configure the client to use the local cluster.
anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace
  .W3BalanceContract as Program<W3balanceContract>;

const connection = anchor.getProvider().connection;

const createFund = async (uniqueName: string) => {
  const owner = anchor.web3.Keypair.generate();
  const [fundAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('fund')),
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
    .createFund({
      uniqueName: uniqueName,
    })
    .accounts({
      fundAccount,
      payer: owner.publicKey,
    })
    .signers([owner])
    .rpc();

  return {
    fundAccount,
    owner,
  };
};

const addFundTokenAllocation = async (
  owner: anchor.web3.Keypair,
  fundAccount: anchor.web3.PublicKey,
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
  const [fundTokenAllocationAccount] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(anchor.utils.bytes.utf8.encode('fund_token_allocation')),
        owner.publicKey.toBuffer(),
        mint.toBuffer(),
      ],
      program.programId
    );
  const fundTokenAllocationTokenAccount = getAssociatedTokenAddressSync(
    mint,
    fundAccount,
    true
  );

  await program.methods
    .addFundTokenAllocation({
      tokenMint: mint,
      percentage,
    })
    .accounts({
      fundAccount,
      fundTokenAllocationTokenAccount,
      mintAccount: mint,
      payer: owner.publicKey,
      fundTokenAllocationAccount,
    })
    .signers([owner])
    .rpc();

  return {
    mint,
    fundTokenAllocationTokenAccount,
    fundTokenAllocationAccount,
  };
};

describe('w3balance-contract', () => {
  it('Creates a Fund', async () => {
    const uniqueName = 'My First Fund';
    const { fundAccount } = await createFund(uniqueName);
    const fund = await program.account.fund.fetch(fundAccount);
    expect(fund.uniqueName === uniqueName);
  });

  it('Adds a Fund Token Allocation', async () => {
    const { fundAccount, owner } = await createFund('My First Fund');
    const { mint, fundTokenAllocationAccount } = await addFundTokenAllocation(
      owner,
      fundAccount,
      50
    );
    const fundTokenAllocation = await program.account.fundTokenAllocation.fetch(
      fundTokenAllocationAccount
    );
    expect(fundTokenAllocation.percentage).to.equal(50);
  });

  it('Fails when adding a fund that goes over 100 percent allocation', async () => {
    const { fundAccount, owner } = await createFund('My First Fund');
    await addFundTokenAllocation(owner, fundAccount, 50);
    await expect(
      addFundTokenAllocation(owner, fundAccount, 51)
    ).to.eventually.be.rejectedWith(
      'Fund token allocation exceeds 100 percent'
    );
  });
});
