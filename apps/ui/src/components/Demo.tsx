import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RouterOutput } from '@/trpc';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// In a real application, this would be fetched from your Solana program
const portfolios: RouterOutput['getPortfolios'] = [];

export const Demo = () => {
  return (
    <div className="container mx-auto p-2 sm:p-4 mt-12">
      {portfolios.length === 0 ? (
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Welcome to w3balance!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You haven't created any portfolios yet. Start by creating your
              first portfolio to begin tracking and rebalancing your assets on
              Solana.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/create-portfolio">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First
                Portfolio
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id}>
              <CardHeader>
                <CardTitle>{portfolio.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Tokens:{' '}
                  {portfolio.allocations.map((a) => a.token.symbol).join(', ')}
                </p>
                <p>Rebalance: {portfolio.rebalanceFrequency}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link to={`/portfolio/${portfolio.id}`}>
                  <Button variant="outline">View</Button>
                </Link>
                <Link to={`/portfolio/${portfolio.id}/edit`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <Button variant="destructive">Delete</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
