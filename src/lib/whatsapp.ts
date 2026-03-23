import { Gaxios } from "gaxios";
import { ENV } from "./environments.ts";
import { Logger } from "borgen";

import crypto from "crypto";

export class WhatsAppClient {
    private readonly baseUrl: string;
    private readonly phoneNumberId: string;
    private readonly accessToken: string;
    private readonly appSecret: string;
    private readonly client: Gaxios;

    constructor() {
        this.baseUrl = ENV.WHATSAPP_API_BASE_URL;
        this.phoneNumberId = ENV.PHONE_NUMBER_ID;
        this.accessToken = ENV.USER_ACCESS_TOKEN;
        this.appSecret = process.env.WHATSAPP_APP_SECRET || "";
        this.client = new Gaxios();
    }

    /**
     * Verify the X-Hub-Signature-256 header from Meta
     */
    verifySignature(payload: string, signature: string): boolean {
        if (!this.appSecret || !signature) return true; // Skip if secret not configured

        const hmac = crypto.createHmac("sha256", this.appSecret);
        const digest = Buffer.from("sha256=" + hmac.update(payload).digest("hex"), "utf8");
        const signatureBuffer = Buffer.from(signature, "utf8");

        return crypto.timingSafeEqual(digest, signatureBuffer);
    }

    /**
     * Send a text message via WhatsApp Cloud API
     */
    async sendMessage(to: string, message: string): Promise<any> {
        try {
            const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;

            const response = await this.client.request({
                url,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json",
                },
                data: {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to,
                    type: "text",
                    text: {
                        preview_url: false,
                        body: message,
                    },
                },
            });

            Logger.info({ message: `WhatsApp message sent to ${to}` });
            return response.data;
        } catch (error: any) {
            Logger.error({ message: `Failed to send WhatsApp message: ${error.message}` });
            throw error;
        }
    }

    /**
     * Send interactive reply buttons (max 3)
     */
    async sendReplyButtons(to: string, text: string, buttons: { id: string; title: string }[]): Promise<any> {
        try {
            const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;

            const response = await this.client.request({
                url,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json",
                },
                data: {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to,
                    type: "interactive",
                    interactive: {
                        type: "button",
                        body: { text },
                        action: {
                            buttons: buttons.map(b => ({
                                type: "reply",
                                reply: { id: b.id, title: b.title }
                            }))
                        }
                    },
                },
            });

            Logger.info({ message: `Reply buttons sent to ${to}` });
            return response.data;
        } catch (error: any) {
            Logger.error({ message: `Failed to send reply buttons: ${error.message}` });
            throw error;
        }
    }

    /**
     * Send interactive list message (max 10 rows)
     */
    async sendListMessage(to: string, text: string, buttonText: string, sections: { title: string; rows: { id: string; title: string; description?: string }[] }[]): Promise<any> {
        try {
            const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;

            const response = await this.client.request({
                url,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json",
                },
                data: {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to,
                    type: "interactive",
                    interactive: {
                        type: "list",
                        body: { text },
                        action: {
                            button: buttonText,
                            sections: sections.map(s => ({
                                title: s.title,
                                rows: s.rows.map(r => ({
                                    id: r.id,
                                    title: r.title,
                                    description: r.description
                                }))
                            }))
                        }
                    },
                },
            });

            Logger.info({ message: `List message sent to ${to}` });
            return response.data;
        } catch (error: any) {
            Logger.error({ message: `Failed to send list message: ${error.message}` });
            throw error;
        }
    }
}

export const whatsappClient = new WhatsAppClient();
