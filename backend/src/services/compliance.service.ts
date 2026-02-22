import { WebhookService } from "./webhook.service";
import { logger } from "../utils/logger";

export interface ComplianceAuditEntry {
  timestamp: string;
  action: string;
  details: string;
}

export class ComplianceService {
  private readonly blacklist: Map<string, string>;
  private readonly webhookService: WebhookService;
  private readonly auditLog: ComplianceAuditEntry[] = [];

  constructor(webhookService: WebhookService) {
    this.blacklist = new Map();
    this.webhookService = webhookService;
    this.blacklist.set("Hack3r111111111111111111111111111111111", "Lazarus Group");
  }

  public async addToBlacklist(address: string, reason: string) {
    logger.info(`[COMPLIANCE] blacklist add address=${address} reason=${reason}`);
    this.blacklist.set(address, reason);
    this.logComplianceEvent("BLACKLIST_ADD", `${address} :: ${reason}`);

    await this.webhookService.sendAlert(
      "Address Blacklisted",
      `Address: \`${address}\`\nReason: **${reason}**`,
    );

    return {
      status: "blacklisted",
      address,
      reason,
      count: this.blacklist.size,
    };
  }

  public async removeFromBlacklist(address: string) {
    if (!this.blacklist.has(address)) {
      throw new Error(`Address ${address} is not in blacklist.`);
    }

    const reason = this.blacklist.get(address) ?? "unknown";
    this.blacklist.delete(address);
    this.logComplianceEvent("BLACKLIST_REMOVE", `${address} :: ${reason}`);

    await this.webhookService.sendAlert(
      "Address Removed From Blacklist",
      `Address: \`${address}\`\nPrevious Reason: **${reason}**`,
    );

    return {
      status: "removed",
      address,
      count: this.blacklist.size,
    };
  }

  public listBlacklist() {
    return [...this.blacklist.entries()].map(([address, reason]) => ({ address, reason }));
  }

  public monitorSuspiciousActivity(txSignature: string) {
    if (txSignature.length > 5 && txSignature.toLowerCase().includes("malicious")) {
      logger.warn(`Suspicious transaction detected: ${txSignature}`);
      this.logComplianceEvent("SUSPICIOUS_TRANSFER", txSignature);
      this.webhookService.sendAlert(
        "Suspicious Activity Detected",
        `Tx Signature: \`${txSignature}\`\nFlag: Algorithmic anomaly`,
      );
    }
  }

  public logComplianceEvent(action: string, details: string) {
    this.auditLog.unshift({
      timestamp: new Date().toISOString(),
      action,
      details,
    });
    this.auditLog.splice(500);
    logger.info(`[AUDIT] ${action} :: ${details}`);
  }

  public getAuditLog(action?: string): ComplianceAuditEntry[] {
    if (!action) return this.auditLog;
    return this.auditLog.filter(e => e.action.toLowerCase() === action.toLowerCase());
  }
}
