use anchor_lang::prelude::*;
use crate::state::Config;
use crate::errors::ProgramError;

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump,
        has_one = master @ ProgramError::UnauthorizedMaster
    )]
    pub config: Account<'info, Config>,

    pub master: Signer<'info>,
}

pub fn handler(
    ctx: Context<UpdateConfig>,
    minter: Pubkey,
    burner: Pubkey,
    pauser: Pubkey,
    blacklister: Pubkey,
    seizer: Pubkey,
) -> Result<()> {
    let config = &mut ctx.accounts.config;
    config.minter = minter;
    config.burner = burner;
    config.pauser = pauser;
    config.blacklister = blacklister;
    config.seizer = seizer;
    Ok(())
}
