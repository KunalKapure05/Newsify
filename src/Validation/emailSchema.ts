import { z } from 'zod';

export const emailSchema = z.array(
    z.object({
      toMail: z.string().email({ message: "Invalid email address" }),
      subject: z.string().min(1, { message: "Subject is required" }),
      body: z.string().min(1, { message: "Body is required" }),
    })
  );

export type emailScehma = z.infer<typeof emailSchema>



