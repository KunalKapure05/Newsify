
import { z } from 'zod';


export const registerUserSchema = z.object({

    name: z.string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(191, { message: "Name cannot exceed 191 characters." }),
    
    email: z.string()
      .email({ message: "Invalid email format." }) // Custom email error message
      .max(191, { message: "Email cannot exceed 191 characters." }),
   
    password: z.string()
      .min(5, { message: "Password must be at least 8 characters long." }),
   
    profile: z.string().optional(),
  });
  
  export const loginUserSchema = z.object({
    email: z.string()
     .email({ message: "Invalid email format." }) // Custom email error message
     .max(191, { message: "Email cannot exceed 191 characters." }),
     password: z.string()
  })


export type UserSchema = z.infer<typeof registerUserSchema>;

export type LoginUserSchema = z.infer<typeof loginUserSchema>;
