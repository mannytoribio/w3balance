import {
  CREATE_CPMM_POOL_PROGRAM,
  CREATE_CPMM_POOL_FEE_ACC,
  getMultipleLookupTableInfo,
  DEVNET_PROGRAM_ID,
  getCpmmPdaAmmConfigId,
} from '@raydium-io/raydium-sdk-v2';
// import BN from 'bn.js';
import { initSdk, txVersion } from './config';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

export const createPool = async (
  owner: Keypair,
  connection: Connection,
  mint1: PublicKey,
  mint2: PublicKey
) => {
  const raydium = await initSdk(owner, connection);
  const mintA = await raydium.token.getTokenInfo(mint1);
  const mintB = await raydium.token.getTokenInfo(mint2);
  const feeConfigs = await raydium.api.getCpmmConfigs();

  feeConfigs.forEach((config) => {
    config.id = getCpmmPdaAmmConfigId(
      DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM,
      config.index
    ).publicKey.toBase58();
  });

  const { execute, extInfo } = await raydium.cpmm.createPool({
    // poolId: // your custom publicKey, default sdk will automatically calculate pda pool id
    programId: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM, // mainnet: CREATE_CPMM_POOL_PROGRAM
    poolFeeAccount: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_FEE_ACC, // mainnet:  CREATE_CPMM_POOL_FEE_ACC
    mintA,
    mintB,
    mintAAmount: new anchor.BN(1 * 10 ** mintA.decimals),
    mintBAmount: new anchor.BN(10000 * 10 ** mintB.decimals),
    startTime: new anchor.BN(0),
    feeConfig: feeConfigs[0],
    associatedOnly: false,
    ownerInfo: {
      useSOLBalance: true,
    },
    txVersion,
  });
  console.log('exeucting transaction');
  // don't want to wait confirm, set sendAndConfirm to false or don't pass any params to execute
  try {
    const { txId } = await execute({
      sendAndConfirm: true,
      skipPreflight: true,
    });

    console.log(txId);

    return extInfo.address.poolId;
  } catch (e) {
    console.log(JSON.stringify(e));
    throw e;
  }
};
