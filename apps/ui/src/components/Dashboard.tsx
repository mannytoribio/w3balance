import React, { useState } from "react"
import AllocationTable from "./AllocationTable"
import PortfolioAllocationCharts from "./PortfolioAllocationCharts"
import ThresholdSelection from "./ThresholdSelection"

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
    },
    {
      id: 4,
      token: "USDC",
      allocation: 15,
      usdValue: 1500,
      tokenQty: 1500,
      targetUsdValue: 1500,
      targetTokenQty: 1500,
      locked: false,
    },
  ]

  const [rebalanceType, setRebalanceType] = useState("time")
  const [timeInterval, setTimeInterval] = useState("monthly")
  const [threshold, setThreshold] = useState("5")
  const [allocations, setAllocations] = useState(initialAllocations) // Initialize as needed

  const handleSubmit = () => {
    const data = {
      rebalanceType,
      threshold,
      timeInterval,
      allocations,
    }
    console.log("Data for submission:", data)
    // Handle submission logic here (e.g., API call)
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
        allocations={allocations}
        setAllocations={setAllocations}
        handleSubmit={handleSubmit} // Pass handleSubmit
      />
      <h2 className="text-2xl font-bold mt-10 mb-4">Distributions</h2>
      <PortfolioAllocationCharts />
    </div>
  )
}
