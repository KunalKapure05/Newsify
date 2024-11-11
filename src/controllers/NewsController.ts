/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import prisma from '../config/db';
import { Request, Response } from "express";
import {newsSchema} from '../Validation/newsValidate';
import { AuthRequest } from '../Interfaces/AuthRequest';
import { generateRandomNumber, imageValidator } from '../utils/helper';
import { UploadedFile } from 'express-fileupload';
import transformNewsAPi from '../utils/NewsApiTransform';



const createNews = async function(req: Request, res: Response) {
  try {
   
    const validatedData = newsSchema.parse(req.body);
   

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Image field required" });
    }

    const image = req.files?.image;
    
    if (!image) {
      return res.status(400).json({ message: "No image file provided" });
    }

    
    const file: UploadedFile = Array.isArray(image) ? image[0] : image;


    const message = imageValidator(file.size, file.mimetype);
    if (message !== null) {
      return res.status(400).json({ message });
    }

    // Image Upload
    const imgExt = file?.name.split('.');
    const imageName = generateRandomNumber()+"."+imgExt[1]; // Generate a valid image name
    const ImagefilePath = process.cwd() + '/public/images/' + imageName;
    
    // Move the file to the target location
    await file.mv(ImagefilePath);

    const _req = req as unknown as AuthRequest;
    const userId = Number(_req.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
  }

  const user = await prisma.user.findFirst({
    where: {
        id: userId
    }
});

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const name =  user.name;



  const news = await prisma.news.create({
    data: {
      ...validatedData,
      image: imageName,
      user_id: userId,
      name:name   
    
    }
  });


    return res.status(200).json({ news
    });

  } catch (error) {
   
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

   
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

  
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

const getNews = async function(req:Request,res:Response){
  try {
    const news = await prisma.news.findMany({
      include:{
        user:{
          select:{
            id:true,
            name:true,
            profile:true
            
          }
        }
      }

    });
    const newsTransform = await Promise.all(news.map(item => transformNewsAPi(item)));
    return res.status(200).json({ news: newsTransform});
     
}
catch(error){
  return res.status(500).json({message: "An unexpected error occurred"});
}
}



export {createNews,getNews};
