import { AnchorProvider, Program } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js"
import { type W3balanceContract } from "./w3balance_contract"

// TODO: add public key
export const programId = new PublicKey("NEED")

export const getProgram = async (provider: AnchorProvider) => {
  const idl = await Program.fetchIdl(programId, provider)
  return new Program(
    idl!,
    programId,
    provider
  ) as unknown as Program<W3balanceContract>
}
