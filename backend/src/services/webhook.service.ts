import axios from 'axios';
import { logger } from '../utils/logger';

export class WebhookService {
    private webhookUrl: string | undefined;

    constructor() {
        this.webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
    }

    public async sendAlert(title: string, message: string, retries = 3) {
        if (!this.webhookUrl) {
            logger.warn('⚠️ Webhook URL not configured in .env. Skipping notification.');
            return;
        }

        const payload = {
            content: `**${title}**\n${message}`,
        };

        logger.info(`🌐 Sending Webhook Alert: ${title}`);

        try {
            await axios.post(this.webhookUrl, payload, { timeout: 5000 });
            logger.info('✅ Webhook sent successfully.');
        } catch (error: any) {
            logger.error(`❌ Webhook failed: ${error.message}`);
            if (retries > 0) {
                logger.info(`🔄 Retrying webhook. Attempts left: ${retries - 1}`);
                setTimeout(() => this.sendAlert(title, message, retries - 1), 2000);
            } else {
                logger.error('🚨 Max webhook retries reached.');
            }
        }
    }
}
