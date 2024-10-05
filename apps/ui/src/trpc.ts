import { createTRPCReact } from '@trpc/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@apps/trpc';

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export const trpc = createTRPCReact<AppRouter>();

export type Portfolio = RouterOutput['getPortfolios'][0];
export type PortfolioTokenAllocation = Portfolio['allocations'][0];
export type TokenPrice = RouterOutput['getPrices'][0];
