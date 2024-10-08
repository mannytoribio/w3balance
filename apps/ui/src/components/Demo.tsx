import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useWallet } from '@jup-ag/wallet-adapter';
import { trpc } from '@/trpc';
import { useNavigate } from 'react-router-dom';
import { PortfolioListItem } from './PortfolioListItem';

export const Demo = () => {
  const navigate = useNavigate();
  const wallet = useWallet();
  const { data: portfolios, isLoading: isLoadingPortfolios } =
    trpc.getPortfolios.useQuery(wallet.publicKey?.toString() || '', {
      enabled: !!wallet.publicKey,
    });
  const { data: tokenPrices, isLoading: isLoadingTokens } =
    trpc.getPrices.useQuery(undefined, {
      refetchInterval: 30 * 1000,
    });

  if (!!wallet.publicKey && (isLoadingPortfolios || isLoadingTokens)) {
    return (
      <div className="container mx-auto p-2 sm:p-4 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg">Loading portfolios...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 sm:p-4 mt-12">
      <div className="flex justify-end my-4">
        <Button onClick={() => navigate('/create-portfolio')}>
          Create Portfolio
        </Button>
      </div>
      {(portfolios?.length || 0) === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Portfolios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg">
              You have not created any portfolios yet.
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate('/create-portfolio')}>
                Create Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Rebalance Frequency</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Token Allocations</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolios?.map((portfolio) => (
                  <PortfolioListItem
                    portfolio={portfolio}
                    tokenPrices={tokenPrices!}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
