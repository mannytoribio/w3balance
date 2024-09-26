import { AnchorProvider, Program, Wallet } from "@project-serum/anchor"
import { Connection, PublicKey } from "@solana/web3.js"
import { type W3balanceContract, IDL } from "./w3balance_contract"
import { useWallet } from "@jup-ag/wallet-adapter"
import { useMemo } from "react"

export const programId = new PublicKey(
  "w3b45toDy6MDc1e3TE81DEefEmU3tFDuDQeJek7Wck9"
)

const url =
  import.meta.env.VITE_REST_ENVIRONMENT === "prod"
    ? "https://rpc.helius.xyz/?api-key=97602bb0-7a52-4f03-ae6a-3527f32b0f09"
    : "https://devnet.helius-rpc.com/?api-key=0c7e899d-480b-4f6f-9d6d-6e980dad3442"

export const useProvider = () => {
  const wallet = useWallet()
  const connection = new Connection(url, "confirmed")
  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return {} as Wallet
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as Wallet
  }, [wallet])

  if (anchorWallet) {
    const provider = new AnchorProvider(connection, anchorWallet, {
      commitment: "confirmed",
    })
    return { provider, wallet: anchorWallet }
  }
}

export const getProgram = async (provider: AnchorProvider) => {
  return new Program(
    IDL,
    programId,
    provider
  ) as unknown as Program<W3balanceContract>
}

// TODO: export function that creates porfolio
