import { AnchorProvider, Program, Wallet } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { type W3balanceContract, IDL } from './w3balance_contract';
import { useWallet } from '@jup-ag/wallet-adapter';
import { useMemo } from 'react';

export const programId = new PublicKey(
  '46gecgivx6mbKb7gfZFVjBGbBgR1n91NEj3naj2LrF8u'
);

const url =
  import.meta.env.VITE_REST_ENVIRONMENT === 'prod'
    ? 'https://rpc.helius.xyz/?api-key=97602bb0-7a52-4f03-ae6a-3527f32b0f09'
    : 'https://devnet.helius-rpc.com/?api-key=db35e690-4c77-45d5-8dbf-776893e28551';

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
  return new Program(
    IDL,
    programId,
    provider
  ) as unknown as Program<W3balanceContract>;
};
