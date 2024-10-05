import { AnchorProvider, Program, utils, Wallet } from '@project-serum/anchor';
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  type W3balanceContract,
  IDL,
} from '@libs/program/src/w3balance_contract';
import { useWallet, WalletContextState } from '@jup-ag/wallet-adapter';
import { useMemo } from 'react';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { supportTokens, Token } from '@libs/program';
import * as anchor from '@project-serum/anchor';

// TODO: we can and should do better than this;
export const delegatedRebalanceAddress = new PublicKey(
  'FgtCE8mFs6Wt2emdXS8VRHTKorJbCsG7dogk9aQpjaYg'
);

export const programId = new PublicKey(
  '46gecgivx6mbKb7gfZFVjBGbBgR1n91NEj3naj2LrF8u'
);

const url =
  import.meta.env.VITE_REST_ENVIRONMENT === 'prod'
    ? 'https://rpc.helius.xyz/?api-key=97602bb0-7a52-4f03-ae6a-3527f32b0f09'
    : 'https://devnet.helius-rpc.com/?api-key=db35e690-4c77-45d5-8dbf-776893e28551';

console.log(url);

export const useProvider = () => {
  const wallet = useWallet();
  const connection = new Connection(url, 'confirmed');
  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return {} as Wallet;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as Wallet;
  }, [wallet]);

  if (anchorWallet) {
    const provider = new AnchorProvider(connection, anchorWallet, {
      commitment: 'confirmed',
    });
    return { provider, wallet: anchorWallet };
  }
};

export const getProgram = async (provider: AnchorProvider) => {
  console.log(IDL);
  return new Program(
    IDL,
    programId,
    provider
  ) as unknown as Program<W3balanceContract>;
};

export const getTokenBalance = async (
  token: Token,
  provider: AnchorProvider
) => {
  const account = getAssociatedTokenAddressSync(
    new PublicKey(
      provider.connection.rpcEndpoint.includes('devnet')
        ? token.devnetAddress
        : token.mainnetAddress
    ),
    provider.wallet.publicKey,
    false
  );
  return provider.connection.getTokenAccountBalance(account);
};

export const createPortfolio = async (
  portfolioName: string,
  allocations: {
    tokenAddress: string;
    percentage: number;
  }[],
  updateFrequency: number,
  depositAmount: number,
  wallet: WalletContextState,
  provider: AnchorProvider
) => {
  const program = await getProgram(provider);
  const [portfolioAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode('portfolio')),
      wallet.publicKey!.toBuffer(),
      Buffer.from(utils.bytes.utf8.encode(portfolioName)),
    ],
    program.programId
  );

  console.log('Portfolio account:', portfolioAccount.toString());
  const createPortfolioInstruction = await program.methods
    .createPortfolio({
      uniqueName: portfolioName,
      delegatedRebalanceAddress,
      updateFrequency,
    })
    .accounts({
      payer: wallet.publicKey!,
      portfolioAccount,
      delegatedRebalanceAddress,
    })
    .instruction();
  const mintInstructions: TransactionInstruction[] = [];
  for (const alloc of allocations) {
    const [portfolioTokenAllocationAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(utils.bytes.utf8.encode('portfolio_token_allocation')),
        portfolioAccount.toBuffer(),
        wallet.publicKey!.toBuffer(),
        new PublicKey(alloc.tokenAddress).toBuffer(),
      ],
      program.programId
    );
    const portfolioTokenAllocationTokenAccount = getAssociatedTokenAddressSync(
      new PublicKey(alloc.tokenAddress),
      portfolioAccount,
      true
    );
    mintInstructions.push(
      await program.methods
        .addPortfolioTokenAllocation({
          percentage: alloc.percentage,
          tokenMint: new PublicKey(alloc.tokenAddress),
        })
        .accounts({
          payer: wallet.publicKey!,
          portfolioTokenAllocationAccount,
          portfolioAccount,
          mintAccount: new PublicKey(alloc.tokenAddress),
          portfolioTokenAllocationTokenAccount,
        })
        .instruction()
    );
  }
  const usdc = supportTokens.find((t) => t.symbol === 'USDC')!;
  const ownerTokenAccount = getAssociatedTokenAddressSync(
    // we are treating the first token as the deposit or basically USDC;
    // we have an expectation that they have a token account already, if they don't we should throw an error;
    new PublicKey(usdc.devnetAddress),
    wallet.publicKey!,
    false
  );
  const [portfolioTokenAllocationAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(utils.bytes.utf8.encode('portfolio_token_allocation')),
      portfolioAccount.toBuffer(),
      wallet.publicKey!.toBuffer(),
      new PublicKey(usdc.devnetAddress).toBuffer(),
    ],
    program.programId
  );
  const portfolioTokenAllocationTokenAccount = getAssociatedTokenAddressSync(
    new PublicKey(usdc.devnetAddress),
    portfolioAccount,
    true
  );
  console.log(depositAmount);
  const depositInstruction = await program.methods
    .depositPortfolio({
      amount: new anchor.BN(depositAmount * 10 ** usdc.decimals),
    })
    .accounts({
      portfolioAccount,
      payer: wallet.publicKey!,
      payerTokenAccount: ownerTokenAccount,
      portfolioTokenAllocationAccount,
      portfolioTokenAllocationTokenAccount,
    })
    .instruction();

  const ret = await wallet.sendTransaction(
    new Transaction().add(
      createPortfolioInstruction,
      ...mintInstructions,
      depositInstruction
    ),
    provider.connection
  );
  console.log(ret);
};
