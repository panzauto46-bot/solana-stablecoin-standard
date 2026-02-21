use anchor_lang::prelude::*;
use crate::state::{Config, BlacklistEntry};
use crate::errors::ProgramError;

#[derive(Accounts)]
#[instruction(account_to_blacklist: Pubkey)]
pub struct ManageBlacklist<'info> {
    #[account(mut, has_one = blacklister @ ProgramError::UnauthorizedBlacklister)]
    pub config: Account<'info, Config>,

    #[account(mut)]
    pub blacklister: Signer<'info>,

    #[account(
        init_if_needed,
        payer = blacklister,
        space = BlacklistEntry::LEN,
        seeds = [b"blacklist", account_to_blacklist.as_ref()],
        bump
    )]
    pub blacklist_entry: Account<'info, BlacklistEntry>,

    pub system_program: Program<'info, System>,
}

pub fn add_to_blacklist(ctx: Context<ManageBlacklist>, _account_to_blacklist: Pubkey) -> Result<()> {
    let entry = &mut ctx.accounts.blacklist_entry;
    entry.is_blacklisted = true;
    entry.bump = ctx.bumps.blacklist_entry;
    Ok(())
}

pub fn remove_from_blacklist(ctx: Context<ManageBlacklist>, _account_to_remove: Pubkey) -> Result<()> {
    let entry = &mut ctx.accounts.blacklist_entry;
    entry.is_blacklisted = false;
    Ok(())
}
