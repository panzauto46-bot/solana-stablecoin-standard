use anchor_lang::prelude::*;
use anchor_spl::token_2022::{self, InitializeMint2, spl_token_2022};
use anchor_spl::token_interface::{Mint, Token2022};

#[derive(Accounts)]
pub struct InitializeSSS1<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 9,
        mint::authority = mint_authority,
        mint::freeze_authority = freeze_authority,
        extensions::metadata_pointer::authority = mint_authority,
        extensions::metadata_pointer::metadata_address = mint,
    )]
    pub mint: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: We are passing this statically
    #[account(mut)]
    pub mint_authority: UncheckedAccount<'info>,
    
    /// CHECK: We are passing this statically
    pub freeze_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    _ctx: Context<InitializeSSS1>,
    _name: String,
    _symbol: String,
    _uri: String,
    _decimals: u8,
) -> Result<()> {
    // SSS1 is the simpler standard. Anchor 0.30 takes care of initialization through the `init` macro constraint.
    // However, if we need to initialize metadata as an extension, we use the spl_token_metadata_interface directly.
    // For SSS-1, we assume the initial instructions include Mint Auth and Freeze Auth.
    // To configure it further, one could CPI to TokenMetadata initialize.
    Ok(())
}
