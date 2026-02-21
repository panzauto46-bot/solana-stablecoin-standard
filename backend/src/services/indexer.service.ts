import { Connection, PublicKey } from '@solana/web3.js';
import { logger } from '../utils/logger';
import { ComplianceService } from './compliance.service';

export class IndexerService {
    private connection: Connection;
    private mintAddress: PublicKey;
    private complianceService: ComplianceService;
    private subscriptionId: number | null = null;

    constructor(connection: Connection, mintAddress: string, complianceService: ComplianceService) {
        this.connection = connection;
        try {
            this.mintAddress = new PublicKey(mintAddress);
        } catch {
            // Mock Public Key for local testing
            this.mintAddress = new PublicKey('11111111111111111111111111111111');
        }
        this.complianceService = complianceService;
    }

    public async startListening() {
        logger.info(`👂 Starting Blockchain Indexer for Mint: ${this.mintAddress.toBase58()}`);

        // Listen to account changes or program logs
        // Using onLogs for generic instruction catch (Transfer, MintTo, Burn)
        this.subscriptionId = this.connection.onLogs(
            this.mintAddress,
            (logs, ctx) => {
                logger.info(`[INDEXER] New Transaction Signature: ${logs.signature}`);
                this.processLogs(logs.signature, logs.logs);
            },
            'confirmed'
        );
    }

    private processLogs(signature: string, logs: string[]) {
        // Basic heuristics to determine the event type based on logs
        const isMint = logs.some(log => log.includes('Instruction: MintTo'));
        const isBurn = logs.some(log => log.includes('Instruction: Burn'));
        const isTransfer = logs.some(log => log.includes('Instruction: Transfer'));
        const isSeize = logs.some(log => log.includes('Instruction: SeizeFunds'));

        if (isSeize) {
            logger.warn(`🚨 SEIZE OPERATION DETECTED: tx ${signature}. Creating Audit Trail...`);
            this.complianceService.logComplianceEvent('SEIZE_FUNDS', signature);
        } else if (isMint) {
            logger.info(`💸 MINT EVENT DETECTED: tx ${signature}. Recording supply increase.`);
        } else if (isBurn) {
            logger.info(`🔥 BURN EVENT DETECTED: tx ${signature}. Recording supply decrease.`);
        } else if (isTransfer) {
            logger.info(`🔄 TRANSFER DETECTED: tx ${signature}. Verifying against Blacklist heuristics (Simulated).`);
            this.complianceService.monitorSuspiciousActivity(signature);
        }
    }

    public stopListening() {
        if (this.subscriptionId) {
            this.connection.removeOnLogsListener(this.subscriptionId);
            logger.info(`🔇 Indexer stopped.`);
        }
    }
}
