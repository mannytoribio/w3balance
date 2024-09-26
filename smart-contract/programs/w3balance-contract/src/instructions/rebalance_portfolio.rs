use crate::Portfolio;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::Token,
    token_interface::{Mint, TokenAccount, TokenInterface},
};
use raydium_cp_swap::{
    cpi,
    program::RaydiumCpSwap,
    states::{AmmConfig, ObservationState, PoolState},
};

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
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub cp_swap_program: Program<'info, RaydiumCpSwap>,
    #[account(
        mut,
        constraint = payer.key() == portfolio_account.owner || payer.key() == portfolio_account.delegated_rebalance_address
    )]
    pub payer: Signer<'info>,

    /// CHECK: pool vault and lp mint authority
    #[account(
      seeds = [
        raydium_cp_swap::AUTH_SEED.as_bytes(),
      ],
      seeds::program = cp_swap_program,
      bump,
  )]
    pub authority: UncheckedAccount<'info>,

    /// The factory state to read protocol fees
    #[account(address = pool_state.load()?.amm_config)]
    pub amm_config: Box<Account<'info, AmmConfig>>,

    /// The program account of the pool in which the swap will be performed
    #[account(mut)]
    pub pool_state: AccountLoader<'info, PoolState>,

    /// The user token account for input token
    #[account(mut)]
    pub input_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The user token account for output token
    #[account(mut)]
    pub output_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The vault token account for input token
    #[account(
      mut,
      constraint = input_vault.key() == pool_state.load()?.token_0_vault || input_vault.key() == pool_state.load()?.token_1_vault
  )]
    pub input_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The vault token account for output token
    #[account(
      mut,
      constraint = output_vault.key() == pool_state.load()?.token_0_vault || output_vault.key() == pool_state.load()?.token_1_vault
  )]
    pub output_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    /// SPL program for input token transfers
    pub input_token_program: Interface<'info, TokenInterface>,

    /// SPL program for output token transfers
    pub output_token_program: Interface<'info, TokenInterface>,

    /// The mint of input token
    #[account(
      address = input_vault.mint
  )]
    pub input_token_mint: Box<InterfaceAccount<'info, Mint>>,

    /// The mint of output token
    #[account(
      address = output_vault.mint
  )]
    pub output_token_mint: Box<InterfaceAccount<'info, Mint>>,
    /// The program account for the most recent oracle observation
    #[account(mut, address = pool_state.load()?.observation_key)]
    pub observation_state: AccountLoader<'info, ObservationState>,
}

pub fn handle_rebalance_portfolio(
    ctx: Context<RebalancePortfolioAccounts>,
    amount_in: u64,
    minimum_amount_out: u64,
) -> Result<()> {
    let portfolio = &mut ctx.accounts.portfolio_account;
    let payer = &ctx.accounts.payer;
    let payer_key = payer.key();
    let seeds = &[
        b"portfolio".as_ref(),
        payer_key.as_ref(),
        portfolio.unique_name.as_ref(),
    ];

    let (_pda, bump) = Pubkey::find_program_address(seeds, ctx.program_id);

    let cpi_accounts = cpi::accounts::Swap {
        payer: ctx.accounts.payer.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
        amm_config: ctx.accounts.amm_config.to_account_info(),
        pool_state: ctx.accounts.pool_state.to_account_info(),
        input_token_account: ctx.accounts.input_token_account.to_account_info(),
        output_token_account: ctx.accounts.output_token_account.to_account_info(),
        input_vault: ctx.accounts.input_vault.to_account_info(),
        output_vault: ctx.accounts.output_vault.to_account_info(),
        input_token_program: ctx.accounts.input_token_program.to_account_info(),
        output_token_program: ctx.accounts.output_token_program.to_account_info(),
        input_token_mint: ctx.accounts.input_token_mint.to_account_info(),
        output_token_mint: ctx.accounts.output_token_mint.to_account_info(),
        observation_state: ctx.accounts.observation_state.to_account_info(),
    };

    cpi::swap_base_input(
        CpiContext::new_with_signer(
            ctx.accounts.cp_swap_program.to_account_info(),
            cpi_accounts,
            &[&[
                b"portfolio".as_ref(),
                ctx.accounts.payer.key().as_ref(),
                portfolio.unique_name.as_ref(),
                &[bump],
            ]],
        ),
        amount_in,
        minimum_amount_out,
    )?;
    Ok(())
}
