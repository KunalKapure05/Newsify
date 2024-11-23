import { z } from 'zod';

export const emailSchema = z.object({
    toMail:z.string().email("Invalid email address"),
    subject: z.string().min(1,"Subject cannot be empty"),
    body: z.string().min(1,"Body cannot be empty"),

})

export type emailScehma = z.infer<typeof emailSchema>



