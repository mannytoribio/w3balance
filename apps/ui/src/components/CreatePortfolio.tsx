import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  AlertCircle,
  Briefcase,
  Coins,
  Clock,
  PlusCircle,
  Trash2,
  DollarSign,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { supportTokens } from '@libs/program';
import { createPortfolio, getTokenBalance, useProvider } from '@/contract';
import { trpc } from '@/trpc';

const rebalanceFrequencies = ['Every 5 Minutes', 'Daily', 'Monthly', 'Yearly'];

type FormData = {
  name: string;
  tokens: { token: string; allocation: number }[];
  rebalanceFrequency: string;
  depositAmount: number;
};

export const CreatePortfolioPage = () => {
  const wallet = useWallet();
  const { provider } = useProvider()!;
  const navigate = useNavigate();
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutate: airdropToken, isLoading: isAirdropping } =
    trpc.airdropToken.useMutation({
      onSuccess: async () => {
        await updateUSDCBalance();
      },
    });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      name: 'First Portfolio',
      tokens: [{ token: 'USDC', allocation: 100 }],
      rebalanceFrequency: rebalanceFrequencies[0],
      depositAmount: 50,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tokens',
  });

  const watchFieldArray = watch('tokens');
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }));

  const onSubmit = async (data: FormData) => {
    setError(null);
    const totalAllocation = data.tokens.reduce(
      (sum, token) => sum + token.allocation,
      0
    );
    if (!wallet.connected) {
      setError('Please connect your wallet');
      return;
    }
    if (totalAllocation !== 100) {
      setError('Total allocation must equal 100%');
      return;
    }
    // Here you would typically send this data to your Solana program
    // For demo purposes, we'll just redirect to the portfolio listing page
    try {
      await createPortfolio(
        data.name,
        data.tokens.map((t) => ({
          percentage: t.allocation,
          tokenAddress: supportTokens.find((token) => token.name === t.token)!
            .devnetAddress,
        })),
        rebalanceFrequencies.indexOf(data.rebalanceFrequency),
        data.depositAmount,
        wallet,
        provider
      );
    } catch {
      setError(
        'Error processing your tx on chain.  Make sure your wallet is connected to Devnet and try again'
      );
    }
  };

  const updateUSDCBalance = async () => {
    if (provider.wallet.publicKey) {
      try {
        const balance = await getTokenBalance(
          supportTokens.find((token) => token.name === 'USDC')!,
          provider
        );
        setUsdcBalance(balance.value.uiAmount);
      } catch {
        setUsdcBalance(0);
      }
    }
  };

  useEffect(() => {
    updateUSDCBalance().then();
  }, [provider]);

  return (
    <div className="container mx-auto p-2 sm:p-4 max-w-3xl mt-4 sm:mt-12">
      <Card className="border-2 border-primary shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-primary">
            <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
            Create Your First Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-base sm:text-lg font-semibold flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Portfolio Name
              </Label>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Portfolio name is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="border-2 focus:ring-2 focus:ring-primary"
                  />
                )}
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Tokens
              </Label>
              {controlledFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-secondary/20 p-3 rounded-md"
                >
                  <Controller
                    name={`tokens.${index}.token`}
                    control={control}
                    rules={{ required: 'Token is required' }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full sm:w-[180px] border-2 focus:ring-2 focus:ring-primary">
                          <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportTokens.map((token) => (
                            <SelectItem
                              key={token.name}
                              value={token.name}
                              disabled={
                                !!getValues('tokens').find(
                                  (t) => t.token === token.name
                                )
                              }
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={token.icon}
                                  alt={token.name}
                                  className="w-4 h-4"
                                />{' '}
                                {token.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Controller
                      name={`tokens.${index}.allocation`}
                      control={control}
                      rules={{
                        required: 'Allocation is required',
                        min: {
                          value: 0,
                          message: 'Allocation must be positive',
                        },
                        max: {
                          value: 100,
                          message: 'Allocation must be 100 or less',
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="Allocation %"
                          className="w-full sm:w-24 border-2 focus:ring-2 focus:ring-primary"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {errors.tokens && (
                <p className="text-destructive text-sm mt-1">
                  {errors.tokens.message}
                </p>
              )}
              <Button
                type="button"
                disabled={getValues('tokens').length === supportTokens.length}
                onClick={() =>
                  append({
                    token:
                      supportTokens.find(
                        (s) => !controlledFields.find((c) => c.token === s.name)
                      )?.name || '',
                    allocation: 0,
                  })
                }
                className="mt-2 w-full"
                variant="outline"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Token
              </Button>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="rebalanceFrequency"
                className="text-base sm:text-lg font-semibold flex items-center gap-2"
              >
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Rebalance Frequency
              </Label>
              <Controller
                name="rebalanceFrequency"
                control={control}
                rules={{ required: 'Rebalance frequency is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full border-2 focus:ring-2 focus:ring-primary">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {rebalanceFrequencies.map((frequency) => (
                        <SelectItem key={frequency} value={frequency}>
                          {frequency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.rebalanceFrequency && (
                <p className="text-destructive text-sm mt-1">
                  {errors.rebalanceFrequency.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="depositAmount"
                className="text-base sm:text-lg font-semibold flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                USDC Deposit Amount
              </Label>
              <Controller
                name="depositAmount"
                control={control}
                rules={{
                  required: 'Deposit amount is required',
                  min: {
                    value: 0.01,
                    message: 'Deposit must be at least 0.01 USDC',
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    className="border-2 focus:ring-2 focus:ring-primary"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                )}
              />
              {errors.depositAmount && (
                <p className="text-destructive text-sm mt-1">
                  {errors.depositAmount.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Your USDC balance:{' '}
                {usdcBalance !== null
                  ? usdcBalance.toLocaleString('en', {
                      currency: 'USD',
                      style: 'currency',
                      minimumFractionDigits: 2,
                    })
                  : 'Loading (connect your wallet)...'}
              </p>
              {usdcBalance !== null && usdcBalance < 0.01 && (
                <Button
                  type="button"
                  disabled={isAirdropping}
                  onClick={async () =>
                    airdropToken({
                      tokenAddress: supportTokens.find(
                        (t) => t.name === 'USDC'
                      )!.devnetAddress,
                      walletAddress: provider.wallet.publicKey!.toString(),
                    })
                  }
                  className="mt-2 w-full sm:w-auto"
                >
                  {isAirdropping ? 'Airdropping...' : 'Airdrop USDC on Devnet'}
                </Button>
              )}
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full text-base sm:text-lg font-semibold"
            >
              Create Portfolio
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
