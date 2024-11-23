import { Queue,Worker } from "bullmq";

import { defaultQueueConfig, redisConnection } from "../config/queue";
import logger from "../config/logger";
import { sendEmail } from "../config/mailer";


//Queues
const emailQueue = new Queue("email-queue",{
    connection:redisConnection,
    defaultJobOptions:defaultQueueConfig
},
)

//Workers
const handler = new Worker("email-queue",
async(job)=>{
    console.log("the email worker data is: ",job.data);
    const data = job.data;
    data?.map(async(item: { toMail: string; subject: string; body: string; })=>{
        await sendEmail(item.toMail,item.subject,item.body)
    })

},
{connection:redisConnection});


//Worker listeners
handler.on("completed", (job) => {
    logger.info({job:job, message:"Job completed"})
    console.log(`Completed job ${job.id}`);
});

handler.on("failed", (job, error) => {
    if (!job) {
      console.error("Job is undefined");
      return;
    }
    console.log(`Failed job ${job.id}: ${error.message}`);
  });

export {emailQueue, handler};

