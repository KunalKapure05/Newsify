import {config as confi} from 'dotenv'

confi();

const _config =  {
    port:process.env.PORT as string,
    jwt_key:process.env.JWT_KEY as string,
    app_url:process.env.APP_URL as string,
    smtp_port :process.env.SMTP_PORT as string,
    smtp_host : process.env.SMTP_HOST as string,
    smtp_user: process.env.SMTP_USER as string,
    smtp_password : process.env.SMTP_PASSWORD as string,
    email_from : process.env.EMAIL_FROM as string,
    host : process.env.REDIS_HOST as string,
    Port : parseInt(process.env.REDIS_PORT as string),
   

    
}

export const config = Object.freeze(_config);
