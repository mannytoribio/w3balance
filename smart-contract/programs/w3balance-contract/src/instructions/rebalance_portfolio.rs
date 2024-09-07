use crate::{Portfolio, PortfolioTokenAllocation};
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{transfer, Token, TokenAccount, Transfer};
use pyth_solana_receiver_sdk::price_update::{get_feed_id_from_hex, PriceUpdateV2};

#[derive(Accounts)]
#[instruction()]
pub struct RebalancePortfolioAccounts<'info> {
    #[account(
        mut,
        seeds = [b"portfolio".as_ref(), payer.key().as_ref(), portfolio_account.unique_name.as_ref()],
        // Ensure the person calling this instruction is the owner of the portfolio.
        constraint = portfolio_account.owner == payer.key(),
        bump,
    )]
    pub portfolio_account: Account<'info, Portfolio>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub price_update: Account<'info, PriceUpdateV2>,
}

pub fn handle_rebalance_portfolio(ctx: Context<RebalancePortfolioAccounts>) -> Result<()> {
    let portfolio = &mut ctx.accounts.portfolio_account;
    let price_update = &ctx.accounts.price_update;
    let feed_id: [u8; 32] =
        get_feed_id_from_hex("0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d")?;
    let price = price_update.get_price_no_older_than(&Clock::get()?, 300, &feed_id)?;
    print!("Price Update received: {:?}", price.price);

    Ok(())
}
