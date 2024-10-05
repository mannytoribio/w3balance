import { Portfolio, PortfolioTokenAllocation, TokenPrice } from '@/trpc';
import { formatDistanceToNow } from 'date-fns';
import { RefreshCw, Eye, Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, Pie, Cell, Tooltip, PieChart } from 'recharts';
import { Button } from './ui/button';
import { TableRow, TableCell } from './ui/table';
import { useProvider } from '@/contract';
import { supportTokens } from '@libs/program';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { Badge } from './ui/badge';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
];

interface PortfolioListItemProps {
  portfolio: Portfolio;
  tokenPrices: TokenPrice[];
}

export const PortfolioListItem = (props: PortfolioListItemProps) => {
  const [tokenBalances, setTokenBalances] = useState<{
    [key: string]: { usdc: number; amount: number };
  }>({});
  const { provider } = useProvider()!;
  const { portfolio, tokenPrices } = props;

  console.log(portfolio);

  useEffect(() => {
    (async () => {
      const temp: typeof tokenBalances = {};
      console.log(portfolio.allocations);
      for (const alloc of portfolio.allocations) {
        const balance = await getTokenAllocationTokenBalance(alloc);
        const usdcValue = getUSDCValue(alloc.tokenMint, balance!);
        temp[alloc.tokenMint] = { usdc: usdcValue, amount: balance! };
      }
      setTokenBalances(temp);
    })();
  }, [tokenPrices, portfolio, provider]);

  const getUSDCValue = (tokenMint: string, amount: number) => {
    if (!tokenPrices) {
      return 0;
    }
    const token = supportTokens.find((t) => t.devnetAddress === tokenMint)!;
    if (token.name === 'USDC') {
      return amount;
    } else {
      const price = tokenPrices.find(
        (p) => p.id === token.mainnetAddress
      )!.price;
      return price * amount;
    }
  };

  const getTokenAllocationTokenBalance = async (
    alloc: PortfolioTokenAllocation
  ) => {
    console.log(alloc);
    const account = getAssociatedTokenAddressSync(
      new PublicKey(alloc.tokenMint),
      new PublicKey(alloc.accountKey),
      true
    );
    try {
      const balance = await provider.connection.getTokenAccountBalance(account);
      return balance.value.uiAmount;
    } catch (error) {
      console.error('Error fetching token balance', error);
      return 0;
    }
  };

  return (
    <TableRow
      key={portfolio.accountKey}
      className="border-t-8 border-background"
    >
      <TableCell className="font-medium">{portfolio.name}</TableCell>
      <TableCell>
        <Badge variant="outline">
          <RefreshCw className="mr-1 h-3 w-3" />
          {portfolio.rebalanceFrequency} days
        </Badge>
      </TableCell>
      <TableCell>
        {formatDistanceToNow(portfolio.createdAt, {
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolio.allocations}
                  dataKey="percentage"
                  nameKey="tokenMint"
                  cx="50%"
                  cy="50%"
                  outerRadius={40}
                  fill="#8884d8"
                  label
                >
                  {portfolio.allocations.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value}% ($${tokenBalances[name]?.usdc.toLocaleString(
                      'en',
                      {
                        currency: 'USD',
                        style: 'currency',
                        minimumFractionDigits: 2,
                      }
                    )})`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            {portfolio.allocations?.map((allocation) => (
              <div key={allocation.accountKey} className="mb-1">
                <span className="font-semibold">
                  {
                    supportTokens.find(
                      (t) => t.devnetAddress === allocation.tokenMint
                    )?.symbol
                  }
                </span>{' '}
                {allocation.percentage.toFixed(2)}%
                <span className="text-muted-foreground ml-1">
                  $
                  {tokenBalances[allocation.tokenMint]?.usdc.toLocaleString(
                    'en',
                    {
                      currency: 'USD',
                      style: 'currency',
                      minimumFractionDigits: 2,
                    }
                  )}
                </span>
              </div>
            ))}
            <div className="mt-2 font-bold">
              Total: $
              {Object.values(tokenBalances)
                .reduce((sum, curr) => sum + curr.usdc, 0)
                .toLocaleString('en', {
                  currency: 'USD',
                  style: 'currency',
                  minimumFractionDigits: 2,
                })}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-1 h-4 w-4" /> View
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-1 h-4 w-4" /> Edit
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
