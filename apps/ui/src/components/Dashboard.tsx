import React, { useState } from 'react';
import AllocationTable from './AllocationTable';
import PortfolioAllocationCharts from './PortfolioAllocationCharts';
import ThresholdSelection from './ThresholdSelection';
import { getProgram, useProvider } from '@/contract';
import { PublicKey, Transaction } from '@solana/web3.js';
import { utils } from '@project-serum/anchor';
import { useWallet } from '@jup-ag/wallet-adapter';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

const mints = [
  '6EQssH3g3sjxredCgJoumxB8duVsxJ2u8JHB3zwF1n11',
  '6Qb1Wzq7u1mZKkjn2fq7sK9Q6f1Lx3bwQ5xRMsQmBrJ3',
  '6T9Gx3ewdhMGPp7WH5oFRpT4UnhBa17M7Rf5RAkm6j5a',
  'BNf9LShPbTp1e9xLg1us1Vi45pejqCj8TgRRkbcqcR5w',
  '2aaymuBQ83N8BmwkDrnA24iymfM5TbnGdsPqJ9bbWK4v',
];

export default function Dashboard() {
  const initialAllocations = [
    {
      id: 1,
      token: 'SOL',
      allocation: 50,
      usdValue: 5000,
      tokenQty: 50,
      targetUsdValue: 5000,
      targetTokenQty: 50,
      locked: false,
    },
    {
      id: 2,
      token: 'ETH',
      allocation: 20,
      usdValue: 2000,
      tokenQty: 1,
      targetUsdValue: 2000,
      targetTokenQty: 1,
      locked: false,
    },
    {
      id: 3,
      token: 'BTC',
      allocation: 15,
      usdValue: 1500,
      tokenQty: 0.05,
      targetUsdValue: 1500,
      targetTokenQty: 0.05,
      locked: false,
    },
    {
      id: 4,
      token: 'USDC',
      allocation: 15,
      usdValue: 1500,
      tokenQty: 1500,
      targetUsdValue: 1500,
      targetTokenQty: 1500,
      locked: false,
    },
  ];

  const [rebalanceType, setRebalanceType] = useState('time');
  const [portfolioName, setPortfolioName] = useState(
    new Date().toISOString().slice(0, 5)
  );
  const [timeInterval, setTimeInterval] = useState('monthly');
  const [threshold, setThreshold] = useState('5');
  const [allocations, setAllocations] = useState(initialAllocations);
  const [fundingAmount, setFundingAmount] = useState(10);
  const { provider } = useProvider()!;
  const wallet = useWallet();

  const handleSubmit = async () => {
    const data = {
      rebalanceType,
      threshold,
      timeInterval,
      allocations,
      portfolioName,
    };
    const program = await getProgram(provider);
    const [portfolioAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(utils.bytes.utf8.encode('portfolio')),
        wallet.publicKey!.toBuffer(),
        Buffer.from(utils.bytes.utf8.encode(portfolioName)),
      ],
      program.programId
    );

    console.log('Portfolio account:', portfolioAccount);
    let createPortfolioInstruction = await program.methods
      .createPortfolio({
        uniqueName: portfolioName,
        delegatedRebalanceAddress: wallet.publicKey!,
      })
      .accounts({
        payer: wallet.publicKey!,
        portfolioAccount,
        delegatedRebalanceAddress: wallet.publicKey!,
      })
      .transaction();

    for (const mint of mints.slice(0, 1)) {
      const [portfolioTokenAllocationAccount] =
        PublicKey.findProgramAddressSync(
          [
            Buffer.from(utils.bytes.utf8.encode('portfolio_token_allocation')),
            portfolioAccount.toBuffer(),
            wallet.publicKey!.toBuffer(),
            new PublicKey(mint).toBuffer(),
          ],
          program.programId
        );
      const portfolioTokenAllocationTokenAccount =
        getAssociatedTokenAddressSync(
          new PublicKey(mint),
          portfolioTokenAllocationAccount,
          true
        );
      const createPortfolioTokenAllocationInstruction = await program.methods
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
        .instruction();
      createPortfolioInstruction = createPortfolioInstruction.add(
        createPortfolioTokenAllocationInstruction
      );
    }

    console.log('instruction:', createPortfolioInstruction);
    const ret = await wallet.sendTransaction(
      createPortfolioInstruction,
      provider.connection,
      {
        skipPreflight: true,
      }
    );
    console.log('what the fuck?');
    console.log('Data for submission ret:', ret);
  };

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
  );
}
