import React, { useState, useEffect } from "react"
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
import { Label } from "./ui/label"

const tokenOptions = [
  { value: "SOL", label: "SOL", color: "#DB1FFF", price: 150 },
  { value: "ETH", label: "ETH", color: "#FFEE5F", price: 2475 },
  { value: "BTC", label: "BTC", color: "#FE9415", price: 61000 },
  { value: "USDC", label: "USDC", color: "#2774CA", price: 1 },
]

const initialAllocations = [
  {
    id: 1,
    token: "SOL",
    allocation: 25,
    usdValue: 0,
    tokenQty: 0,
    locked: false,
  },
  {
    id: 2,
    token: "ETH",
    allocation: 25,
    usdValue: 0,
    tokenQty: 0,
    locked: false,
  },
  {
    id: 3,
    token: "BTC",
    allocation: 25,
    usdValue: 0,
    tokenQty: 0,
    locked: false,
  },
  {
    id: 4,
    token: "USDC",
    allocation: 25,
    usdValue: 0,
    tokenQty: 0,
    locked: false,
  },
]

type Allocation = {
  id: number
  token: string
  allocation: number
  usdValue: number
  tokenQty: number
  locked: boolean
  mintId: string
  deviation: number
}

interface AllocationTableProps {
  fundingAmount: number
  setFundingAmount: React.Dispatch<React.SetStateAction<number>>
  allocations: Allocation[]
  setAllocations: React.Dispatch<React.SetStateAction<Allocation[]>>
  handleSubmit: () => void
  isFunded: boolean
}

export default function AllocationTable({
  fundingAmount,
  setFundingAmount,
  allocations,
  setAllocations,
  handleSubmit,
  isFunded,
}: AllocationTableProps) {
  useEffect(() => {
    updateAllocations()
  }, [fundingAmount])

  const updateAllocations = () => {
    setAllocations((prevAllocations) =>
      prevAllocations.map((alloc) => {
        const tokenPrice =
          tokenOptions.find((t) => t.value === alloc.token)?.price || 0
        const targetUsdValue = (alloc.allocation / 100) * fundingAmount
        const targetTokenQty = targetUsdValue / tokenPrice
        return {
          ...alloc,
          targetUsdValue,
          targetTokenQty,
          usdValue: targetUsdValue,
          tokenQty: targetTokenQty,
          deviation: 0,
        }
      })
    )
  }

  const handleTokenChange = (id: number, value: string) => {
    setAllocations(
      allocations.map((alloc) =>
        alloc.id === id ? { ...alloc, token: value } : alloc
      )
    )
    updateAllocations()
  }

  const handleAllocationChange = (id: number, value: string) => {
    const newValue = parseFloat(value)
    if (isNaN(newValue)) return
    setAllocations(
      allocations.map((alloc) =>
        alloc.id === id ? { ...alloc, allocation: newValue } : alloc
      )
    )
    updateAllocations()
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
        mintId: "",
        token: "",
        allocation: 0,
        usdValue: 0,
        tokenQty: 0,
        locked: false,
        deviation: 0,
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
    updateAllocations()
  }

  const totalAllocation = allocations.reduce(
    (sum, alloc) => sum + alloc.allocation,
    0
  )
  const totalUsdValue = allocations.reduce(
    (sum, alloc) => sum + alloc.usdValue,
    0
  )

  return (
    <div className="p-4 bg-white rounded-lg shadow-custom-shadow">
      <div className="mb-4 ml-2">
        <Label htmlFor="threshold-input" className="flex mb-2">
          Funding Amount
        </Label>
        <div className="flex items-center">
          <Input
            id="threshold-input"
            type="number"
            value={fundingAmount}
            onChange={(e) => setFundingAmount(Number(e.target.value))}
            className="w-24 mr-2"
          />
          <span className="font-semibold">USDC</span>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Asset</TableHead>
            <TableHead>Target %</TableHead>
            <TableHead>USD Value</TableHead>
            <TableHead>Token Qty</TableHead>
            <TableHead>{isFunded ? <>Deviation</> : <>Actions</>}</TableHead>
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
                {isFunded ? (
                  <p className="text-start">{alloc.token}</p>
                ) : (
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
                )}
              </TableCell>
              <TableCell>
                {isFunded ? (
                  <p className="text-start">{alloc.allocation}%</p>
                ) : (
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={alloc.allocation}
                      onChange={(e) =>
                        handleAllocationChange(alloc.id, e.target.value)
                      }
                      className="w-20 mr-2"
                      disabled={alloc.locked}
                    />
                    <span>%</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-start">
                ${alloc.usdValue.toLocaleString()}
              </TableCell>
              <TableCell className="text-start">
                {alloc.tokenQty.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                {isFunded ? (
                  <p className="text-[#198754] text-start">
                    {alloc.deviation.toFixed(2)}%
                  </p>
                ) : (
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
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2} className="font-bold text-start">
              Total
            </TableCell>
            <TableCell className="font-bold text-start">
              {totalAllocation.toFixed(2)}%
            </TableCell>
            <TableCell className="font-bold text-start">
              ${totalUsdValue.toLocaleString()}
            </TableCell>
            <TableCell></TableCell>
            {isFunded ? (
              <TableCell></TableCell>
            ) : (
              <TableCell className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={rebalanceAllocations}
                  title="Rebalance allocations"
                >
                  <Scale className="h-4 w-4" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
      {isFunded ? (
        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit}>Trigger Rebalance</Button>
        </div>
      ) : (
        <div className="flex justify-between mt-4">
          <Button onClick={addNewRow}>Add Token</Button>
          <Button onClick={handleSubmit}>Fund It</Button>
        </div>
      )}
    </div>
  )
}
