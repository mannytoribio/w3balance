import AllocationTable from "./AllocationTable"
import PortfolioAllocationCharts from "./PortfolioAllocationCharts"

export default function Dashboard() {
  return (
    <>
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Portfolio Allocations</h2>
        <AllocationTable />
        <h2 className="text-2xl font-bold mt-10 mb-4">Distributions</h2>
        <PortfolioAllocationCharts />
      </div>
    </>
  )
}
