// pending

import { classifyEmail, generateResponse } from "../services/openai";
import { addEmailJob } from "../services/bullMQ";

export const checkAndRespondEmails = async () => {
  // Read Gmail emails
  const gmailEmails = await readGmailEmails();
  for (const email of gmailEmails) {
    if (email) {
      const category = await classifyEmail(email.body);
      const response = await generateResponse(email.body, category as string);
      await sendGmailResponse(email, response as string);
    }
  }

  // Read Outlook emails
  const accessToken = "";
  const outlookEmails = await readOutlookEmails(accessToken);
  for (const email of outlookEmails) {
    const category = await classifyEmail(email.body);
    const response = await generateResponse(email.body, category);
    await sendOutlookResponse(email, response, accessToken);
  }

  // Add jobs to the queue
  addEmailJob({
    emails: [...gmailEmails, ...outlookEmails],
  });
};
