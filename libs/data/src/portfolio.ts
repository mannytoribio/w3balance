import { getMongoClient } from '@libs/environment';
import { Token } from '@libs/program';

export interface TokenAllocation {
  percentage: number;
  token: Token;
  portfolioId: string;
  accountKey: string;
  userId: string;
  userKey: string;
}

export interface Portfolio {
  id: string;
  name: string;
  allocations: TokenAllocation[];
  rebalanceFrequency: string;
  createdAt: Date;
  accountKey: string;
  userId: string;
  userKey: string;
}

export const getTokenAllocationCol = async () => {
  const client = await getMongoClient();
  const col = client.collection<TokenAllocation>('token-allocations');
  await col.createIndex({
    portfolioId: 1,
  });

  return col;
};

export const getPortfolioCol = async () => {
  const client = await getMongoClient();
  const col = client.collection<Portfolio>('portfolios');
  await col.createIndex({
    createdAt: -1,
  });

  return col;
};

export const getPortfolios = async (userKey: string) => {
  const col = await getPortfolioCol();
  const tokenAllocationCol = await getTokenAllocationCol();
  const portfolios = await col.find({ userKey }).toArray();
  const portfolioIds = portfolios.map((portfolio) => portfolio.id);
  const allocations = await tokenAllocationCol
    .find({ portfolioId: { $in: portfolioIds } })
    .toArray();
  return portfolios.map((portfolio) => {
    return {
      ...portfolio,
      allocations: allocations.filter(
        (allocation) => allocation.portfolioId === portfolio.id
      ),
    };
  });
};
