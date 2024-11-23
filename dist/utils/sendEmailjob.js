"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.emailQueue = void 0;
const bullmq_1 = require("bullmq");
const queue_1 = require("../config/queue");
const logger_1 = __importDefault(require("../config/logger"));
const mailer_1 = require("../config/mailer");
//Queues
const emailQueue = new bullmq_1.Queue("email-queue", {
    connection: queue_1.redisConnection,
    defaultJobOptions: queue_1.defaultQueueConfig
});
exports.emailQueue = emailQueue;
//Workers
const handler = new bullmq_1.Worker("email-queue", async (job) => {
    console.log("the email worker data is: ", job.data);
    const data = job.data;
    data?.map(async (item) => {
        await (0, mailer_1.sendEmail)(item.toMail, item.subject, item.body);
    });
}, { connection: queue_1.redisConnection });
exports.handler = handler;
//Worker listeners
handler.on("completed", (job) => {
    logger_1.default.info({ job: job, message: "Job completed" });
    console.log(`Completed job ${job.id}`);
});
handler.on("failed", (job, error) => {
    if (!job) {
        console.error("Job is undefined");
        return;
    }
    console.log(`Failed job ${job.id}: ${error.message}`);
});
