use anchor_lang::prelude::*;

#[error_code]
pub enum W3BalanceError {
    #[msg("Fund token allocation exceeds 100 percent")]
    PercentageMoreThan100,
}
