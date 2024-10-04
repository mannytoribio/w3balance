export interface Token {
  name: string;
  symbol: string;
  devnetAddress: string;
  mainnetAddress: string;
  icon: string;
  decimals: number;
}

export const supportTokens = [
  {
    name: 'USDC',
    symbol: 'USDC',
    devnetAddress: '6EQssH3g3sjxredCgJoumxB8duVsxJ2u8JHB3zwF1n11',
    mainnetAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    icon: 'usdc.png',
    decimals: 9,
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    devnetAddress: '6Qb1Wzq7u1mZKkjn2fq7sK9Q6f1Lx3bwQ5xRMsQmBrJ3',
    icon: 'solana.png',
    mainnetAddress: 'So11111111111111111111111111111111111111112',
    decimals: 9,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    devnetAddress: '6T9Gx3ewdhMGPp7WH5oFRpT4UnhBa17M7Rf5RAkm6j5a',
    icon: 'eth.png',
    mainnetAddress: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
    decimals: 9,
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    devnetAddress: 'BNf9LShPbTp1e9xLg1us1Vi45pejqCj8TgRRkbcqcR5w',
    icon: 'btc.png',
    mainnetAddress: '3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh',
    decimals: 9,
  },
];
