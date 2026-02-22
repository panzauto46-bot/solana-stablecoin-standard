import { Command } from "commander";
import fs from "fs";
import path from "path";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  Presets,
  SolanaStablecoin,
  StablecoinCreateInput,
  StablecoinSnapshot,
} from "./index";

type ConfigFileInput = {
  preset?: string;
  name?: string;
  symbol?: string;
  uri?: string;
  decimals?: number;
  extensions?: {
    permanentDelegate?: boolean;
    transferHook?: boolean;
    defaultAccountFrozen?: boolean;
    metadata?: boolean;
  };
};

type AuditRecord = {
  timestamp: string;
  action: string;
  payload: string;
  signature?: string;
};

type LocalState = {
  rpcUrl: string;
  programId: string;
  authority: string;
  stablecoin?: StablecoinSnapshot;
  auditLog: AuditRecord[];
};

const DEFAULT_RPC = process.env.SSS_RPC_URL || "https://api.devnet.solana.com";
const FALLBACK_PROGRAM_ID = "11111111111111111111111111111111";
const DEFAULT_PROGRAM_ID = (() => {
  const fromEnv = process.env.SSS_PROGRAM_ID;
  if (!fromEnv) {
    return FALLBACK_PROGRAM_ID;
  }
  try {
    return new PublicKey(fromEnv).toBase58();
  } catch {
    return FALLBACK_PROGRAM_ID;
  }
})();
const STATE_PATH = path.resolve(process.cwd(), ".sss-token-state.json");

const program = new Command();
program
  .name("sss-token")
  .description("CLI for Solana Stablecoin Standard (SSS)")
  .version("2.0.0");

function defaultState(): LocalState {
  return {
    rpcUrl: DEFAULT_RPC,
    programId: DEFAULT_PROGRAM_ID,
    authority: Keypair.generate().publicKey.toBase58(),
    auditLog: [],
  };
}

function sanitizePublicKeyString(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }
  try {
    return new PublicKey(value).toBase58();
  } catch {
    return fallback;
  }
}

function loadState(): LocalState {
  if (!fs.existsSync(STATE_PATH)) {
    return defaultState();
  }
  const raw = fs.readFileSync(STATE_PATH, "utf-8");
  const parsed = JSON.parse(raw) as Partial<LocalState>;
  const fallback = defaultState();
  return {
    ...fallback,
    ...parsed,
    programId: sanitizePublicKeyString(parsed.programId, fallback.programId),
    authority: sanitizePublicKeyString(parsed.authority, fallback.authority),
    auditLog: parsed.auditLog ?? [],
  };
}

function saveState(state: LocalState): void {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

function addAudit(state: LocalState, action: string, payload: string, signature?: string) {
  state.auditLog.unshift({
    timestamp: new Date().toISOString(),
    action,
    payload,
    signature,
  });
  state.auditLog = state.auditLog.slice(0, 500);
}

function parseValue(raw: string): string | number | boolean {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  const asNumber = Number(trimmed);
  if (!Number.isNaN(asNumber)) return asNumber;
  return trimmed;
}

function parseBasicToml(input: string): ConfigFileInput {
  const result: ConfigFileInput = {};
  let section = "";

  for (const line of input.split(/\r?\n/)) {
    const clean = line.replace(/#.*$/, "").trim();
    if (!clean) continue;
    if (clean.startsWith("[") && clean.endsWith("]")) {
      section = clean.slice(1, -1).trim();
      continue;
    }
    const match = clean.match(/^([A-Za-z0-9_.-]+)\s*=\s*(.+)$/);
    if (!match) continue;
    const key = match[1];
    const value = parseValue(match[2]);

    if (!section) {
      (result as Record<string, unknown>)[key] = value;
      continue;
    }

    if (section === "extensions") {
      result.extensions = result.extensions || {};
      (result.extensions as Record<string, unknown>)[key] = value;
    }
  }
  return result;
}

function loadConfigFile(customPath: string): ConfigFileInput {
  const absPath = path.resolve(process.cwd(), customPath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Config file not found: ${absPath}`);
  }
  const raw = fs.readFileSync(absPath, "utf-8");
  if (absPath.endsWith(".json")) {
    return JSON.parse(raw) as ConfigFileInput;
  }
  if (absPath.endsWith(".toml")) {
    return parseBasicToml(raw);
  }
  throw new Error("Unsupported config format. Use .json or .toml");
}

function toPreset(input: string): Presets {
  const normalized = input.toLowerCase().trim();
  if (normalized === "sss-1") return Presets.SSS_1;
  if (normalized === "sss-2") return Presets.SSS_2;
  throw new Error(`Invalid preset: ${input}. Use sss-1 or sss-2.`);
}

function getAuthority(state: LocalState): { publicKey: PublicKey } {
  return { publicKey: new PublicKey(state.authority) };
}

async function openStablecoin(required = true): Promise<{ state: LocalState; stablecoin?: SolanaStablecoin }> {
  const state = loadState();
  if (!state.stablecoin) {
    if (required) {
      throw new Error("No initialized token state. Run `sss-token init` first.");
    }
    return { state };
  }
  const connection = new Connection(state.rpcUrl, "confirmed");
  const stablecoin = await SolanaStablecoin.open(
    connection,
    {
      name: state.stablecoin.name,
      symbol: state.stablecoin.symbol,
      decimals: state.stablecoin.decimals,
      preset: state.stablecoin.preset,
      extensions: state.stablecoin.extensions,
      authority: getAuthority(state),
      programId: new PublicKey(state.programId),
    },
    state.stablecoin,
  );
  return { state, stablecoin };
}

program
  .command("configure")
  .description("Configure local CLI defaults (RPC / Program ID / Authority)")
  .option("--rpc <url>", "RPC URL")
  .option("--program-id <pubkey>", "Anchor program id")
  .option("--authority <pubkey>", "Operator authority public key")
  .action(async options => {
    const state = loadState();
    if (options.rpc) state.rpcUrl = options.rpc;
    if (options.programId) {
      new PublicKey(options.programId);
      state.programId = options.programId;
    }
    if (options.authority) {
      new PublicKey(options.authority);
      state.authority = options.authority;
    }
    saveState(state);
    console.log("\nConfiguration updated.");
    console.table({
      rpcUrl: state.rpcUrl,
      programId: state.programId,
      authority: state.authority,
      stateFile: STATE_PATH,
    });
    console.log("");
  });

program
  .command("init")
  .description("Initialize a stablecoin with preset or custom config")
  .option("--preset <preset>", "sss-1 or sss-2")
  .option("--custom <file>", "Path to JSON/TOML config")
  .option("--name <name>", "Token name")
  .option("--symbol <symbol>", "Token symbol")
  .option("--decimals <number>", "Token decimals", "6")
  .option("--uri <uri>", "Metadata URI", "")
  .action(async options => {
    try {
      if (!options.preset && !options.custom) {
        throw new Error("Use either --preset or --custom.");
      }

      const state = loadState();
      const fromFile = options.custom ? loadConfigFile(options.custom) : {};
      const presetValue = options.preset ?? fromFile.preset;
      if (!presetValue) {
        throw new Error("Preset is required. Provide --preset or preset in config file.");
      }

      const input: StablecoinCreateInput = {
        preset: toPreset(String(presetValue)),
        name: options.name ?? fromFile.name ?? "",
        symbol: options.symbol ?? fromFile.symbol ?? "",
        uri: options.uri || fromFile.uri || "",
        decimals: Number(options.decimals ?? fromFile.decimals ?? 6),
        authority: getAuthority(state),
        programId: new PublicKey(state.programId),
        extensions: fromFile.extensions,
      };

      if (!input.name.trim() || !input.symbol.trim()) {
        throw new Error("Both name and symbol are required.");
      }

      const connection = new Connection(state.rpcUrl, "confirmed");
      const stablecoin = await SolanaStablecoin.create(connection, input);
      const snapshot = stablecoin.toSnapshot();

      state.stablecoin = snapshot;
      addAudit(
        state,
        "init",
        `preset=${snapshot.preset} name=${snapshot.name} symbol=${snapshot.symbol}`,
      );
      saveState(state);

      console.log("\nStablecoin initialized.");
      console.table({
        preset: snapshot.preset,
        name: snapshot.name,
        symbol: snapshot.symbol,
        mint: snapshot.mint,
        decimals: snapshot.decimals,
      });
      console.log("");
    } catch (error) {
      console.error(`\nInit failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command("mint <recipient> <amount>")
  .description("Mint tokens to recipient")
  .action(async (recipient: string, amount: string) => {
    try {
      const { state, stablecoin } = await openStablecoin();
      const tx = await stablecoin!.mint({
        recipient: new PublicKey(recipient),
        amount: Number(amount),
      });
      state.stablecoin = stablecoin!.toSnapshot();
      addAudit(state, "mint", `recipient=${recipient} amount=${amount}`, tx.signature);
      saveState(state);
      console.log(`\nMint success: ${tx.signature}\n`);
    } catch (error) {
      console.error(`\nMint failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command("burn <amount>")
  .description("Burn tokens from treasury/operator")
  .option("--from <address>", "Source address")
  .action(async (amount: string, options) => {
    try {
      const { state, stablecoin } = await openStablecoin();
      const tx = await stablecoin!.burn({
        amount: Number(amount),
        from: options.from ? new PublicKey(options.from) : undefined,
      });
      state.stablecoin = stablecoin!.toSnapshot();
      addAudit(state, "burn", `from=${options.from || "authority"} amount=${amount}`, tx.signature);
      saveState(state);
      console.log(`\nBurn success: ${tx.signature}\n`);
    } catch (error) {
      console.error(`\nBurn failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command("freeze <address>")
  .description("Freeze address")
  .action(async (address: string) => {
    try {
      const { state, stablecoin } = await openStablecoin();
      const tx = await stablecoin!.freeze({ address: new PublicKey(address) });
      state.stablecoin = stablecoin!.toSnapshot();
      addAudit(state, "freeze", `address=${address}`, tx.signature);
      saveState(state);
      console.log(`\nFreeze success: ${tx.signature}\n`);
    } catch (error) {
      console.error(`\nFreeze failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command("thaw <address>")
  .description("Thaw address")
  .action(async (address: string) => {
    try {
      const { state, stablecoin } = await openStablecoin();
      const tx = await stablecoin!.thaw({ address: new PublicKey(address) });
      state.stablecoin = stablecoin!.toSnapshot();
      addAudit(state, "thaw", `address=${address}`, tx.signature);
      saveState(state);
      console.log(`\nThaw success: ${tx.signature}\n`);
    } catch (error) {
      console.error(`\nThaw failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command("pause")
  .description("Pause token operations")
  .action(async () => {
    try {
      const { state, stablecoin } = await openStablecoin();
      const tx = await stablecoin!.pause();
      state.stablecoin = stablecoin!.toSnapshot();
      addAudit(state, "pause", "token paused", tx.signature);
      saveState(state);
      console.log(`\nPaused: ${tx.signature}\n`);
    } catch (error) {
      console.error(`\nPause failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command("unpause")
  .description("Unpause token operations")
  .action(async () => {
    try {
      const { state, stablecoin } = await openStablecoin();
      const tx = await stablecoin!.unpause();
      state.stablecoin = stablecoin!.toSnapshot();
      addAudit(state, "unpause", "token unpaused", tx.signature);
      saveState(state);
      console.log(`\nUnpaused: ${tx.signature}\n`);
    } catch (error) {
      console.error(`\nUnpause failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

const blacklist = program.command("blacklist").description("Blacklist management (SSS-2)");

blacklist
  .command("add <address>")
  .description("Add address to blacklist")
  .option("--reason <reason>", "Blacklist reason", "Manual compliance action")
  .action(async (address: string, options) => {
    try {
      const { state, stablecoin } = await openStablecoin();
      const tx = await stablecoin!.compliance.blacklistAdd(new PublicKey(address), String(options.reason));
      state.stablecoin = stablecoin!.toSnapshot();
      addAudit(state, "blacklist_add", `address=${address} reason=${options.reason}`, tx.signature);
      saveState(state);
      console.log(`\nBlacklisted: ${address}`);
      console.log(`Tx: ${tx.signature}\n`);
    } catch (error) {
      console.error(`\nBlacklist add failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

blacklist
  .command("remove <address>")
  .description("Remove address from blacklist")
  .action(async (address: string) => {
    try {
      const { state, stablecoin } = await openStablecoin();
      const tx = await stablecoin!.compliance.blacklistRemove(new PublicKey(address));
      state.stablecoin = stablecoin!.toSnapshot();
      addAudit(state, "blacklist_remove", `address=${address}`, tx.signature);
      saveState(state);
      console.log(`\nRemoved from blacklist: ${address}`);
      console.log(`Tx: ${tx.signature}\n`);
    } catch (error) {
      console.error(`\nBlacklist remove failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command("seize <address>")
  .description("Seize funds from blacklisted account (SSS-2)")
  .requiredOption("--to <treasury>", "Treasury destination address")
  .option("--amount <amount>", "Specific amount to seize")
  .action(async (address: string, options) => {
    try {
      const { state, stablecoin } = await openStablecoin();
      const tx = await stablecoin!.compliance.seize({
        from: new PublicKey(address),
        to: new PublicKey(options.to),
        amount: options.amount ? Number(options.amount) : undefined,
      });
      state.stablecoin = stablecoin!.toSnapshot();
      addAudit(state, "seize", `from=${address} to=${options.to} amount=${options.amount || "all"}`, tx.signature);
      saveState(state);
      console.log(`\nSeize success: ${tx.signature}\n`);
    } catch (error) {
      console.error(`\nSeize failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command("status")
  .description("Show token runtime status")
  .action(async () => {
    try {
      const { stablecoin } = await openStablecoin();
      const status = await stablecoin!.status();
      console.log("");
      console.table(status);
      console.log("");
    } catch (error) {
      console.error(`\nStatus failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command("supply")
  .description("Show total token supply")
  .action(async () => {
    try {
      const { stablecoin } = await openStablecoin();
      const supply = await stablecoin!.getTotalSupply();
      console.log(`\nTotal supply: ${supply}\n`);
    } catch (error) {
      console.error(`\nSupply failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

const minters = program.command("minters").description("Minter role management");

minters
  .command("list")
  .description("List active minter roles")
  .action(async () => {
    try {
      const { stablecoin } = await openStablecoin();
      const entries = await stablecoin!.mintersList();
      console.log("");
      console.table(entries);
      console.log("");
    } catch (error) {
      console.error(`\nMinters list failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

minters
  .command("add <address>")
  .description("Assign minter role to address")
  .action(async (address: string) => {
    try {
      const { state, stablecoin } = await openStablecoin();
      const tx = await stablecoin!.updateRoles({ minter: new PublicKey(address) });
      state.stablecoin = stablecoin!.toSnapshot();
      addAudit(state, "minter_add", `address=${address}`, tx.signature);
      saveState(state);
      console.log(`\nMinter updated: ${address}`);
      console.log(`Tx: ${tx.signature}\n`);
    } catch (error) {
      console.error(`\nMinter add failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

minters
  .command("remove <address>")
  .description("Remove minter by resetting to authority")
  .action(async (address: string) => {
    try {
      const { state, stablecoin } = await openStablecoin();
      const current = stablecoin!.getRoles().minter.toBase58();
      if (current !== address) {
        throw new Error(`Address ${address} is not the current minter.`);
      }
      const tx = await stablecoin!.updateRoles({ minter: new PublicKey(state.authority) });
      state.stablecoin = stablecoin!.toSnapshot();
      addAudit(state, "minter_remove", `address=${address}`, tx.signature);
      saveState(state);
      console.log(`\nMinter removed (reset to authority).`);
      console.log(`Tx: ${tx.signature}\n`);
    } catch (error) {
      console.error(`\nMinter remove failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command("holders")
  .description("List holders")
  .option("--min-balance <amount>", "Minimum balance filter", "0")
  .action(async options => {
    try {
      const { stablecoin } = await openStablecoin();
      const holders = await stablecoin!.holders({ minBalance: Number(options.minBalance) });
      console.log("");
      console.table(holders);
      console.log("");
    } catch (error) {
      console.error(`\nHolders failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command("audit-log")
  .description("Show local operator audit log")
  .option("--action <type>", "Filter by action type")
  .action(async options => {
    const state = loadState();
    const entries = options.action
      ? state.auditLog.filter(e => e.action === String(options.action))
      : state.auditLog;
    console.log("");
    console.table(entries.slice(0, 100));
    console.log("");
  });

program
  .command("transfer-authority <address>")
  .description("Transfer master authority")
  .action(async (address: string) => {
    try {
      const { state, stablecoin } = await openStablecoin();
      const tx = await stablecoin!.transferAuthority(new PublicKey(address));
      state.stablecoin = stablecoin!.toSnapshot();
      state.authority = address;
      addAudit(state, "transfer_authority", `newAuthority=${address}`, tx.signature);
      saveState(state);
      console.log(`\nAuthority transferred to ${address}`);
      console.log(`Tx: ${tx.signature}\n`);
    } catch (error) {
      console.error(`\nTransfer authority failed: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program.parse(process.argv);
