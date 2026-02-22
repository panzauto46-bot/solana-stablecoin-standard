import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { Connection } from "@solana/web3.js";
import { logger } from "./utils/logger";
import { IndexerService } from "./services/indexer.service";
import { MintBurnService } from "./services/mint-burn.service";
import { ComplianceService } from "./services/compliance.service";
import { WebhookService } from "./services/webhook.service";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8899";
const MINT_ADDRESS = process.env.MINT_ADDRESS || "LocalMockMint1111111111111111111111111111";

const connection = new Connection(RPC_URL, "confirmed");
const webhookService = new WebhookService();
const complianceService = new ComplianceService(webhookService);
const indexerService = new IndexerService(connection, MINT_ADDRESS, complianceService);
const mintBurnService = new MintBurnService(connection);

const parseNumber = (value: unknown, field: string): number => {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    throw new Error(`${field} must be a number.`);
  }
  return n;
};

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "sss-watchtower-backend",
    rpc: RPC_URL,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/status", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    rpc: RPC_URL,
    mintAddress: MINT_ADDRESS,
    totalSupply: mintBurnService.getTotalSupply(),
    blacklistCount: complianceService.listBlacklist().length,
    minterCount: mintBurnService.listMinters().length,
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/mint", async (req: Request, res: Response) => {
  try {
    const amount = parseNumber(req.body?.amount, "amount");
    const destination = String(req.body?.destination || "");
    if (!destination) throw new Error("destination is required.");
    const result = await mintBurnService.requestMint(amount, destination);
    res.json(result);
  } catch (error) {
    const msg = (error as Error).message;
    logger.error(`Mint error: ${msg}`);
    res.status(400).json({ error: msg });
  }
});

app.post("/api/burn", async (req: Request, res: Response) => {
  try {
    const amount = parseNumber(req.body?.amount, "amount");
    const source = String(req.body?.source || "");
    if (!source) throw new Error("source is required.");
    const result = await mintBurnService.requestBurn(amount, source);
    res.json(result);
  } catch (error) {
    const msg = (error as Error).message;
    logger.error(`Burn error: ${msg}`);
    res.status(400).json({ error: msg });
  }
});

app.get("/api/supply", (_req: Request, res: Response) => {
  res.json({ totalSupply: mintBurnService.getTotalSupply() });
});

app.get("/api/holders", (req: Request, res: Response) => {
  const minBalance = req.query.minBalance ? Number(req.query.minBalance) : 0;
  const holders = mintBurnService.getHolders(Number.isFinite(minBalance) ? minBalance : 0);
  res.json({ count: holders.length, holders });
});

app.get("/api/minters", (_req: Request, res: Response) => {
  res.json({ minters: mintBurnService.listMinters() });
});

app.post("/api/minters/add", (req: Request, res: Response) => {
  try {
    const address = String(req.body?.address || "");
    if (!address) throw new Error("address is required.");
    const result = mintBurnService.addMinter(address);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post("/api/minters/remove", (req: Request, res: Response) => {
  try {
    const address = String(req.body?.address || "");
    if (!address) throw new Error("address is required.");
    const result = mintBurnService.removeMinter(address);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post("/api/compliance/blacklist", async (req: Request, res: Response) => {
  try {
    const address = String(req.body?.address || "");
    const reason = String(req.body?.reason || "Manual action");
    if (!address) throw new Error("address is required.");
    const result = await complianceService.addToBlacklist(address, reason);
    res.json(result);
  } catch (error) {
    const msg = (error as Error).message;
    logger.error(`Blacklist add error: ${msg}`);
    res.status(400).json({ error: msg });
  }
});

app.post("/api/compliance/blacklist/remove", async (req: Request, res: Response) => {
  try {
    const address = String(req.body?.address || "");
    if (!address) throw new Error("address is required.");
    const result = await complianceService.removeFromBlacklist(address);
    res.json(result);
  } catch (error) {
    const msg = (error as Error).message;
    logger.error(`Blacklist remove error: ${msg}`);
    res.status(400).json({ error: msg });
  }
});

app.get("/api/compliance/blacklist", (_req: Request, res: Response) => {
  const entries = complianceService.listBlacklist();
  res.json({ count: entries.length, entries });
});

app.get("/api/compliance/audit-log", (req: Request, res: Response) => {
  const action = req.query.action ? String(req.query.action) : undefined;
  res.json({ entries: complianceService.getAuditLog(action) });
});

app.get("/api/audit-log", (req: Request, res: Response) => {
  const action = req.query.action ? String(req.query.action) : undefined;
  const mintBurn = mintBurnService.getAuditLog(
    action as "mint" | "burn" | "minter_add" | "minter_remove" | undefined,
  );
  const compliance = complianceService.getAuditLog(action);
  res.json({ mintBurn, compliance });
});

app.listen(PORT, () => {
  logger.info(`SSS Watchtower Backend running on port ${PORT}`);
  logger.info(`Connected to Solana RPC: ${RPC_URL}`);
  indexerService.startListening();
});
