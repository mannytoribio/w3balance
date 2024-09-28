use crate::{Portfolio, PortfolioTokenAllocation};
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{transfer, Token, TokenAccount, Transfer};

#[derive(Accounts)]
#[instruction()]
pub struct DepositPortfolioAccounts<'info> {
    #[account(
        mut,
        seeds = [
            b"portfolio_token_allocation".as_ref(), 
            portfolio_account.key().as_ref(),
            portfolio_account.owner.key().as_ref(), 
            portfolio_token_allocation_account.token_mint.key().as_ref()
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
        mut,
        associated_token::mint = portfolio_token_allocation_account.token_mint,
        associated_token::authority = portfolio_account,
    )]
    pub portfolio_token_allocation_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = payer_token_account.mint == portfolio_token_allocation_account.token_mint,
        constraint = payer_token_account.owner == payer.key(),
    )]
    pub payer_token_account: Account<'info, TokenAccount>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct DepositPortfolioData {
    pub amount: u64,
}

pub fn handle_deposit_portfolio(
    ctx: Context<DepositPortfolioAccounts>,
    data: DepositPortfolioData,
) -> Result<()> {
    let portfolio_token_allocation_token_account =
        &mut ctx.accounts.portfolio_token_allocation_token_account;
    let payer_token_account = &mut ctx.accounts.payer_token_account;
    let payer = &mut ctx.accounts.payer;
    let token_program = &ctx.accounts.token_program;

    // Transfer the tokens from the payer to the portfolio's token account.
    let cpi_accounts = Transfer {
        from: payer_token_account.to_account_info().clone(),
        to: portfolio_token_allocation_token_account
            .to_account_info()
            .clone(),
        authority: payer.to_account_info().clone(),
    };
    let cpi_ctx = CpiContext::new(token_program.to_account_info().clone(), cpi_accounts);
    transfer(cpi_ctx, data.amount)?;
    Ok(())
}
