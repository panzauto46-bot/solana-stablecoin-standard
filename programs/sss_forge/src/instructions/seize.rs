use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};
use anchor_spl::token_2022::spl_token_2022::extension::{BaseStateWithExtensions, StateWithExtensions};
use anchor_spl::token_2022::spl_token_2022::extension::permanent_delegate::PermanentDelegate;
use crate::state::Config;
use crate::errors::ProgramError;

#[derive(Accounts)]
pub struct SeizeFunds<'info> {
    #[account(has_one = seizer @ ProgramError::UnauthorizedSeizer)]
    pub config: Account<'info, Config>,
    
    #[account(mut)]
    pub seizer: Signer<'info>,

    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(mut, token::mint = mint)]
    pub source_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account(mut, token::mint = mint)]
    pub destination_account: InterfaceAccount<'info, TokenAccount>,

    /// CHECK: The permanent delegate of the mint (which is `config` in our case, signed by seizer logic)
    pub delegate: Signer<'info>,

    pub token_program: Interface<'info, TokenInterface>,
}

pub fn handler(ctx: Context<SeizeFunds>, amount: u64) -> Result<()> {
    let mint_info = ctx.accounts.mint.to_account_info();
    let mint_data = mint_info.data.borrow();
    
    // Check if mint is an SSS-2 token with the Permanent Delegate extension enabled
    // This is the Graceful Failure Mechanism!
    if !StateWithExtensions::<spl_token_2022::state::Mint>::unpack(&mint_data)
        .unwrap()
        .get_extension::<PermanentDelegate>()
        .is_ok() {
        return err!(ProgramError::NotSSS2Compliant);
    }

    // Gracefully check if the delegate actually matches
    let delegate_info = StateWithExtensions::<spl_token_2022::state::Mint>::unpack(&mint_data)
        .unwrap()
        .get_extension::<PermanentDelegate>()
        .unwrap()
        .delegate;
    
    // Convert Option<Pubkey> to check if delegate exists
    let delegate_pubkey: Option<Pubkey> = delegate_info.into();
    if delegate_pubkey.is_none() {
        return err!(ProgramError::MissingPermanentDelegate);
    }

    // Here we construct a CPI caller to forcefully seize funds using the permanent delegate.
    let transfer_cpi_accounts = TransferChecked {
        from: ctx.accounts.source_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.destination_account.to_account_info(),
        authority: ctx.accounts.delegate.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_cpi_accounts,
    );
    
    // Seize via CPI transfer
    token_interface::transfer_checked(cpi_ctx, amount, ctx.accounts.mint.decimals)?;

    Ok(())
}
