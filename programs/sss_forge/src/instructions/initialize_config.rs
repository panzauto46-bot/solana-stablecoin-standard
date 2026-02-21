use anchor_lang::prelude::*;
use crate::state::Config;

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(
        init,
        payer = master,
        space = Config::LEN,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,

    #[account(mut)]
    pub master: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializeConfig>,
    master: Pubkey,
    minter: Pubkey,
    burner: Pubkey,
    pauser: Pubkey,
    blacklister: Pubkey,
    seizer: Pubkey,
) -> Result<()> {
    let config = &mut ctx.accounts.config;
    config.bump = ctx.bumps.config;
    config.master = master;
    config.minter = minter;
    config.burner = burner;
    config.pauser = pauser;
    config.blacklister = blacklister;
    config.seizer = seizer;
    Ok(())
}
