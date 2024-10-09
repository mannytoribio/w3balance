import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  ArrowUpRight,
  Wallet,
  PieChart as PieChartIcon,
  DollarSign,
  ArrowDownRight,
  ArrowUpDown,
  ArrowRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { WithdrawModal } from './WithdrawModal';
import { PortfolioTokenAllocation, trpc } from '@/trpc';
import { supportTokens } from '@libs/program';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { useProvider } from '@/contract';
import { DepositModal } from './DepositModal';

const getToken = (mint: string) =>
  supportTokens.find((t) => t.devnetAddress === mint)!;

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
];

export const ViewPortfolioPage = () => {
  const params = useParams();
  const provider = useProvider();
  const { data: portfolioAgg, isLoading: loading } = trpc.getPortfolio.useQuery(
    params.accountKey!
  );
  const { data: tokenPrices } = trpc.getPrices.useQuery(undefined, {
    refetchInterval: 30 * 1000,
  });
  const [tokenBalances, setTokenBalances] = useState<{
    [key: string]: { usdc: number; amount: number };
  }>({});

  console.log(portfolioAgg);

  useEffect(() => {
    if (Object.keys(tokenBalances).length > 0 || !portfolioAgg) return;
    (async () => {
      const temp: typeof tokenBalances = {};
      for (const alloc of portfolioAgg!.allocations) {
        const balance = await getTokenAllocationTokenBalance(alloc);
        const usdcValue = getUSDCValue(alloc.tokenMint, balance!);
        temp[alloc.tokenMint] = { usdc: usdcValue, amount: balance! };
      }
      setTokenBalances(temp);
    })();
  }, [portfolioAgg]);

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
      new PublicKey(portfolio.accountKey),
      true
    );
    try {
      const balance =
        await provider!.provider.connection.getTokenAccountBalance(account);
      return balance.value.uiAmount;
    } catch (error) {
      console.error('Error fetching token balance', error);
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">Loading portfolio data...</div>
    );
  }

  if (!portfolioAgg) {
    return <div className="container mx-auto p-4">Portfolio not found.</div>;
  }

  const { portfolio, allocations, deposits, withdraws, rebalances } =
    portfolioAgg;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Wallet className="mr-2 h-8 w-8" />
        {portfolio.name}
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <PieChartIcon className="mr-2 h-6 w-6" />
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-64 h-64 mb-6 md:mb-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocations.map((a) => ({
                    percentage: parseFloat(
                      (
                        ((tokenBalances || {})[a.tokenMint]?.usdc /
                          Object.values(tokenBalances || {}).reduce(
                            (sum, curr) => sum + curr.usdc,
                            0
                          )) *
                        100
                      ).toFixed(2)
                    ),
                    tokenMint: a.tokenMint,
                    name: supportTokens.find(
                      (t) => t.devnetAddress === a.tokenMint
                    )?.symbol,
                    usdcValue: tokenBalances[a.tokenMint]?.usdc.toFixed(2),
                  }))}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {allocations.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value}% ($${props.payload.usdcValue})`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="md:ml-8 space-y-4">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Allocations
            </h3>
            {allocations.map((allocation, index) => (
              <div
                key={allocation.tokenMint}
                className="flex items-center justify-between gap-4"
              >
                <span className="font-medium flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  {
                    supportTokens.find(
                      (t) => t.devnetAddress === allocation.tokenMint
                    )?.symbol
                  }{' '}
                  <img
                    src={`/${
                      supportTokens.find(
                        (t) => t.devnetAddress === allocation.tokenMint
                      )?.icon
                    }`}
                    className="w-4 h-4 ml-2"
                  />
                </span>
                <span>
                  {tokenBalances[allocation.tokenMint]?.amount.toFixed(
                    getToken(allocation.tokenMint).symbol === 'USDC' ? 2 : 5
                  )}
                  <span className="text-muted-foreground ml-2">
                    (${tokenBalances[allocation.tokenMint]?.usdc.toFixed(2)})
                  </span>
                </span>
              </div>
            ))}
            <div className="pt-4 mt-4 border-t text-xl font-bold flex items-center justify-between">
              <span className="flex items-center">
                <DollarSign className="mr-2 h-6 w-6" />
                Total Value:
              </span>
              <span>
                $
                {Object.values(tokenBalances)
                  .reduce((sum, curr) => sum + curr.usdc, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="flex items-center">
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Withdrawals
              </span>
              <WithdrawModal
                availableTokens={allocations.map((a) => a.tokenMint)}
                tokenAmounts={tokenBalances}
                portfolioAccount={portfolio.accountKey}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Token</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdraws.map((tx) => (
                  <TableRow key={tx.txSignature}>
                    <TableCell>{format(tx.createdAt, 'yyyy-MM-dd')}</TableCell>
                    <TableCell>
                      $
                      {(tx.amount / 10 ** 9).toFixed(
                        getToken(tx.mintToken).symbol === 'USDC' ? 2 : 5
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row gap-2 items-center">
                        <span> {getToken(tx.mintToken).symbol} </span>
                        <img
                          src={`/${getToken(tx.mintToken).icon}`}
                          className="w-4 h-4 ml-2"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="flex items-center">
                <ArrowDownRight className="mr-2 h-5 w-5" />
                Deposits
              </span>
              {/* <DepositModal
                availableTokens={allocations.map((a) => a.tokenMint)}
                onDeposit={() => console.log('do something')}
              /> */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Token</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deposits.map((tx) => (
                  <TableRow key={tx.txSignature}>
                    <TableCell>{format(tx.createdAt, 'yyyy-MM-dd')}</TableCell>
                    <TableCell>
                      $
                      {(tx.amount / 10 ** 9).toFixed(
                        getToken(tx.mintToken).symbol === 'USDC' ? 2 : 5
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row gap-2 items-center">
                        <span> {getToken(tx.mintToken).symbol} </span>
                        <img
                          src={`/${getToken(tx.mintToken).icon}`}
                          className="w-4 h-4 ml-2"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="w-full mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="flex items-center">
                <ArrowUpDown className="mr-2 h-5 w-5" />
                Recent Rebalance
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>From Token</TableHead>
                  <TableHead>To Token</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>USDC Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rebalances.map((tx) => (
                  <TableRow key={tx.txSignature}>
                    <TableCell>{format(tx.createdAt, 'yyyy-MM-dd')}</TableCell>
                    <TableCell>
                      <div className="flex flex-row gap-2 items-center">
                        <span> {getToken(tx.fromMint).symbol} </span>
                        <img
                          src={`/${getToken(tx.fromMint).icon}`}
                          className="w-4 h-4 ml-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row gap-2 items-center">
                        <span>{getToken(tx.toMint).symbol} </span>
                        <img
                          src={`/${getToken(tx.toMint).icon}`}
                          className="w-4 h-4 ml-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row gap-2">
                        <span>
                          $
                          {tx.fromAmount.toFixed(
                            getToken(tx.fromMint).symbol === 'USDC' ? 2 : 5
                          )}
                        </span>{' '}
                        <ArrowRight />{' '}
                        <span>
                          $
                          {tx.toAmount.toFixed(
                            getToken(tx.toMint).symbol === 'USDC' ? 2 : 5
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      ${getUSDCValue(tx.toMint, tx.toAmount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
