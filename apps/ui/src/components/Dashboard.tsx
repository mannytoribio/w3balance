import React, { useState } from "react"
import AllocationTable from "./AllocationTable"
import PortfolioAllocationCharts from "./PortfolioAllocationCharts"
import ThresholdSelection from "./ThresholdSelection"
import { getProgram, useProvider } from "@/contract"
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js"
import { utils } from "@project-serum/anchor"
import { useWallet } from "@jup-ag/wallet-adapter"
import { getAssociatedTokenAddressSync } from "@solana/spl-token"
import * as anchor from "@project-serum/anchor"

const mints = [
  "6EQssH3g3sjxredCgJoumxB8duVsxJ2u8JHB3zwF1n11",
  "6Qb1Wzq7u1mZKkjn2fq7sK9Q6f1Lx3bwQ5xRMsQmBrJ3",
  "6T9Gx3ewdhMGPp7WH5oFRpT4UnhBa17M7Rf5RAkm6j5a",
  "BNf9LShPbTp1e9xLg1us1Vi45pejqCj8TgRRkbcqcR5w",
  "2aaymuBQ83N8BmwkDrnA24iymfM5TbnGdsPqJ9bbWK4v",
]

export default function Dashboard() {
  const initialAllocations = [
    {
      id: 1,
      token: "SOL",
      allocation: 50,
      usdValue: 5000,
      tokenQty: 50,
      targetUsdValue: 5000,
      targetTokenQty: 50,
      locked: false,
      mintId: "6EQssH3g3sjxredCgJoumxB8duVsxJ2u8JHB3zwF1n11",
    },
    {
      id: 2,
      token: "ETH",
      allocation: 20,
      usdValue: 2000,
      tokenQty: 1,
      targetUsdValue: 2000,
      targetTokenQty: 1,
      locked: false,
      mintId: "6Qb1Wzq7u1mZKkjn2fq7sK9Q6f1Lx3bwQ5xRMsQmBrJ3",
    },
    {
      id: 3,
      token: "BTC",
      allocation: 15,
      usdValue: 1500,
      tokenQty: 0.05,
      targetUsdValue: 1500,
      targetTokenQty: 0.05,
      locked: false,
      mintId: "6T9Gx3ewdhMGPp7WH5oFRpT4UnhBa17M7Rf5RAkm6j5a",
    },
    {
      id: 4,
      token: "USDC",
      allocation: 15,
      usdValue: 1,
      tokenQty: 1500,
      targetUsdValue: 1500,
      targetTokenQty: 1500,
      locked: false,
      mintId: "BNf9LShPbTp1e9xLg1us1Vi45pejqCj8TgRRkbcqcR5w",
    },
  ]

  const [rebalanceType, setRebalanceType] = useState("time")
  const [portfolioName, setPortfolioName] = useState(
    (Math.random() + 1).toString(36).substring(7)
  )
  const [timeInterval, setTimeInterval] = useState("monthly")
  const [threshold, setThreshold] = useState("5")
  const [allocations, setAllocations] = useState(initialAllocations)
  const [fundingAmount, setFundingAmount] = useState(10)
  const { provider } = useProvider()!
  const wallet = useWallet()

  const handleSubmit = async () => {
    const data = {
      rebalanceType,
      threshold,
      timeInterval,
      allocations,
      portfolioName,
    }
    const program = await getProgram(provider)
    const [portfolioAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(utils.bytes.utf8.encode("portfolio")),
        wallet.publicKey!.toBuffer(),
        Buffer.from(utils.bytes.utf8.encode(portfolioName)),
      ],
      program.programId
    )

    console.log("Portfolio account:", portfolioAccount.toString())
    const createPortfolioInstruction = await program.methods
      .createPortfolio({
        uniqueName: portfolioName,
        delegatedRebalanceAddress: wallet.publicKey!,
      })
      .accounts({
        payer: wallet.publicKey!,
        portfolioAccount,
        delegatedRebalanceAddress: wallet.publicKey!,
      })
      .instruction()
    const mintInstructions: TransactionInstruction[] = []
    for (const mint of mints) {
      const [portfolioTokenAllocationAccount] =
        PublicKey.findProgramAddressSync(
          [
            Buffer.from(utils.bytes.utf8.encode("portfolio_token_allocation")),
            portfolioAccount.toBuffer(),
            wallet.publicKey!.toBuffer(),
            new PublicKey(mint).toBuffer(),
          ],
          program.programId
        )
      const portfolioTokenAllocationTokenAccount =
        getAssociatedTokenAddressSync(
          new PublicKey(mint),
          portfolioAccount,
          true
        )
      mintInstructions.push(
        await program.methods
          .addPortfolioTokenAllocation({
            percentage: 20,
            tokenMint: new PublicKey(mint),
          })
          .accounts({
            payer: wallet.publicKey!,
            portfolioTokenAllocationAccount,
            portfolioAccount,
            mintAccount: new PublicKey(mint),
            portfolioTokenAllocationTokenAccount,
          })
          .instruction()
      )
    }

    const ownerTokenAccount = getAssociatedTokenAddressSync(
      // we are treating the first token as the deposit or basically USDC;
      // we have an expectation that they have a token account already, if they don't we should throw an error;
      new PublicKey(mints[0]),
      wallet.publicKey!,
      false
    )
    const [portfolioTokenAllocationAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(utils.bytes.utf8.encode("portfolio_token_allocation")),
        portfolioAccount.toBuffer(),
        wallet.publicKey!.toBuffer(),
        new PublicKey(mints[0]).toBuffer(),
      ],
      program.programId
    )
    const portfolioTokenAllocationTokenAccount = getAssociatedTokenAddressSync(
      new PublicKey(mints[0]),
      portfolioAccount,
      true
    )
    const depositInstruction = await program.methods
      .depositPortfolio({
        amount: new anchor.BN(10 * 10 ** 9),
      })
      .accounts({
        portfolioAccount,
        payer: wallet.publicKey!,
        payerTokenAccount: ownerTokenAccount,
        portfolioTokenAllocationAccount,
        portfolioTokenAllocationTokenAccount,
      })
      .instruction()

    const ret = await wallet.sendTransaction(
      new Transaction().add(
        createPortfolioInstruction,
        ...mintInstructions,
        depositInstruction
      ),
      provider.connection,
      {
        skipPreflight: true,
      }
    )
    console.log("what the fuck?")
    console.log("Data for submission ret:", ret)
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-4">Portfolio Allocations</h2>
      <ThresholdSelection
        rebalanceType={rebalanceType}
        setRebalanceType={setRebalanceType}
        timeInterval={timeInterval}
        setTimeInterval={setTimeInterval}
        threshold={threshold}
        setThreshold={setThreshold}
      />
      <AllocationTable
        fundingAmount={fundingAmount}
        setFundingAmount={setFundingAmount}
        allocations={allocations}
        setAllocations={setAllocations}
        handleSubmit={handleSubmit} // Pass handleSubmit
      />
      <h2 className="text-2xl font-bold mt-10 mb-4">Distributions</h2>
      <PortfolioAllocationCharts />
    </div>
  )
}
