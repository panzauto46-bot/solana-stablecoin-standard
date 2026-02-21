import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Connection } from '@solana/web3.js';
import { logger } from './utils/logger';

// Load env vars
dotenv.config();

// Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8899';
const MINT_ADDRESS = process.env.MINT_ADDRESS || 'LocalMockMint1111111111111111111111111111';

const connection = new Connection(RPC_URL, 'confirmed');

// Services imports (these will be instantiated as the app boots)
import { IndexerService } from './services/indexer.service';
import { MintBurnService } from './services/mint-burn.service';
import { ComplianceService } from './services/compliance.service';
import { WebhookService } from './services/webhook.service';

const webhookService = new WebhookService();
const complianceService = new ComplianceService(webhookService);
const indexerService = new IndexerService(connection, MINT_ADDRESS, complianceService);
const mintBurnService = new MintBurnService(connection);

// --- API ROUTES ---

// 1. Health Checks
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'SSS Watchtower Backend is Healthy! 🟢' });
});

// 2. Mint/Burn Coordination API
app.post('/api/mint', async (req, res) => {
    const { amount, destination } = req.body;
    try {
        const result = await mintBurnService.requestMint(amount, destination);
        res.json(result);
    } catch (error: any) {
        logger.error(`Mint error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/burn', async (req, res) => {
    const { amount, source } = req.body;
    try {
        const result = await mintBurnService.requestBurn(amount, source);
        res.json(result);
    } catch (error: any) {
        logger.error(`Burn error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// 3. Compliance API
app.post('/api/compliance/blacklist', async (req, res) => {
    const { address, reason } = req.body;
    try {
        const result = await complianceService.addToBlacklist(address, reason);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// --- STARTUP ---
app.listen(PORT, () => {
    logger.info(`🛡️  SSS Watchtower Backend running on port ${PORT}`);
    logger.info(`🔌 Connected to Solana RPC: ${RPC_URL}`);

    // Start Blockchain Indexer Background Task
    indexerService.startListening();
});
