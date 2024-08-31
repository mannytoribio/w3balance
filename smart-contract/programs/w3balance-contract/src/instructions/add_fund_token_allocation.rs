use crate::{errors::W3BalanceError, Fund};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};
use W3BalanceError::*;

#[derive(Accounts)]
#[instruction()]
pub struct AddFundTokenAllocationAccounts<'info> {
    #[account(
        init,
        payer = payer,
        space = 32 + 1 + 8,
        seeds = [b"fund_token_allocation".as_ref(), fund_account.owner.key().as_ref(), mint_account.key().as_ref()],
        bump
    )]
    pub fund_token_allocation_account: Account<'info, FundTokenAllocation>,
    #[account(
        mut,
        seeds = [b"fund".as_ref(), payer.key().as_ref(), fund_account.unique_name.as_ref()],
        // Ensure the person calling this instruction is the owner of the fund.
        constraint = fund_account.owner == payer.key(),
        bump,
    )]
    pub fund_account: Account<'info, Fund>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint_account,
        associated_token::authority = fund_account,
    )]
    pub fund_token_allocation_token_account: Account<'info, TokenAccount>,
    #[account()]
    pub mint_account: Account<'info, Mint>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct AddFundTokenAllocationData {
    pub token_mint: Pubkey,
    pub percentage: u8,
}

#[account]
pub struct FundTokenAllocation {
    pub token_mint: Pubkey, // 32
    pub percentage: u8,     // 1
}

pub fn handle_add_fund_token_allocation(
    ctx: Context<AddFundTokenAllocationAccounts>,
    data: AddFundTokenAllocationData,
) -> Result<()> {
    let fund = &mut ctx.accounts.fund_account;
    let fund_token_allocation = &mut ctx.accounts.fund_token_allocation_account;
    fund_token_allocation.token_mint = data.token_mint;
    fund_token_allocation.percentage = data.percentage;
    fund.total_percentage += data.percentage;
    if fund.total_percentage > 100 {
        return Err(PercentageMoreThan100.into());
    }
    Ok(())
}
