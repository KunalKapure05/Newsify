import prisma from '../config/db';
import { Request, Response } from "express";
import { userSchema } from '../Validation/validate';
import { z } from 'zod';
import bcrypt from 'bcrypt'

 const register = async (req: Request, res: Response) => {
    try {
     
      const validatedData = userSchema.parse(req.body); 
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedData.password,salt)
      validatedData.password = hashedPassword
      const newUser = await prisma.user.create({
        data: validatedData,
      });
  
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
       
        res.status(400).json({ message: error.errors });
      } else if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  };

  
export {register}