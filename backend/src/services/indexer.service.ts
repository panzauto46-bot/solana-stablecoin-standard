import { Connection, PublicKey } from "@solana/web3.js";
import { logger } from "../utils/logger";
import { ComplianceService } from "./compliance.service";

type OnLogsPayload = {
  signature: string;
  logs: string[];
};

export class IndexerService {
  private readonly connection: Connection;
  private readonly mintAddress: PublicKey;
  private readonly complianceService: ComplianceService;
  private subscriptionId: number | null = null;

  constructor(connection: Connection, mintAddress: string, complianceService: ComplianceService) {
    this.connection = connection;
    try {
      this.mintAddress = new PublicKey(mintAddress);
    } catch {
      this.mintAddress = new PublicKey("11111111111111111111111111111111");
    }
    this.complianceService = complianceService;
  }

  public async startListening() {
    logger.info(`Starting blockchain indexer for mint: ${this.mintAddress.toBase58()}`);
    this.subscriptionId = this.connection.onLogs(
      this.mintAddress,
      (logs: OnLogsPayload, _ctx: unknown) => {
        logger.info(`[INDEXER] Transaction signature: ${logs.signature}`);
        this.processLogs(logs.signature, logs.logs);
      },
      "confirmed",
    );
  }

  private processLogs(signature: string, logs: string[]) {
    const isMint = logs.some(log => log.includes("Instruction: MintTo"));
    const isBurn = logs.some(log => log.includes("Instruction: Burn"));
    const isTransfer = logs.some(log => log.includes("Instruction: Transfer"));
    const isSeize = logs.some(log => log.includes("Instruction: SeizeFunds"));

    if (isSeize) {
      this.complianceService.logComplianceEvent("SEIZE_FUNDS", signature);
      return;
    }
    if (isMint) {
      logger.info(`MINT event detected: ${signature}`);
      return;
    }
    if (isBurn) {
      logger.info(`BURN event detected: ${signature}`);
      return;
    }
    if (isTransfer) {
      logger.info(`TRANSFER event detected: ${signature}`);
      this.complianceService.monitorSuspiciousActivity(signature);
    }
  }

  public stopListening() {
    if (!this.subscriptionId) return;
    this.connection.removeOnLogsListener(this.subscriptionId);
    logger.info("Indexer stopped.");
  }
}
