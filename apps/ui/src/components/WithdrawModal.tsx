import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpRight } from 'lucide-react';
import { useProvider, withdrawPortfolio } from '@/contract';
import { supportTokens } from '@libs/program';
import { useWallet } from '@solana/wallet-adapter-react';

const getToken = (mint: string) =>
  supportTokens.find((t) => t.devnetAddress === mint)!;

interface WithdrawModalProps {
  availableTokens: string[];
  portfolioAccount: string;
  tokenAmounts: { [key: string]: { amount: number; usdc: number } };
}

export function WithdrawModal({
  availableTokens,
  portfolioAccount,
  tokenAmounts,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const provider = useProvider();
  const wallet = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && token) {
      await withdrawPortfolio(
        parseFloat(amount),
        portfolioAccount,
        token,
        provider!.provider,
        wallet
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setIsOpen(false);
      setAmount('');
      setToken('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw from Portfolio</DialogTitle>
          <DialogDescription>
            Enter the amount and select the token you wish to withdraw.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="token" className="text-right">
              Token
            </Label>
            <Select value={token} onValueChange={setToken} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {availableTokens.map((t) => (
                  <SelectItem key={t} value={t}>
                    <div className="flex items-center gap-4">
                      <img
                        className="w-6 h-6"
                        src={`/${getToken(t).icon}`}
                        alt={getToken(t).name}
                      />
                      {getToken(t).name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setAmount(`${(tokenAmounts || {})[token]?.amount}`)}
          >
            Set Max
          </Button>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="0.00"
              required
            />
          </div>
          <Button onClick={handleSubmit} className="mt-4">
            Withdraw
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
