import { Queue, Worker } from "bullmq";
import dotenv from "dotenv";
dotenv.config();

const emailQueue = new Queue("emailQueue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

new Worker("emailQueue", async (job) => {
  console.log(job.data);
});

export const addEmailJob = (data: any) => {
  emailQueue.add("emailJob", data);
};
