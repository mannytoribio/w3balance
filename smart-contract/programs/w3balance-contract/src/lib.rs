use anchor_lang::prelude::*;
pub mod errors;
pub mod instructions;
use instructions::{
    add_portfolio_token_allocation::*, create_portfolio::*, deposit_portfolio::*, proxy_init::*,
    rebalance_portfolio::*, withdrawal_portfolio::*,
};

declare_id!("46gecgivx6mbKb7gfZFVjBGbBgR1n91NEj3naj2LrF8u");

#[program]
pub mod w3balance_contract {
    use super::*;

    pub fn create_portfolio(
        ctx: Context<CreatePortfolioAccounts>,
        data: CreatePortfolioData,
    ) -> Result<()> {
        handle_create_portfolio(ctx, data)
    }

    pub fn add_portfolio_token_allocation(
        ctx: Context<AddPortfolioTokenAllocationAccounts>,
        data: AddPortfolioTokenAllocationData,
    ) -> Result<()> {
        handle_add_portfolio_token_allocation(ctx, data)
    }

    pub fn deposit_portfolio(
        ctx: Context<DepositPortfolioAccounts>,
        data: DepositPortfolioData,
    ) -> Result<()> {
        handle_deposit_portfolio(ctx, data)
    }

    pub fn withdrawal_portfolio(
        ctx: Context<WithdrawalPortfolioAccounts>,
        data: WithdrawalPortfolioData,
    ) -> Result<()> {
        handle_withdrawal_portfolio(ctx, data)
    }

    pub fn rebalance_portfolio(
        ctx: Context<RebalancePortfolioAccounts>,
        amount_in: u64,
        minimum_amount_out: u64,
    ) -> Result<()> {
        handle_rebalance_portfolio(ctx, amount_in, minimum_amount_out)
    }

    pub fn proxy_initialize(
        ctx: Context<ProxyInitialize>,
        init_amount_0: u64,
        init_amount_1: u64,
        open_time: u64,
    ) -> Result<()> {
        print!("proxy_initialize");
        handle_proxy_initialize(ctx, init_amount_0, init_amount_1, open_time)
    }
}
