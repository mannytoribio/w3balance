use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

use crate::{Portfolio, PortfolioTokenAllocation};

#[derive(Accounts)]
#[instruction()]
pub struct DepositPortfolioAccounts<'info> {
    #[account(
        mut,
        seeds = [b"portfolio_token_allocation".as_ref(), portfolio_account.owner.key().as_ref(), mint_account.key().as_ref()],
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
        mut,
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
