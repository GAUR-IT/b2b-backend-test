import { QUOTE_MODULE } from "./src/modules/quote";
import { APPROVAL_MODULE } from "./src/modules/approval";
import { COMPANY_MODULE } from "./src/modules/company";
import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils";
import { TERMS_MODULE } from "src/modules/terms";

loadEnv(process.env.NODE_ENV!, process.cwd());

module.exports = defineConfig({
    admin: {
        disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
        backendUrl: process.env.MEDUSA_BACKEND_URL,
    },
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
        redisUrl: process.env.REDIS_URL,
        http: {
            storeCors: process.env.STORE_CORS!,
            adminCors: process.env.ADMIN_CORS!,
            authCors: process.env.AUTH_CORS!,
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret",
        },
    },
    modules: {
        [COMPANY_MODULE]: {
            resolve: "./modules/company",
        },
        [QUOTE_MODULE]: {
            resolve: "./modules/quote",
        },
        [APPROVAL_MODULE]: {
            resolve: "./modules/approval",
        },
        [TERMS_MODULE]: {
            resolve: "./modules/terms",
        },
        [Modules.CACHE]: {
            resolve: "@medusajs/medusa/cache-redis",
            options: {
                redisUrl: process.env.REDIS_URL,
            },
        },
        [Modules.EVENT_BUS]: {
            resolve: "@medusajs/medusa/event-bus-redis",
            options: {
                redisUrl: process.env.REDIS_URL,
            },
        },
        [Modules.WORKFLOW_ENGINE]: {
            resolve: "@medusajs/medusa/workflow-engine-redis",
            options: {
                redis: {
                    url: process.env.REDIS_URL,
                },
            },
        },
        [Modules.PAYMENT]: {
            resolve: "@medusajs/medusa/payment",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/medusa/payment-stripe",
                        id: "stripe",
                        options: {
                            apiKey: process.env.STRIPE_API_KEY,
                            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
                        },
                    },
                ],
            },
        },
        [Modules.FILE]: {
            resolve: "@medusajs/medusa/file",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/medusa/file-s3",
                        options: {
                            file_url: process.env.S3_FILE_URL,
                            access_key_id: process.env.S3_ACCESS_KEY_ID,
                            secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                            region: process.env.S3_REGION,
                            bucket: process.env.S3_BUCKET,
                            endpoint: process.env.S3_ENDPOINT,
                            additional_client_config: {
                                forcePathStyle: true,
                            },
                        }
                    }
                ]
            }
        },
        [Modules.NOTIFICATION]: {
            resolve: "@medusajs/medusa/notification",
            options: {
                providers: [{
                    resolve: "@medusajs/medusa/notification-sendgrid",
                    id: "sendgrid",
                    options: {
                        channels: ["email"],
                        api_key: process.env.SENDGRID_API_KEY,
                        from: process.env.SENDGRID_FROM,
                    },
                }],
            },
        },
    },
});
