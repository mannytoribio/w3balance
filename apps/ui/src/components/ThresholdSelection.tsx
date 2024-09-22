import React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

type ThresholdSelectionProps = {
  rebalanceType: string
  setRebalanceType: (value: string) => void
  timeInterval: string
  setTimeInterval: (value: string) => void
  threshold: string
  setThreshold: (value: string) => void
}

export default function ThresholdSelection({
  rebalanceType,
  setRebalanceType,
  timeInterval,
  setTimeInterval,
  threshold,
  setThreshold,
}: ThresholdSelectionProps) {
  const handleThresholdChange = (value: string) => {
    const regex = /^\d*\.?\d{0,2}$/
    if (regex.test(value) || value === "") {
      setThreshold(value)
    }
  }

  return (
    <div className="flex justify-between p-6">
      <div>
        <h2 className="text-2xl text-start font-bold mb-4">
          Rebalance Options
        </h2>
        <RadioGroup
          value={rebalanceType}
          onValueChange={setRebalanceType}
          className="flex flex-col space-y-4 mb-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="time" id="time" />
            <Label htmlFor="time">Rebalance by Time</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Automatically rebalance your portfolio at fixed time
                    intervals.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="threshold" id="threshold" />
            <Label htmlFor="threshold">Rebalance by Threshold</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Rebalance when any asset's allocation deviates from the
                    target by the specified percentage.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </RadioGroup>
      </div>
      <div>
        {rebalanceType === "time" ? (
          <div className="mb-4">
            <Label htmlFor="time-interval" className="block mb-2">
              Rebalance Interval
            </Label>
            <Select value={timeInterval} onValueChange={setTimeInterval}>
              <SelectTrigger id="time-interval" className="w-full">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="mb-4">
            <Label htmlFor="threshold-input" className="block mb-2">
              Threshold Percentage
            </Label>
            <div className="flex items-center">
              <Input
                id="threshold-input"
                type="text"
                value={threshold}
                onChange={(e) => handleThresholdChange(e.target.value)}
                className="w-24 mr-2"
              />
              <span>%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
