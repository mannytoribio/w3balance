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

export interface PortfolioRebalance {
  portfolioId: string;
  userId: string;
  userKey: string;
  txSignature: string;
  createdAt: Date;
  toMint: string;
  fromMint: string;
  toAmount: number;
  fromAmount: number;
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

export interface WithdrawPortfolio {
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
  lastRebalanced?: Date;
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

export const getRebalancePortfolioCol = async () => {
  const client = await getMongoClient();
  const col = client.collection<PortfolioRebalance>('rebalance-portfolios');

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

export const getWithdrawPortfolioCol = async () => {
  const client = await getMongoClient();
  const col = client.collection<WithdrawPortfolio>('withdraw-portfolios');
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

export const getPortfolio = async (accountKey: string) => {
  const col = await getPortfolioCol();
  const tokenAllocationCol = await getTokenAllocationCol();
  const depositCol = await getDepositPortfolioCol();
  const withdrawCol = await getWithdrawPortfolioCol();
  const rebalanceCol = await getRebalancePortfolioCol();
  const portfolio = (await col.findOne({ accountKey }))!;
  const allocations = await tokenAllocationCol
    .find({ portfolioId: portfolio._id.toString() })
    .toArray();
  const deposits = await depositCol
    .find({ portfolioId: portfolio._id.toString() })
    .toArray();
  const withdraws = await withdrawCol
    .find({ portfolioId: portfolio._id.toString() })
    .toArray();
  const rebalances = await rebalanceCol
    .find({ portfolioId: portfolio._id.toString() })
    .toArray();
  return {
    portfolio,
    allocations,
    deposits,
    withdraws,
    rebalances,
  };
};
