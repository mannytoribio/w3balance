import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Lock, Unlock, Scale } from 'lucide-react';
import { Label } from './ui/label';

const tokenOptions = [
  { value: 'SOL', label: 'SOL', color: '#DB1FFF' },
  { value: 'ETH', label: 'ETH', color: '#FFEE5F' },
  { value: 'BTC', label: 'BTC', color: '#FE9415' },
  { value: 'USDC', label: 'USDC', color: '#2774CA' },
];

type Allocation = {
  id: number;
  token: string;
  allocation: number;
  usdValue: number;
  tokenQty: number;
  targetUsdValue: number;
  targetTokenQty: number;
  locked: boolean;
};

type AllocationTableProps = {
  allocations: Allocation[];
  fundingAmount: number;
  setFundingAmount: (fundingAmount: number) => void;
  setAllocations: (allocations: Allocation[]) => void;
  handleSubmit: () => void;
};

export default function AllocationTable({
  fundingAmount,
  setFundingAmount,
  allocations,
  setAllocations,
  handleSubmit,
}: AllocationTableProps) {
  // const { data, error, isLoading } = trpc.getPrices.useQuery({
  //   tokens: ["SOL", "BTC"],
  //   vsToken: "USDC",
  // })

  // console.log('token price data', data);

  const handleFundingAmountChange = (value: number) => {
    setFundingAmount(value);
  };

  const handleTokenChange = (id: number, value: string) => {
    setAllocations(
      allocations.map((alloc) =>
        alloc.id === id ? { ...alloc, token: value } : alloc
      )
    );
  };

  const handleAllocationChange = (id: number, value: string) => {
    const newValue = parseFloat(value);
    if (isNaN(newValue)) return;
    setAllocations(
      allocations.map((alloc) =>
        alloc.id === id ? { ...alloc, allocation: newValue } : alloc
      )
    );
  };

  const handleDeleteRow = (id: number) => {
    setAllocations(allocations.filter((alloc) => alloc.id !== id));
  };

  const addNewRow = () => {
    const newId = Math.max(...allocations.map((a) => a.id)) + 1;
    setAllocations([
      ...allocations,
      {
        id: newId,
        token: '',
        allocation: 0,
        usdValue: 0,
        tokenQty: 0,
        targetUsdValue: 0,
        targetTokenQty: 0,
        locked: false,
      },
    ]);
  };

  const toggleLock = (id: number) => {
    setAllocations(
      allocations.map((alloc) =>
        alloc.id === id ? { ...alloc, locked: !alloc.locked } : alloc
      )
    );
  };

  const rebalanceAllocations = () => {
    const lockedAllocation = allocations
      .filter((alloc) => alloc.locked)
      .reduce((sum, alloc) => sum + alloc.allocation, 0);

    const unlockedAllocations = allocations.filter((alloc) => !alloc.locked);
    const remainingAllocation = 100 - lockedAllocation;
    const equalShare = remainingAllocation / unlockedAllocations.length;

    setAllocations(
      allocations.map((alloc) =>
        alloc.locked
          ? alloc
          : { ...alloc, allocation: Number(equalShare.toFixed(2)) }
      )
    );
  };

  const totalAllocation = allocations.reduce(
    (sum, alloc) => sum + alloc.allocation,
    0
  );
  const totalUsdValue = allocations.reduce(
    (sum, alloc) => sum + alloc.usdValue,
    0
  );
  const totalTargetUsdValue = allocations.reduce(
    (sum, alloc) => sum + alloc.targetUsdValue,
    0
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-custom-shadow">
      <Table>
        <TableHeader>
          <div className="mb-4 ml-2">
            <Label htmlFor="threshold-input" className="flex mb-2">
              Funding Amount
            </Label>
            <div className="flex items-center">
              <Input
                id="threshold-input"
                type="text"
                value={fundingAmount}
                onChange={(e) =>
                  handleFundingAmountChange(Number(e.target.value))
                }
                className="w-24 mr-2"
              />
              <span className="font-semibold">SOL</span>
            </div>
          </div>
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
                        ?.color || '#CCCCCC',
                  }}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={alloc.token}
                  onValueChange={(value) => handleTokenChange(alloc.id, value)}
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
        <Button onClick={handleSubmit}>Submit</Button> {/* Submit button */}
      </div>
    </div>
  );
}
