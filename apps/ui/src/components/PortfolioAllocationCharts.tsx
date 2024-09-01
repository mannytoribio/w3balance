import React, { FC } from "react"
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

const initialAllocations = [
  {
    id: 1,
    token: "SOL",
    allocation: 50,
    usdValue: 10000,
    tokenQty: 50,
    targetUsdValue: 5000,
    targetTokenQty: 50,
  },
  {
    id: 2,
    token: "ETH",
    allocation: 20,
    usdValue: 2700,
    tokenQty: 1,
    targetUsdValue: 2000,
    targetTokenQty: 1,
  },
  {
    id: 3,
    token: "BTC",
    allocation: 15,
    usdValue: 3500,
    tokenQty: 0.05,
    targetUsdValue: 1500,
    targetTokenQty: 0.05,
  },
  {
    id: 4,
    token: "USDC",
    allocation: 15,
    usdValue: 2000,
    tokenQty: 2000,
    targetUsdValue: 1500,
    targetTokenQty: 1500,
  },
]

interface CustomizedLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel: FC<CustomizedLabelProps> = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
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
  allocations = initialAllocations,
}) {
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
    value: alloc.allocation,
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
                  fill={tokenOptions.find((t) => t.value === entry.name)?.color}
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
                  fill={tokenOptions.find((t) => t.value === entry.name)?.color}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-center mt-2">Total: 100%</p>
      </div>
    </div>
  )
}
