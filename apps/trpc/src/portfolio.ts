import { t } from './context';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getPortfolio, getPortfolios } from '@libs/data';
import { connection, getPayerWallet } from '@libs/environment';
import { PublicKey } from '@solana/web3.js';
import { mintTo, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';

export const portfolioRouter = t.router({
  airdropToken: t.procedure
    .input(
      z.object({
        tokenAddress: z.string(),
        walletAddress: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const signer = await getPayerWallet();
      const mint = new PublicKey(input.tokenAddress);
      const requester = new PublicKey(input.walletAddress);
      const ATA = await getOrCreateAssociatedTokenAccount(
        connection,
        signer,
        mint,
        requester
      );
      await mintTo(
        connection,
        signer,
        mint,
        ATA.address,
        signer,
        100 * 10 ** 9
      );
    }),

  getPortfolios: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
    const portfolios = await getPortfolios(input);
    return portfolios;
  }),
  getPortfolio: t.procedure.input(z.string()).query(async ({ ctx, input }) => {
    const portfolio = await getPortfolio(input);
    return portfolio;
  }),
});
