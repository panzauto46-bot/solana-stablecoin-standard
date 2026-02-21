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
        mint::freeze_authority = config,
        extensions::permanent_delegate::delegate = config,
        extensions::default_account_state::state = spl_token_2022::state::AccountState::Initialized,
        extensions::transfer_hook::authority = config,
        extensions::transfer_hook::program_id = crate::ID,
        extensions::metadata_pointer::authority = config,
        extensions::metadata_pointer::metadata_address = mint,
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
    // This allows compliant mint initialization with all necessary extensions for SSS-2.
    // Permanent Delegate enables seizing funds.
    // Default Account State defines if fresh accounts are automatically frozen pending KYC (not here but supported).
    // Transfer Hook integrates with the `transfer_hook` module we expose in our program.
    Ok(())
}
