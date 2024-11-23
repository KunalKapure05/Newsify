import nodemailer from 'nodemailer';
import { config } from './config';
import logger from './logger';

const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: parseInt(config.smtp_port) ,
    secure: false, 
    auth: {
      user: config.smtp_user,
      pass: config.smtp_password
    },
  });

  const sendEmail = async(toMail:string,subject:string,body:string)=>{
   try {

     const info = await transporter.sendMail({  
         from: config.email_from, // sender address
         to: toMail, // list of receivers
         subject: subject, // Subject line
         text: body, // plain text body
         
       });
       console.log(info);
   } catch (error) {
    console.error("Error sending email:", error); 
    logger.error("Error sending email:", error);
    throw error;
   }
  }

  export {transporter,sendEmail}