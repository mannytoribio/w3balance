// This only exists because getting raydium to work on devnet is hard
// this will be removed when we go to mainnet
use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{transfer, Token, TokenAccount, Transfer}};

use crate::{Portfolio, PortfolioTokenAllocation};

#[derive(Accounts)]
#[instruction()]
pub struct DemoRebalancePortfolioAccounts<'info> {
    #[account(
        mut,
        seeds = [
            b"portfolio".as_ref(), 
            portfolio_account.owner.key().as_ref(), 
            portfolio_account.unique_name.as_ref()
        ],
        // Ensure the person calling this instruction is the owner of the portfolio.
        constraint = portfolio_account.delegated_rebalance_address == payer.key(),
        bump,
    )]
    pub portfolio_account: Account<'info, Portfolio>,
    #[account(mut)]
    pub portfolio_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub delegated_token_account: Account<'info, TokenAccount>,
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
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    #[account(
        mut,
        constraint = payer.key() == portfolio_account.owner || payer.key() == portfolio_account.delegated_rebalance_address
    )]
    pub payer: Signer<'info>,
}


pub fn demo_handle_rebalance_portfolio(
    ctx: Context<DemoRebalancePortfolioAccounts>,
    amount_in: u64,
) -> Result<()> {
    let portfolio = &mut ctx.accounts.portfolio_account;
    let seeds = &[
        b"portfolio".as_ref(),
        portfolio.owner.as_ref(),
        portfolio.unique_name.as_ref(),
    ];

    let (_pda, bump) = Pubkey::find_program_address(seeds, ctx.program_id);
    let transfer_accounts = Transfer {
        from: ctx.accounts.portfolio_token_account.to_account_info().clone(),
        to: ctx.accounts.delegated_token_account.to_account_info().clone(),
        authority: portfolio.to_account_info().clone(),
    };
    let cpi_program: AccountInfo<'_> = ctx.accounts.token_program.to_account_info();
    transfer(
        CpiContext::new_with_signer(
            cpi_program.clone(),
            transfer_accounts,
            &[&[
                b"portfolio".as_ref(),
                portfolio.owner.as_ref(),
                portfolio.unique_name.as_ref(),
                &[bump],
            ]],
        ),
        amount_in,
    )?;

    Ok(())
}
