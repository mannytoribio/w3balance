use anchor_lang::prelude::*;
pub mod errors;
pub mod instructions;
use instructions::{add_fund_token_allocation::*, create_fund::*};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod w3balance_contract {
    use super::*;

    pub fn create_fund(ctx: Context<CreateFundAccounts>, data: CreateFundData) -> Result<()> {
        handle_create_fund(ctx, data)
    }

    pub fn add_fund_token_allocation(
        ctx: Context<AddFundTokenAllocationAccounts>,
        data: AddFundTokenAllocationData,
    ) -> Result<()> {
        handle_add_fund_token_allocation(ctx, data)
    }
}
