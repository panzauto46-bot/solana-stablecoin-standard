use anchor_lang::prelude::*;

#[account]
pub struct Config {
    pub bump: u8,
    pub master: Pubkey,
    pub minter: Pubkey,
    pub burner: Pubkey,
    pub pauser: Pubkey,
    pub blacklister: Pubkey,
    pub seizer: Pubkey,
}

impl Config {
    pub const LEN: usize = 8 + 1 + 32 * 6;
}

#[account]
pub struct BlacklistEntry {
    pub is_blacklisted: bool,
    pub bump: u8,
}

impl BlacklistEntry {
    pub const LEN: usize = 8 + 1 + 1;
}
