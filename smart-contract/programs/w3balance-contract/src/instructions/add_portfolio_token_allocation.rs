use crate::{errors::W3BalanceError, Portfolio};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};
use W3BalanceError::*;

#[derive(Accounts)]
#[instruction()]
pub struct AddPortfolioTokenAllocationAccounts<'info> {
    #[account(
        init,
        payer = payer,
        space = 32 + 1 + 8 + 10,
        seeds = [
        b"portfolio_token_allocation".as_ref(),
        portfolio_account.key().as_ref(),
        portfolio_account.owner.key().as_ref(), 
        mint_account.key().as_ref()
        ],
        bump
    )]
    pub portfolio_token_allocation_account: Account<'info, PortfolioTokenAllocation>,
    #[account(
        mut,
        seeds = [b"portfolio".as_ref(), payer.key().as_ref(), portfolio_account.unique_name.as_ref()],
        // Ensure the person calling this instruction is the owner of the portfolio.
        constraint = portfolio_account.owner == payer.key(),
        bump,
    )]
    pub portfolio_account: Account<'info, Portfolio>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint_account,
        associated_token::authority = portfolio_account,
    )]
    pub portfolio_token_allocation_token_account: Account<'info, TokenAccount>,
    #[account()]
    pub mint_account: Account<'info, Mint>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct AddPortfolioTokenAllocationData {
    pub token_mint: Pubkey,
    pub percentage: u8,
}

#[account]
pub struct PortfolioTokenAllocation {
    pub token_mint: Pubkey, // 32
    pub percentage: u8,     // 1
}

pub fn handle_add_portfolio_token_allocation(
    ctx: Context<AddPortfolioTokenAllocationAccounts>,
    data: AddPortfolioTokenAllocationData,
) -> Result<()> {
    let portfolio = &mut ctx.accounts.portfolio_account;
    let portfolio_token_allocation = &mut ctx.accounts.portfolio_token_allocation_account;
    portfolio_token_allocation.token_mint = data.token_mint;
    portfolio_token_allocation.percentage = data.percentage;
    portfolio.total_percentage += data.percentage;
    if portfolio.total_percentage > 100 {
        return Err(PercentageMoreThan100.into());
    }
    Ok(())
}
