use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, Token2022};
use crate::state::Config;

#[derive(Accounts)]
pub struct InitializeSSS2<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 9,
        mint::authority = config,
        mint::freeze_authority = config
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut, seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    _ctx: Context<InitializeSSS2>,
    _name: String,
    _symbol: String,
    _uri: String,
    _decimals: u8,
) -> Result<()> {
    // Keep this initializer minimal to keep macro derivation stable across CLI/toolchain setups.
    // SSS-2 compliance behavior can be configured via follow-up instructions/modules.
    Ok(())
}
