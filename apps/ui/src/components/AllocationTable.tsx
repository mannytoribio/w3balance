import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Lock, Unlock, Scale } from "lucide-react"

const tokenOptions = [
  { value: "SOL", label: "SOL", color: "#DB1FFF" },
  { value: "ETH", label: "ETH", color: "#FFEE5F" },
  { value: "BTC", label: "BTC", color: "#FE9415" },
  { value: "USDC", label: "USDC", color: "#2774CA" },
]

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

export default function AllocationTable() {
  const [allocations, setAllocations] = useState(initialAllocations)

  const handleTokenChange = (id: number, value: string) => {
    setAllocations(
      allocations.map((alloc) =>
        alloc.id === id ? { ...alloc, token: value } : alloc
      )
    )
  }

  const handleAllocationChange = (id: number, value: string) => {
    const newValue = parseFloat(value)
    if (isNaN(newValue)) return
    setAllocations(
      allocations.map((alloc) =>
        alloc.id === id ? { ...alloc, allocation: newValue } : alloc
      )
    )
  }

  const handleDeleteRow = (id: number) => {
    setAllocations(allocations.filter((alloc) => alloc.id !== id))
  }

  const addNewRow = () => {
    const newId = Math.max(...allocations.map((a) => a.id)) + 1
    setAllocations([
      ...allocations,
      {
        id: newId,
        token: "",
        allocation: 0,
        usdValue: 0,
        tokenQty: 0,
        targetUsdValue: 0,
        targetTokenQty: 0,
        locked: false,
      },
    ])
  }

  const toggleLock = (id: number) => {
    setAllocations(
      allocations.map((alloc) =>
        alloc.id === id ? { ...alloc, locked: !alloc.locked } : alloc
      )
    )
  }

  const rebalanceAllocations = () => {
    const lockedAllocation = allocations
      .filter((alloc) => alloc.locked)
      .reduce((sum, alloc) => sum + alloc.allocation, 0)

    const unlockedAllocations = allocations.filter((alloc) => !alloc.locked)
    const remainingAllocation = 100 - lockedAllocation
    const equalShare = remainingAllocation / unlockedAllocations.length

    setAllocations(
      allocations.map((alloc) =>
        alloc.locked
          ? alloc
          : { ...alloc, allocation: Number(equalShare.toFixed(2)) }
      )
    )
  }

  const fundAllocation = () => {
    console.log("allocations", allocations)
  }

  const totalAllocation = allocations.reduce(
    (sum, alloc) => sum + alloc.allocation,
    0
  )
  const totalUsdValue = allocations.reduce(
    (sum, alloc) => sum + alloc.usdValue,
    0
  )
  const totalTargetUsdValue = allocations.reduce(
    (sum, alloc) => sum + alloc.targetUsdValue,
    0
  )

  return (
    <div className="p-4 bg-white rounded-lg shadow-custom-shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Asset</TableHead>
            <TableHead>Target %</TableHead>
            <TableHead>USD Value</TableHead>
            <TableHead>Token Qty</TableHead>
            <TableHead>Target USD Value</TableHead>
            <TableHead>Target Token Qty</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allocations.map((alloc) => (
            <TableRow key={alloc.id}>
              <TableCell>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor:
                      tokenOptions.find((t) => t.value === alloc.token)
                        ?.color || "#CCCCCC",
                  }}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={alloc.token}
                  onValueChange={(value: string) =>
                    handleTokenChange(alloc.id, value)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokenOptions.map((token) => (
                      <SelectItem key={token.value} value={token.value}>
                        {token.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={alloc.allocation}
                    onChange={(e) =>
                      handleAllocationChange(alloc.id, e.target.value)
                    }
                    className="w-20 mr-2"
                  />
                  <span>%</span>
                </div>
              </TableCell>
              <TableCell>${alloc.usdValue.toLocaleString()}</TableCell>
              <TableCell>{alloc.tokenQty}</TableCell>
              <TableCell>${alloc.targetUsdValue.toLocaleString()}</TableCell>
              <TableCell>{alloc.targetTokenQty}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleLock(alloc.id)}
                  >
                    {alloc.locked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRow(alloc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2} className="font-bold">
              Total
            </TableCell>
            <TableCell className="font-bold">{totalAllocation}%</TableCell>
            <TableCell className="font-bold">
              ${totalUsdValue.toLocaleString()}
            </TableCell>
            <TableCell></TableCell>
            <TableCell className="font-bold">
              ${totalTargetUsdValue.toLocaleString()}
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={rebalanceAllocations}
                title="Rebalance allocations"
              >
                <Scale className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4">
        <Button onClick={addNewRow}>Add Token</Button>
        <Button onClick={fundAllocation}>Fund It</Button>
      </div>
    </div>
  )
}
