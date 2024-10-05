import { getMongoClient } from '@libs/environment';
import { Token } from '@libs/program';

export interface TokenAllocation {
  percentage: number;
  tokenMint: string;
  portfolioId: string;
  accountKey: string;
  userId: string;
  userKey: string;
  txSignature: string;
  createdAt: Date;
}

export interface DepositPortfolio {
  portfolioId: string;
  mintToken: string;
  userId: string;
  userKey: string;
  txSignature: string;
  createdAt: Date;
  amount: number;
}

export interface Portfolio {
  name: string;
  rebalanceFrequency: number;
  createdAt: Date;
  accountKey: string;
  userId: string;
  userKey: string;
  txSignature: string;
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

export const getDepositPortfolioCol = async () => {
  const client = await getMongoClient();
  const col = client.collection<DepositPortfolio>('deposit-portfolios');
  await col.createIndex({
    createdAt: -1,
  });

  return col;
};

export const getPortfolios = async (userKey: string) => {
  const col = await getPortfolioCol();
  const tokenAllocationCol = await getTokenAllocationCol();
  const portfolios = await col.find({ userKey }).toArray();
  const portfolioIds = portfolios.map((portfolio) => portfolio._id.toString());
  const allocations = await tokenAllocationCol
    .find({ portfolioId: { $in: portfolioIds } })
    .toArray();
  return portfolios.map((portfolio) => {
    return {
      ...portfolio,
      allocations: allocations.filter(
        (allocation) => allocation.portfolioId === portfolio._id.toString()
      ),
    };
  });
};
