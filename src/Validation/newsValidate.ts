import { z } from 'zod';

export const newsSchema = z.object({

    title:z.string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(191, { message: "Name cannot exceed 191 characters." }),

    content: z.string().min(5, { message: "Content must be at least 5 characters long." }),

    image: z.string().optional(),
    user_id: z.number().optional(),
    name: z.string().optional()


})

export type NewsScehma = z.infer<typeof newsSchema>


