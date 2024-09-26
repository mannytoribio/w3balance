import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import BN from 'bn.js';
import { createPoolFeeReceive, cpSwapProgram } from './config';
import { W3balanceContract } from '../target/types/w3balance_contract';
import {
  PublicKey,
  Signer,
  ConfirmOptions,
  SystemProgram,
  ComputeBudgetProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { ASSOCIATED_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import {
  getAuthAddress,
  getPoolAddress,
  getPoolLpMintAddress,
  getPoolVaultAddress,
  getOrcleAccountAddress,
} from './pda';
import { CpmmPoolInfoLayout } from '@raydium-io/raydium-sdk-v2';
import * as raydium from '@raydium-io/raydium-sdk-v2';
import { Program, Wallet } from '@coral-xyz/anchor';

export async function initialize(
  program: Program<W3balanceContract>,
  creator: Signer,
  configAddress: PublicKey,
  token0: PublicKey,
  token0Program: PublicKey,
  token1: PublicKey,
  token1Program: PublicKey,
  confirmOptions?: ConfirmOptions,
  initAmount: { initAmount0: BN; initAmount1: BN } = {
    initAmount0: new BN(10000000000),
    initAmount1: new BN(20000000000),
  },
  createPoolFee = createPoolFeeReceive
) {
  const [auth] = await getAuthAddress(cpSwapProgram);

  const [poolAddress] = await getPoolAddress(
    configAddress,
    token0,
    token1,
    cpSwapProgram
  );
  const [lpMintAddress] = await getPoolLpMintAddress(
    poolAddress,
    cpSwapProgram
  );
  const [vault0] = await getPoolVaultAddress(
    poolAddress,
    token0,
    cpSwapProgram
  );
  const [vault1] = await getPoolVaultAddress(
    poolAddress,
    token1,
    cpSwapProgram
  );
  const [creatorLpTokenAddress] = await PublicKey.findProgramAddress(
    [
      creator.publicKey.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      lpMintAddress.toBuffer(),
    ],
    ASSOCIATED_PROGRAM_ID
  );

  const [observationAddress] = await getOrcleAccountAddress(
    poolAddress,
    cpSwapProgram
  );

  const creatorToken0 = getAssociatedTokenAddressSync(
    token0,
    creator.publicKey,
    false,
    token0Program
  );
  const creatorToken1 = getAssociatedTokenAddressSync(
    token1,
    creator.publicKey,
    false,
    token1Program
  );
  console.log('Init pool', poolAddress.toBase58());
  const r = new raydium.Raydium({});
  const tx = await program.methods
    .proxyInitialize(initAmount.initAmount0, initAmount.initAmount1, new BN(0))
    .accounts({
      cpSwapProgram: cpSwapProgram,
      creator: creator.publicKey,
      ammConfig: configAddress,
      authority: auth,
      poolState: poolAddress,
      token0Mint: token0,
      token1Mint: token1,
      lpMint: lpMintAddress,
      creatorToken0,
      creatorToken1,
      creatorLpToken: creatorLpTokenAddress,
      token0Vault: vault0,
      token1Vault: vault1,
      createPoolFee,
      observationState: observationAddress,
      tokenProgram: TOKEN_PROGRAM_ID,
      token0Program: token0Program,
      token1Program: token1Program,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .preInstructions([
      ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
    ])
    .signers([creator])
    .rpc(confirmOptions);
  const accountInfo = await program.provider.connection.getAccountInfo(
    poolAddress
  );
  const poolState = CpmmPoolInfoLayout.decode(accountInfo.data);
  const cpSwapPoolState = {
    ammConfig: poolState.configId,
    token0Mint: poolState.mintA,
    token0Program: poolState.mintProgramA,
    token1Mint: poolState.mintB,
    token1Program: poolState.mintProgramB,
  };
  return { poolAddress, cpSwapPoolState, tx };
}
