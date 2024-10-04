use anchor_lang::prelude::*;
use anchor_spl::token::Token;

#[derive(Accounts)]
#[instruction(unique_name: String)]
pub struct CreatePortfolioAccounts<'info> {
    #[account(
        init,
        payer = payer,
        space = 36 + 32 + 32 + 1,
        seeds = [b"portfolio".as_ref(), payer.key().as_ref(), unique_name.as_ref()],
        bump
    )]
    pub portfolio_account: Account<'info, Portfolio>,
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: The account that will crank and rebalance;
    pub delegated_rebalance_address: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Portfolio {
    pub owner: Pubkey,       // 32
    pub unique_name: String, // 4 + 32 = 36
    pub total_percentage: u8,
    pub delegated_rebalance_address: Pubkey, // 32
    // 0: 'Every 5 Minutes', 1: 'Daily', 2: 'Monthly', 3: 'Yearly'
    pub update_frequency: u8, // 1
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct CreatePortfolioData {
    pub unique_name: String,
    pub delegated_rebalance_address: Pubkey,
    pub update_frequency: u8,
}

pub fn handle_create_portfolio(
    ctx: Context<CreatePortfolioAccounts>,
    data: CreatePortfolioData,
) -> Result<()> {
    let portfolio = &mut ctx.accounts.portfolio_account;
    portfolio.owner = *ctx.accounts.payer.key;
    portfolio.unique_name = data.unique_name;
    portfolio.delegated_rebalance_address = data.delegated_rebalance_address;
    portfolio.total_percentage = 0;
    portfolio.update_frequency = data.update_frequency;
    Ok(())
}
