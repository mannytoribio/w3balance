import {
  ApiV3PoolInfoStandardItemCpmm,
  CpmmKeys,
  Percent,
  getPdaPoolAuthority,
} from '@raydium-io/raydium-sdk-v2';
import { initSdk, txVersion } from './config';
import Decimal from 'decimal.js';
import { isValidCpmm } from './utils';
import { Connection, Keypair } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

export const deposit = async (
  owner: Keypair,
  connection: Connection,
  poolId: string,
  uiInputAmount: string
) => {
  const raydium = await initSdk(owner, connection);
  console.log('hello world?');
  // SOL - USDC pool
  let poolInfo: ApiV3PoolInfoStandardItemCpmm;
  let poolKeys: CpmmKeys | undefined;

  if (raydium.cluster === 'mainnet') {
    // note: api doesn't support get devnet pool info, so in devnet else we go rpc method
    // if you wish to get pool info from rpc, also can modify logic to go rpc method directly
    const data = await raydium.api.fetchPoolById({ ids: poolId });
    poolInfo = data[0] as ApiV3PoolInfoStandardItemCpmm;
    if (!isValidCpmm(poolInfo.programId))
      throw new Error('target pool is not CPMM pool');
  } else {
    const data = await raydium.cpmm.getPoolInfoFromRpc(poolId);
    poolInfo = data.poolInfo;
    poolKeys = data.poolKeys;
  }

  //   const uiInputAmount = '0.0001';
  console.log(uiInputAmount);
  const inputAmount = new anchor.BN(
    new Decimal(uiInputAmount).mul(10 ** poolInfo.mintA.decimals).toFixed(0)
  );
  console.log(inputAmount);
  const slippage = new Percent(100, 100); // 1%
  const baseIn = true;

  // computePairAmount is not necessary, addLiquidity will compute automatically,
  // just for ui display
  /*
  const res = await raydium.cpmm.getRpcPoolInfos([poolId]);
  const pool1Info = res[poolId];

  const computeRes = await raydium.cpmm.computePairAmount({
    baseReserve: pool1Info.baseReserve,
    quoteReserve: pool1Info.quoteReserve,
    poolInfo,
    amount: uiInputAmount,
    slippage,
    baseIn,
    epochInfo: await raydium.fetchEpochInfo()
  });

  computeRes.anotherAmount.amount -> pair amount needed to add liquidity
  computeRes.anotherAmount.fee -> token2022 transfer fee, might be undefined if isn't token2022 program
  */

  const { execute, transaction } = await raydium.cpmm.addLiquidity({
    poolInfo,
    poolKeys,
    inputAmount,
    slippage,
    baseIn,
    txVersion,
  });
  // don't want to wait confirm, set sendAndConfirm to false or don't pass any params to execute
  const { txId } = await execute({ sendAndConfirm: true });
  console.log(txId);
};
