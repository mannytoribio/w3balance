import React from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

const tokenOptions = [
  { value: "SOL", label: "SOL", color: "#DB1FFF" },
  { value: "ETH", label: "ETH", color: "#0D8310" },
  { value: "BTC", label: "BTC", color: "#FE9415" },
  { value: "USDC", label: "USDC", color: "#2774CA" },
]

interface Allocation {
  id: number
  token: string
  allocation: number
  usdValue: number
  tokenQty: number
  targetUsdValue?: number
  targetTokenQty?: number
}

interface PortfolioAllocationChartsProps {
  allocations: Allocation[]
}

const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function PortfolioAllocationCharts({
  allocations,
}: PortfolioAllocationChartsProps) {
  const totalUsdValue = allocations.reduce(
    (sum, alloc) => sum + alloc.usdValue,
    0
  )

  const currentDistribution = allocations.map((alloc) => ({
    name: alloc.token,
    value: alloc.usdValue,
    percentage: (alloc.usdValue / totalUsdValue) * 100,
  }))

  const targetDistribution = allocations.map((alloc) => ({
    name: alloc.token,
    value: alloc.allocation, // Target percentage
    percentage: alloc.allocation,
  }))

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4">
      <div className="w-full md:w-1/2 mb-4 md:mb-0">
        <h2 className="text-xl font-bold mb-1 text-center">Current</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={currentDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {currentDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    tokenOptions.find((t) => t.value === entry.name)?.color ||
                    "#CCCCCC"
                  }
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-center mt-2">
          Total: ${totalUsdValue.toLocaleString()}
        </p>
      </div>
      <div className="w-full md:w-1/2">
        <h2 className="text-xl font-bold mb-1 text-center">Target</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={targetDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {targetDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    tokenOptions.find((t) => t.value === entry.name)?.color ||
                    "#CCCCCC"
                  }
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-center mt-2">
          Deviation: <span className="text-[#198754]">0%</span>
        </p>
      </div>
    </div>
  )
}
