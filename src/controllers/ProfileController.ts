import { Request, Response } from "express";
import { AuthRequest } from "../Interfaces/AuthRequest";
import prisma from '../config/db';

const getUser = async function(req: Request, res: Response) {
    try {
      
        const _req = req as unknown as AuthRequest;

    
        console.log("Extracted userId from token:", _req.userId);

    
        const userId = parseInt(_req.userId, 10);

        
        console.log("Parsed userId as number:", userId);

      
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

     
        const user = await prisma.user.findFirst({
            where: {
                id: userId, // Directly compare the id
            }
        });

        
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

   
        return res.json({ user });

    } catch (error) {
       
        console.error("Error occurred in getUser:", error);
        return res.status(500).json({ message: "An unexpected error occurred", error: error });
    }
}

export { getUser };
