// Assume you have a proper setup with Vitest
import { describe, test, expect } from 'vitest';
import { getSwaps } from '../src/service';

describe('getSwaps function', () => {
  test('Single swap required', () => {
    const allocations = [
      {
        tokenMint: 'A',
        percentage: 70,
        quantity: 100,
        usdcPrice: 1,
      },
      {
        tokenMint: 'B',
        percentage: 30,
        quantity: 100,
        usdcPrice: 1,
      },
    ];
    // 70% of 200 is 140, 30% of 200 is 60
    const swaps = getSwaps(allocations);
    expect(allocations[0].quantity).toBe(140);
    expect(allocations[1].quantity).toBe(60);
    expect(swaps).toEqual([
      {
        from: 'B',
        to: 'A',
        amount: 40,
      },
    ]);
  });

  test('Multiple swaps from one token', () => {
    const allocations = [
      {
        tokenMint: 'A',
        percentage: 50,
        quantity: 100,
        usdcPrice: 1,
        // so at 1 with 100 quantity, its 100$ usdc;
      },
      {
        tokenMint: 'B',
        percentage: 20,
        quantity: 50,
        usdcPrice: 2,
        // so at 2 with 50 quantity, its 100$ usdc;
      },
      {
        tokenMint: 'C',
        percentage: 30,
        quantity: 10,
        usdcPrice: 3,
        // so at 3 with 10 quantity, its 30$ usdc, which;
      },
    ];

    // we have 100, 50, and 10
    // 50% of 230 is 115 which is 115, 20% of 230 is 46 which is 23, 30% of 230 is 69 which is 23
    const swaps = getSwaps(allocations);
    // Allocations is modified in place in the getSwaps function;
    expect(allocations[0].quantity).toBe(115);
    expect(allocations[1].quantity).toBe(46 / 2);
    expect(allocations[2].quantity).toBe(69 / 3);
    expect(swaps).toEqual([
      {
        from: 'B',
        to: 'A',
        amount: 7.5,
      },
      {
        from: 'B',
        to: 'C',
        amount: 19.5,
      },
    ]);
  });

  test('Multiple swaps to one token', () => {
    const allocations = [
      {
        tokenMint: 'A',
        percentage: 20,
        usdcPrice: 1,
        quantity: 100,
      },
      {
        tokenMint: 'B',
        percentage: 70,
        usdcPrice: 2,
        quantity: 200,
      },
      { tokenMint: 'C', percentage: 10, usdcPrice: 3, quantity: 300 },
    ];

    const swaps = getSwaps(allocations);
    // total is (100 + 400  + 900) = 1400, 20% is 280, 70% is 980, 10% is 140
    expect(allocations[0].quantity * allocations[0].usdcPrice).toBeCloseTo(280);
    expect(allocations[1].quantity * allocations[1].usdcPrice).toBeCloseTo(980);
    expect(allocations[2].quantity * allocations[2].usdcPrice).toBeCloseTo(140);
    expect(swaps).toEqual([
      {
        from: 'C',
        to: 'A',
        amount: 60,
      },
      {
        from: 'C',
        to: 'B',
        amount: expect.closeTo(193.33),
      },
    ]);
  });

  test.only('Multiple swaps between multiples of tokens', () => {
    const allocations = [
      {
        tokenMint: 'A',
        percentage: 16,
        usdcPrice: 4,
        quantity: 125,
      },
      {
        tokenMint: 'B',
        percentage: 42,
        usdcPrice: 62_021,
        quantity: 0.2,
      },
      {
        tokenMint: 'C',
        percentage: 20,
        usdcPrice: 2_502,
        quantity: 3.8,
      },
      {
        tokenMint: 'D',
        percentage: 22,
        usdcPrice: 150,
        quantity: 40,
      },
    ];

    const swaps = getSwaps(allocations);
    const totalUSDC = allocations.reduce(
      (sum, alloc) => sum + alloc.quantity * alloc.usdcPrice,
      0
    );
    console.log(totalUSDC);
    for (const alloc of allocations) {
      expect((alloc.percentage / 100) * totalUSDC).toBeCloseTo(
        alloc.quantity * alloc.usdcPrice
      );
    }
  });

  test('No swap needed', () => {
    const allocations = [
      {
        tokenMint: 'A',
        percentage: 10,
        usdcPrice: 1,
        quantity: 10,
      },
      {
        tokenMint: 'B',
        percentage: 90,
        usdcPrice: 1,
        quantity: 90,
      },
    ];

    const swaps = getSwaps(allocations);
    expect(swaps).toEqual([]);
  });
});
