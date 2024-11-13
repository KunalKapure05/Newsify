/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import prisma from '../config/db';
import { Request, Response } from "express";
import {newsSchema} from '../Validation/newsValidate';
import { AuthRequest } from '../Interfaces/AuthRequest';
import { generateRandomNumber, imageValidator, removeImage } from '../utils/helper';
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

const getAllNews = async function(req:Request,res:Response){
  try {
   let page = Number(req.query.page) || 1; 
    if(page<=0) page = 1; 

    let limit = Number(req.query.limit ) || 1;
    if(limit<=0 || limit >100) limit = 10;

    const skip = (page - 1) * limit;

    const news = await prisma.news.findMany({
      take:limit,
      skip: skip,
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
    const totalNews = await prisma.news.count();
    const totalPages = Math.ceil(totalNews / limit);
    
    return res.status(200).json({ 
      news: newsTransform,
      metadata:{
        totalPages:totalPages,
        currentPage:page,
        limit:limit,
      }
    });
     
}
catch(error){
  return res.status(500).json({message: "An unexpected error occurred"});
}
}

const showNews = async function(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const news = await prisma.news.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
    });

  

    const newsTransform =  news ?  await transformNewsAPi(news):null;
    return res.status(200).json({ news: newsTransform });
    
  } catch (error) {
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
}

const updateNews = async function(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const validatedData = newsSchema.parse(req.body);

    const _req = req as unknown as AuthRequest;
    console.log("Extracted userId from token:", _req.userId);
    const userId = Number(_req.userId);

    const news = await prisma.news.findUnique({
      where: {
        id: Number(id),
      }
    });

    if (userId !== news?.user_id) {
      return res.status(403).json({ message: "Unauthorized to update this news" });
    }

    const image = req?.files?.image;
    if (image) {
      // Check if `image` is an array
      const singleImage = Array.isArray(image) ? image[0] : image;

      // Validate the image file
      const message = imageValidator(singleImage.size, singleImage.mimetype);
      if (message !== null) {
        return res.status(400).json({
          errors: {
            image: message
          }
        });
      }

         // Upload new image
         const imgExt = singleImage.name.split('.');
         const imageName = generateRandomNumber() + "." + imgExt[imgExt.length - 1]; // Generate a valid image name
         const imageFilePath = process.cwd() + '/public/images/' + imageName;
         
         // Move the file to the target location
         await singleImage.mv(imageFilePath);


      //Delete old image
      removeImage(news.image)  

      const updatedNews = await prisma.news.update({
        where: { id: Number(id) },
        data: {
          ...validatedData,
          image: imageName, 
        },
      });
  
      return res.status(200).json({ message: "News updated successfully", news: updatedNews });
  
    }

   

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

const deleteNews = async function(req:Request, res:Response){
  try {
    const {id} = req.params;
    const _req = req as unknown as AuthRequest;
    console.log("Extracted userId from token:", _req.userId);
    const userId = Number(_req.userId);

    const news = await prisma.news.findUnique({
      where: {
        id: Number(id),
      }
    });

    if(userId!==news?.user_id){
      return res.status(403).json({message: "Unauthorized to delete this news"});

    }

    //Delete image from fileSystem
    removeImage(news.image);
    const response = await prisma.news.delete({
      where:{
        id:Number(id)
      }
    })
    return res.status(200).json({message: "News deleted successfully", news: response});



}catch(error){
  return res.status(500).json({message: "An unexpected error occurred"});
}
}




export {createNews,getAllNews,showNews,updateNews,deleteNews};
