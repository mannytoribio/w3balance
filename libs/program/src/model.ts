export interface PortfolioAccount {
  // public key
  owner: string;
  unique_name: string;
  total_percentage: number;
  // public key
  delegated_rebalance_address: string;
}

export interface PortfolioTokenAllocationAccount {
  // public key
  owner: string;
  // public key
  token_mint: string;
  percentage: number;
}
