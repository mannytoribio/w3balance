import { supportTokens } from '@libs/program';
import { t } from './context';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export interface TokenPrice {
  id: string;
  price: number;
}

const fetchTokenPrices = async (
  tokenIds: string[],
  vsToken: string = 'USDC'
): Promise<TokenPrice[]> => {
  try {
    const ids = tokenIds.join(',');
    const response = await fetch(
      `https://price.jup.ag/v4/price?ids=${ids}&vsToken=${vsToken}`,
      {
        method: 'GET',
      }
    );
    console.log('response', response);
    if (!response.ok) {
      throw new Error('Failed to fetch token prices');
    }

    const data: TokenPrice[] = await response.json();
    console.log('TokenPrice data', data);
    return data;
  } catch (error) {
    console.error('Error fetching token prices', error);
    throw error;
  }
};

export const tokenPriceRouter = t.router({
  getPrices: t.procedure.query(async ({ input }) => {
    const prices = await fetchTokenPrices(
      supportTokens
        .filter((t) => t.name !== 'USDC')
        .map((t) => t.mainnetAddress),
      supportTokens.find((t) => t.name === 'USDC')?.mainnetAddress
    );
    return prices;
  }),
});
