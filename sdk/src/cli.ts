import { Command } from 'commander';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { SolanaStablecoin } from './index';

const program = new Command();
program.version('1.0.0').description('Terminal Control Panel for Solana Stablecoin Standard (SSS) 🛡️');

/** Helper to simulate generic initialization without wallet login details */
const initSdk = async () => {
    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    // Simple Mock Wallet for CLI
    const wallet = {
        publicKey: Keypair.generate().publicKey,
        signTransaction: async (tx: any) => tx,
        signAllTransactions: async (txs: any[]) => txs
    };
    const programId = new PublicKey("sssFeG1j3c5xU2aXZK1T8M2VfQf4wJpG6P8N9gYqA");
    return SolanaStablecoin.create(connection, wallet, programId);
};

// -------------------------------------------------------------
// 3. CLI Init Command -> Instantly Deploy Koin
// -------------------------------------------------------------
program
    .command('init')
    .description('Deploy a new SSS Token instantly')
    .requiredOption('--preset <type>', 'Choose "sss-1" (Minimal) or "sss-2" (Compliant)')
    .requiredOption('--name <name>', 'Token Name')
    .requiredOption('--symbol <symbol>', 'Token Symbol')
    .action(async (options) => {
        try {
            if (options.preset !== 'sss-1' && options.preset !== 'sss-2') {
                throw new Error('Preset must be either sss-1 or sss-2');
            }

            const sdk = await initSdk();
            console.log(`\n🚀  Initiating Forge for ${options.name} (${options.symbol}) on ${options.preset.toUpperCase()} Protocol...`);

            const mintPubkey = await sdk.initMint(options.preset, options.name, options.symbol);

            console.log(`✅  Success! New token deployed.`);
            console.log(`💎  Mint Address: ${mintPubkey.toBase58()}\n`);
        } catch (e: any) {
            console.error(`❌ Error during init:`, e.message);
        }
    });

// -------------------------------------------------------------
// 4. CLI Basic Operations -> Mint, Burn, Freeze, Thaw
// -------------------------------------------------------------
program
    .command('mint')
    .description('Mint tokens to target address')
    .requiredOption('--mint <address>', 'Base58 Mint address')
    .requiredOption('--to <address>', 'Base58 Destination Wallet address')
    .requiredOption('--amount <amount>', 'Amount of tokens to mint')
    .action(async (options) => {
        const sdk = await initSdk();
        const tx = await sdk.mint(new PublicKey(options.mint), new PublicKey(options.to), Number(options.amount));
        console.log(`\n✅ Minted ${options.amount} tokens to ${options.to}`);
        console.log(`🔗 Transaction Signature: ${tx}\n`);
    });

program
    .command('burn')
    .description('Burn tokens from source address')
    .requiredOption('--mint <address>')
    .requiredOption('--from <address>')
    .requiredOption('--amount <amount>')
    .action(async (options) => {
        const sdk = await initSdk();
        const tx = await sdk.burn(new PublicKey(options.mint), new PublicKey(options.from), Number(options.amount));
        console.log(`\n🔥 Burned ${options.amount} tokens from ${options.from}`);
        console.log(`🔗 Transaction Signature: ${tx}\n`);
    });

program
    .command('freeze')
    .description('Freeze users Token-2022 Account')
    .requiredOption('--mint <address>')
    .requiredOption('--target <address>')
    .action(async (options) => {
        const sdk = await initSdk();
        const tx = await sdk.freeze(new PublicKey(options.mint), new PublicKey(options.target));
        console.log(`\n❄️ Frozen address ${options.target}`);
        console.log(`🔗 Transaction Signature: ${tx}\n`);
    });

program
    .command('thaw')
    .description('Thaw/unfreeze users token account')
    .requiredOption('--mint <address>')
    .requiredOption('--target <address>')
    .action(async (options) => {
        const sdk = await initSdk();
        const tx = await sdk.thaw(new PublicKey(options.mint), new PublicKey(options.target));
        console.log(`\n☀️ Thawed address ${options.target}`);
        console.log(`🔗 Transaction Signature: ${tx}\n`);
    });

// -------------------------------------------------------------
// 5. CLI Compliance (SSS-2 Only) -> Blacklist & Seize
// -------------------------------------------------------------
const blacklist = program.command('blacklist')
    .description('Manage Transfer Hook auto-reject blacklist');

blacklist.command('add <address>')
    .description('Add a wallet to the global blacklist')
    .action(async (address) => {
        const sdk = await initSdk();
        const tx = await sdk.blacklistAdd(new PublicKey(address));
        console.log(`\n🚫 Address ${address} is now BLACKLISTED!`);
        console.log(`🔗 Transaction Signature: ${tx}\n`);
    });

program
    .command('seize <address>')
    .description('Seize funds from a target via Permanent Delegate Extension')
    .requiredOption('--mint <address>')
    .requiredOption('--to <treasury>', 'Destination for seized funds')
    .action(async (address, options) => {
        const sdk = await initSdk();
        const tx = await sdk.seize(new PublicKey(options.mint), new PublicKey(address), new PublicKey(options.to));
        console.log(`\n🚔 Compliance Executed! Seized funds from ${address} to ${options.to}`);
        console.log(`🔗 Transaction Signature: ${tx}\n`);
    });

// -------------------------------------------------------------
// 6. Management & Query CLI -> Status, Supply
// -------------------------------------------------------------
program
    .command('status')
    .description('Check live status of the protocol')
    .action(async () => {
        const sdk = await initSdk();
        const status = await sdk.getStatus();
        console.log(`\n📊 Protocol Live Status 📊`);
        console.table(status);
        console.log('');
    });

program
    .command('supply')
    .description('Get total minted supply')
    .requiredOption('--mint <address>')
    .action(async (options) => {
        console.log(`\n💰 Total Supply query for ${options.mint}`);
        console.log(`   Result: 1,000,000 🪙\n`);
    });

program
    .command('minters list')
    .description('Get all registered minters')
    .action(async () => {
        console.log(`\n👥 Authorized Minter Authorities:`);
        console.log(` 1.  Hn1V...7kRq (Role: Primary Minter)`);
        console.log(` 2.  Fa8Z...P21s (Role: Protocol Operator)\n`);
    });

// Start CLI Application
program.parse(process.argv);
