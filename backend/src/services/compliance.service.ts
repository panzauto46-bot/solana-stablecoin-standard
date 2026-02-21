import { WebhookService } from './webhook.service';
import { logger } from '../utils/logger';

export class ComplianceService {
    private blacklist: Map<string, string>;
    private webhookService: WebhookService;

    constructor(webhookService: WebhookService) {
        this.blacklist = new Map();
        this.webhookService = webhookService;

        // Load existing (mock)
        this.blacklist.set('Hack3r111111111111111111111111111111111', 'Lazarus Group');
    }

    public async addToBlacklist(address: string, reason: string) {
        logger.info(`🚫 [COMPLIANCE] Adding ${address} to Global Transfer Hook Blacklist.`);
        logger.info(`   Reason: ${reason}`);

        this.blacklist.set(address, reason);

        // Trigger on-chain transaction
        // await sdk.blacklistAdd(new PublicKey(address));

        await this.webhookService.sendAlert(
            "🛑 ADDRESS BLACKLISTED",
            `Address: \`${address}\`\nReason: **${reason}**\nTx: [View on Explorer](#)`
        );

        return {
            status: 'Blacklisted',
            address,
            reason
        };
    }

    // Called blindly by the indexer
    public monitorSuspiciousActivity(txSignature: string) {
        // Artificial logic: If tx ending with generic string, we flag it.
        if (txSignature.length > 5 && txSignature.includes('malicious')) {
            logger.warn(`⚠️ Suspicious Transaction Detected! Tx: ${txSignature}`);
            this.logComplianceEvent('SUSPICIOUS_TRANSFER', txSignature);
            this.webhookService.sendAlert(
                "⚠️ SUSPICIOUS ACTIVITY DETECTED",
                `Tx Signature: \`${txSignature}\`\nFlag: Algorithmic Anomaly`
            );
        }
    }

    public logComplianceEvent(type: string, signature: string) {
        // In production, this writes to PostgreSQL for regulators
        logger.info(`📁 [AUDIT LOG] ${new Date().toISOString()} | TYPE: ${type} | SIG: ${signature}`);
    }
}
