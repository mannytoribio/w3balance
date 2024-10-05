import { fetchTokenPrices, supportTokens } from '@libs/program';
import { t } from './context';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const tokenPriceRouter = t.router({
  getPrices: t.procedure.query(async ({ input }) => {
    const prices = await fetchTokenPrices(
      supportTokens
        .filter((t) => t.name !== 'USDC')
        .map((t) => t.mainnetAddress),
      supportTokens.find((t) => t.name === 'USDC')!.mainnetAddress
    );
    return prices;
  }),
});
