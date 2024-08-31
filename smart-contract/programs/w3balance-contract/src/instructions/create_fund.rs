use anchor_lang::prelude::*;
use anchor_spl::token::Token;

#[derive(Accounts)]
#[instruction(unique_name: String)]
pub struct CreateFundAccounts<'info> {
    #[account(
        init,
        payer = payer,
        space = 36 + 32,
        seeds = [b"fund".as_ref(), payer.key().as_ref(), unique_name.as_ref()],
        bump
    )]
    pub fund_account: Account<'info, Fund>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Fund {
    pub owner: Pubkey,       // 32
    pub unique_name: String, // 4 + 32 = 36
    pub total_percentage: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct CreateFundData {
    pub unique_name: String,
}

pub fn handle_create_fund(ctx: Context<CreateFundAccounts>, data: CreateFundData) -> Result<()> {
    let fund = &mut ctx.accounts.fund_account;
    fund.owner = *ctx.accounts.payer.key;
    fund.unique_name = data.unique_name;
    fund.total_percentage = 0;
    Ok(())
}
