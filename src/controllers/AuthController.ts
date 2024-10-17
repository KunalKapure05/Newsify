import prisma from '../config/db';
import { Request, Response } from "express";
import { registerUserSchema,loginUserSchema } from '../Validation/validate';
import { z } from 'zod';
import bcrypt from 'bcrypt'
import {sign} from 'jsonwebtoken'
import {config} from '../config/config'


 const register = async (req: Request, res: Response) => {
    try {
     
      const validatedData = registerUserSchema .parse(req.body); 

      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedData.password,salt)
      validatedData.password = hashedPassword
      const newUser = await prisma.user.create({
        data: validatedData,
      });
  
      const token = sign({ userId: newUser.id }, config.jwt_key , { expiresIn: '72h' });
      
      res.json({
        "newUser":newUser,
        "token":token,
      });

    
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(err => err.message);
            return res.status(400).json({ messages });
      } 

      else if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } 

      else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  };


  const login = async function(req:Request, res:Response) {

    try {
      const validatedData = loginUserSchema.parse(req.body); 

      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (!existingUser) {
        return res.status(400).json({ message: "User Not found, please register first" });
      }

      const validPassword = await bcrypt.compare(validatedData.password, existingUser.password);
      
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid Password" });
      }
      
      const token = sign({ userId: existingUser.id }, config.jwt_key , { expiresIn: '72h' });

      res.cookie('token', token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 ),
        sameSite: 'lax'
        
    });
      
      res.json({
        message: `${existingUser.name} login succesfully`,
        token,
      });


      
    }  catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(err => err.message);
            return res.status(400).json({ messages });
      } 
      
      else if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
      
      else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }

  }
  
export {register,login} 