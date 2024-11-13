import { config } from "../config/config";
import { supportedMimes } from "../config/fileSystem";
import fs from 'fs'



const imageValidator = (size: number, mime: string) => {
    if(bytesToMb(size)>5) return "Image size must be less than 5 mb.";

    else if(!supportedMimes.includes(mime)) return "Image must be type of png,jpeg,jpg,gif,svg... "

    return null
  
};

const bytesToMb = (bytes: number): number => {
    return (bytes / 1024 / 1024);
};

const generateRandomNumber = ()=>{
     return Math.floor(Math.random() * 1000000).toString();
}

const getImageUrl = (imgName: string) => {
    return `${config.app_url}/images/${imgName}`;
};

const removeImage = (imgName: string) => {
    const path = process.cwd() + "/public/images/" + imgName;
    if(fs.existsSync(path)) {
        fs.unlinkSync(path);

    }
}

export { imageValidator, bytesToMb,generateRandomNumber,getImageUrl,removeImage };
