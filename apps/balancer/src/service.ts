import {
  getPortfolioCol,
  getTokenAllocationCol,
  TokenAllocation,
} from '@libs/data';
import { connection, getPayerWallet, getProgram } from '@libs/environment';
import { fetchTokenPrices, supportTokens } from '@libs/program';
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { initSdk } from '@libs/raydium';
import {
  CurveCalculator,
  getPdaObservationId,
} from '@raydium-io/raydium-sdk-v2';

// TODO: eventually handle prod/mainnet;
const pools = [
  {
    tokens: [
      '6EQssH3g3sjxredCgJoumxB8duVsxJ2u8JHB3zwF1n11',
      '6Qb1Wzq7u1mZKkjn2fq7sK9Q6f1Lx3bwQ5xRMsQmBrJ3',
    ],
    key: '6YxadC27FBT2fbRfQBxDvUFzewdiosLJufRqeRRYhwQZ',
  },
  {
    key: '6aSLCTGSJLvJBNVx5hAEpxCp7RLN8TQGhARKGUJhu2SV',
    tokens: [
      '6EQssH3g3sjxredCgJoumxB8duVsxJ2u8JHB3zwF1n11',
      '6T9Gx3ewdhMGPp7WH5oFRpT4UnhBa17M7Rf5RAkm6j5a',
    ],
  },
  {
    key: 'B32twZ4GzQu5zUMenr33BJLzq6zLPdzTFx2S8iaK4oNH',
    tokens: [
      '6EQssH3g3sjxredCgJoumxB8duVsxJ2u8JHB3zwF1n11',
      'BNf9LShPbTp1e9xLg1us1Vi45pejqCj8TgRRkbcqcR5w',
    ],
  },
  {
    key: '2JT21yJ2LseZaWWMwxr2FXuKjNLo72ajvASUt2c9yh7U',
    tokens: [
      '6EQssH3g3sjxredCgJoumxB8duVsxJ2u8JHB3zwF1n11',
      '2aaymuBQ83N8BmwkDrnA24iymfM5TbnGdsPqJ9bbWK4v',
    ],
  },
  {
    key: 'CSe83eWr37QY5bjvUCUjYLyABpNpCfomsZMJ6SDM94JN',
    tokens: [
      '6Qb1Wzq7u1mZKkjn2fq7sK9Q6f1Lx3bwQ5xRMsQmBrJ3',
      '6T9Gx3ewdhMGPp7WH5oFRpT4UnhBa17M7Rf5RAkm6j5a',
    ],
  },
  {
    key: 'G2nhrgy9YS5ryRRuk2gSNrCmSSJ8Hyjth5QQ2ZXnYe9u',
    tokens: [
      '6Qb1Wzq7u1mZKkjn2fq7sK9Q6f1Lx3bwQ5xRMsQmBrJ3',
      'BNf9LShPbTp1e9xLg1us1Vi45pejqCj8TgRRkbcqcR5w',
    ],
  },
  {
    key: '7sTmLc79yqi6aPu3EG9FwKZrKjMStjFEPiu1XNRrEfzx',
    tokens: [
      '6Qb1Wzq7u1mZKkjn2fq7sK9Q6f1Lx3bwQ5xRMsQmBrJ3',
      '2aaymuBQ83N8BmwkDrnA24iymfM5TbnGdsPqJ9bbWK4v',
    ],
  },
  {
    key: '6KroX5E4kGKQc2otNPUiqkwYYstKFb6yeaNZCz2ojnMS',
    tokens: [
      '6T9Gx3ewdhMGPp7WH5oFRpT4UnhBa17M7Rf5RAkm6j5a',
      'BNf9LShPbTp1e9xLg1us1Vi45pejqCj8TgRRkbcqcR5w',
    ],
  },
  {
    key: 'B9R3vmYoeRViVe7nWEU8D46tHBj4xSbSmFC8B4qpsBTs',
    tokens: [
      '6T9Gx3ewdhMGPp7WH5oFRpT4UnhBa17M7Rf5RAkm6j5a',
      '2aaymuBQ83N8BmwkDrnA24iymfM5TbnGdsPqJ9bbWK4v',
    ],
  },
  {
    key: 'FLC99i7uRrevpbigYWCDdb5FfjFSQaaC8bqfTzRnYZtw',
    tokens: [
      'BNf9LShPbTp1e9xLg1us1Vi45pejqCj8TgRRkbcqcR5w',
      '2aaymuBQ83N8BmwkDrnA24iymfM5TbnGdsPqJ9bbWK4v',
    ],
  },
];

export const getSwaps = (
  allocations: (Pick<TokenAllocation, 'tokenMint' | 'percentage'> & {
    quantity: number;
    usdcPrice: number;
  })[]
) => {
  const totalUSDCValue = allocations.reduce(
    (sum, alloc) => sum + alloc.quantity * alloc.usdcPrice,
    0
  );
  const target: { [key: string]: { quantity: number; usdcTotal: number } } = {};
  for (const alloc of allocations) {
    const usdcTotal = (alloc.percentage / 100) * totalUSDCValue;
    target[alloc.tokenMint] = {
      usdcTotal,
      quantity: usdcTotal / alloc.usdcPrice,
    };
  }
  const isBalanced = () =>
    allocations.every(
      (alloc) =>
        alloc.quantity.toFixed(2) ===
        target[alloc.tokenMint].quantity.toFixed(2)
    );
  const swaps: {
    from: string;
    to: string;
    amountOut: number;
    amountIn: number;
  }[] = [];
  while (!isBalanced()) {
    const to = allocations.find(
      (a) => a.quantity < target[a.tokenMint].quantity
    );
    const from = allocations.find(
      (a) => a.quantity > target[a.tokenMint].quantity
    );

    if (!to || !from) break;
    const usdcValueToSwap = Math.min(
      target[to.tokenMint].usdcTotal - to.usdcPrice * to.quantity,
      // this is how much from how in total, it can't be more than this;
      from.usdcPrice * from.quantity
    );

    const amountIn = usdcValueToSwap / from.usdcPrice;
    const amountOut = usdcValueToSwap / to.usdcPrice;
    swaps.push({ from: from.tokenMint, to: to.tokenMint, amountIn, amountOut });
    from.quantity -= amountIn;
    to.quantity += amountOut;
  }
  return swaps;
};

export const executeSwaps = async (portfolioAccount: string) => {
  const col = await getPortfolioCol();
  const tokenAllocationCol = await getTokenAllocationCol();
  const portfolio = (await col.findOne({ accountKey: portfolioAccount }))!;
  const allocations = await tokenAllocationCol
    .find({ portfolioId: portfolio._id.toString() })
    .toArray();
  // we need to figure out how to match the allocation distribution defined in the portfolio;
  const tokenPrices = await fetchTokenPrices(
    supportTokens.filter((t) => t.name !== 'USDC').map((t) => t.mainnetAddress),
    supportTokens.find((t) => t.name === 'USDC')!.mainnetAddress
  );
  const tokenQuantities = await Promise.all(
    allocations.map(async (alloc) => {
      const account = getAssociatedTokenAddressSync(
        new PublicKey(alloc.tokenMint),
        new PublicKey(portfolioAccount),
        true
      );
      try {
        const balance = await connection.getTokenAccountBalance(account);
        return balance.value;
      } catch {
        console.log('No balance found for', alloc.tokenMint);
        return {
          uiAmount: 0,
          amount: '0',
          decimals: 9,
        };
      }
    })
  );
  const parsedAllocations = allocations.map((alloc, i) => ({
    ...alloc,
    quantity: tokenQuantities[i].uiAmount!,
    usdcPrice: 1,
  }));
  const swaps = getSwaps(parsedAllocations);

  const payer = await getPayerWallet();
  const program = await getProgram(payer);
  const raydium = await initSdk(payer, connection);
  console.log('Swaps', { swaps });
  const instructions = await Promise.all(
    swaps.map(async (swap) => {
      const poolAccount = pools.find(
        (p) => p.tokens.includes(swap.from) && p.tokens.includes(swap.to)
      )!.key;
      const data = await raydium.cpmm.getPoolInfoFromRpc(poolAccount);
      const poolInfo = data.poolInfo;
      const poolKeys = data.poolKeys;
      const inAmount = new anchor.BN(swap.amountIn * 10 ** 9).abs().toNumber();
      const out = new anchor.BN(swap.amountOut * 10 ** 9).abs().toNumber();
      console.log('numbers', { inAmount, out });
      if (inAmount === 0 || out === 0) {
        console.log('Should skip this one');
        return Promise.resolve();
      }
      return program.methods
        .rebalancePortfolio(new anchor.BN(inAmount), new anchor.BN(out))
        .accounts({
          ammConfig: new PublicKey(poolKeys.config.id),
          authority: new PublicKey(poolKeys.authority),
          inputTokenAccount: getAssociatedTokenAddressSync(
            new PublicKey(swap.from),
            new PublicKey(portfolioAccount),
            true
          ),
          outputTokenAccount: getAssociatedTokenAddressSync(
            new PublicKey(swap.to),
            new PublicKey(portfolioAccount),
            true
          ),
          inputTokenMint: new PublicKey(swap.from),
          outputTokenMint: new PublicKey(swap.to),
          inputVault: data.rpcData.vaultA,
          outputVault: data.rpcData.vaultB,
          portfolioAccount: new PublicKey(portfolioAccount),
          observationState: getPdaObservationId(
            new PublicKey(poolInfo.programId),
            new PublicKey(poolInfo.id)
          ).publicKey,
          poolState: new PublicKey(poolKeys.id),
          payer: payer.publicKey,
          cpSwapProgram: new PublicKey(poolInfo.programId),
          inputTokenProgram: TOKEN_PROGRAM_ID,
          outputTokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();
    })
  );
  const ret = await connection.sendTransaction(
    new Transaction().add(...instructions.filter((i) => !!i)),
    [payer]
  );

  console.log(ret);
};
