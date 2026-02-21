use anchor_lang::prelude::*;

pub mod errors;
pub mod state;
pub mod instructions;

use instructions::*;

declare_id!("sssFeG1j3c5xU2aXZK1T8M2VfQf4wJpG6P8N9gYqA");

#[program]
pub mod sss_forge {
    use super::*;

    /// Initialize the global configuration (RBAC)
    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        master: Pubkey,
        minter: Pubkey,
        burner: Pubkey,
        pauser: Pubkey,
        blacklister: Pubkey,
        seizer: Pubkey,
    ) -> Result<()> {
        instructions::initialize_config::handler(
            ctx, master, minter, burner, pauser, blacklister, seizer
        )
    }

    /// Update the RBAC configuration
    pub fn update_config(
        ctx: Context<UpdateConfig>,
        minter: Pubkey,
        burner: Pubkey,
        pauser: Pubkey,
        blacklister: Pubkey,
        seizer: Pubkey,
    ) -> Result<()> {
        instructions::update_config::handler(
            ctx, minter, burner, pauser, blacklister, seizer
        )
    }

    /// Initialize an SSS-1 Token (Minimal Stablecoin)
    /// Features: Mint Authority, Freeze Authority, Metadata
    pub fn initialize_sss1(
        ctx: Context<InitializeSSS1>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
    ) -> Result<()> {
        instructions::initialize_sss1::handler(ctx, name, symbol, uri, decimals)
    }

    /// Initialize an SSS-2 Token (Compliant Stablecoin)
    /// Features: SSS-1 + Permanent Delegate, Default Account State, Transfer Hook
    pub fn initialize_sss2(
        ctx: Context<InitializeSSS2>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
    ) -> Result<()> {
        instructions::initialize_sss2::handler(ctx, name, symbol, uri, decimals)
    }

    /// Add an account to the blacklist
    pub fn add_to_blacklist(ctx: Context<ManageBlacklist>, account_to_blacklist: Pubkey) -> Result<()> {
        instructions::blacklist::add_to_blacklist(ctx, account_to_blacklist)
    }

    /// Remove an account from the blacklist
    pub fn remove_from_blacklist(ctx: Context<ManageBlacklist>, account_to_remove: Pubkey) -> Result<()> {
        instructions::blacklist::remove_from_blacklist(ctx, account_to_remove)
    }

    /// Seize funds from a suspected/hacked wallet to a treasury wallet
    pub fn seize_funds(ctx: Context<SeizeFunds>, amount: u64) -> Result<()> {
        instructions::seize::handler(ctx, amount)
    }

    /// Transfer Hook execution
    /// This is automatically called by Token-2022 on transfer
    #[interface(spl_transfer_hook_interface::execute)]
    pub fn transfer_hook_execute(ctx: Context<TransferHookExecute>, amount: u64) -> Result<()> {
        instructions::transfer_hook::handler(ctx, amount)
    }
}
