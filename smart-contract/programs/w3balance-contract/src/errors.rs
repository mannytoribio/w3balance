use anchor_lang::prelude::*;

#[error_code]
pub enum W3BalanceError {
    #[msg("Portfolio token allocation exceeds 100 percent")]
    PercentageMoreThan100,
}
