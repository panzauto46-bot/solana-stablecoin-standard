use anchor_lang::prelude::*;

#[error_code]
pub enum ProgramError {
    #[msg("Unauthorized access. Master role required.")]
    UnauthorizedMaster,
    #[msg("Unauthorized access. Minter role required.")]
    UnauthorizedMinter,
    #[msg("Unauthorized access. Burner role required.")]
    UnauthorizedBurner,
    #[msg("Unauthorized access. Pauser role required.")]
    UnauthorizedPauser,
    #[msg("Unauthorized access. Blacklister role required.")]
    UnauthorizedBlacklister,
    #[msg("Unauthorized access. Seizer role required.")]
    UnauthorizedSeizer,
    #[msg("The account is blacklisted.")]
    AccountBlacklisted,
    #[msg("The mint is not an SSS-2 Token. Operation failed gracefully.")]
    NotSSS2Compliant,
    #[msg("Permanent delegate is missing on this Token-2022 mint.")]
    MissingPermanentDelegate,
}
