import { TokenAllocation } from '@libs/data';

export const getSwaps = (
  allocations: (Pick<TokenAllocation, 'tokenMint' | 'percentage'> & {
    quantity: number;
    usdcPrice: number;
  })[]
) => {
  const totalUSDCValue = allocations.reduce(
    (sum, alloc) => sum + alloc.quantity * alloc.usdcPrice,
    0
  );
  const target: { [key: string]: { quantity: number; usdcTotal: number } } = {};
  for (const alloc of allocations) {
    const usdcTotal = (alloc.percentage / 100) * totalUSDCValue;
    target[alloc.tokenMint] = {
      usdcTotal,
      quantity: usdcTotal / alloc.usdcPrice,
    };
  }
  const isBalanced = () =>
    allocations.every(
      (alloc) =>
        alloc.quantity.toFixed(2) ===
        target[alloc.tokenMint].quantity.toFixed(2)
    );
  const swaps: { from: string; to: string; amount: number }[] = [];
  while (!isBalanced()) {
    const to = allocations.find(
      (a) => a.quantity < target[a.tokenMint].quantity
    );
    const from = allocations.find(
      (a) => a.quantity > target[a.tokenMint].quantity
    );

    if (!to || !from) break;
    const usdcValueToSwap = Math.min(
      target[to.tokenMint].usdcTotal - to.usdcPrice * to.quantity,
      // this is how much from how in total, it can't be more than this;
      from.usdcPrice * from.quantity
    );

    const amount = usdcValueToSwap / from.usdcPrice;
    swaps.push({ from: from.tokenMint, to: to.tokenMint, amount });
    from.quantity -= amount;
    to.quantity += usdcValueToSwap / to.usdcPrice;
  }
  return swaps;
};
