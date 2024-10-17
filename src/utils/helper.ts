import { supportedMimes } from "../config/fileSystem";



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

export { imageValidator, bytesToMb,generateRandomNumber };
