import React, { useState } from 'react';
import AllocationTable from './AllocationTable';
import PortfolioAllocationCharts from './PortfolioAllocationCharts';
import ThresholdSelection from './ThresholdSelection';
import { getProgram, useProvider } from '@/contract';
import { PublicKey, Transaction } from '@solana/web3.js';
import { utils } from '@project-serum/anchor';
import { useWallet } from '@jup-ag/wallet-adapter';

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
  const [portfolioName, setPortfolioName] = useState('My First Portfolio');
  const [timeInterval, setTimeInterval] = useState('monthly');
  const [threshold, setThreshold] = useState('5');
  const [allocations, setAllocations] = useState(initialAllocations);
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
      .instruction();

    // TODO: building transactions this way doesn't quite work;
    const transaction = new Transaction().add(createPortfolioInstruction);

    console.log('instruction:', transaction);
    const ret = await wallet.sendTransaction(transaction, provider.connection, {
      skipPreflight: true,
    });
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
        allocations={allocations}
        setAllocations={setAllocations}
        handleSubmit={handleSubmit} // Pass handleSubmit
      />
      <h2 className="text-2xl font-bold mt-10 mb-4">Distributions</h2>
      <PortfolioAllocationCharts />
    </div>
  );
}
