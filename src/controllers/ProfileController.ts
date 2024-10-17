import { Request, Response } from "express";
import { AuthRequest } from "../Interfaces/AuthRequest";
import prisma from '../config/db';
import { generateRandomNumber, imageValidator } from "../utils/helper";
import path from "path";
import { UploadedFile } from "express-fileupload";



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


const updateUserProfile = async function(req: Request, res: Response) { 
    try {
        console.log("Request received:", req); // Log the entire request object
        console.log("Files received:", req.files); // Log the received files

        // Extract 'id' from URL parameters
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "Profile image is required" });
        }

        const profile = req.files.profile;

        // Check if profile is an array or a single UploadedFile
        const file: UploadedFile = Array.isArray(profile) ? profile[0] : profile;

        // Log the file details
        console.log("Profile file details:", file);

        const message = imageValidator(file.size, file.mimetype);
        if (message !== null) {
            return res.status(400).json({
                errors: {
                    profile: message,
                },
            });
        }

        const imgExt = file?.name.split('.');
        const imageName = `${generateRandomNumber()}.${imgExt[imgExt.length - 1]}`; // Generate a valid image name
        const ImagefilePath = path.resolve(__dirname, '../../public/images', imageName);

        // Move the file to the target location
        await file.mv(ImagefilePath);
        
        // Update user profile in the database
        const updatedData = await prisma.user.update({
            where: {
                id: parseInt(id, 10), // Ensure id is parsed to an integer from req.params
            },
            data: {
                profile: imageName,
            },
        });

        return res.status(200).json({
            updatedData,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Error occurred in updateUserProfile:", error);
        return res.status(500).json({ message: "An unexpected error occurred", error: error });
    }
};

export { getUser,updateUserProfile };
