import {config as confi} from 'dotenv'

confi();

const _config =  {
    port:process.env.PORT as string,
    jwt_key:process.env.JWT_KEY as string,
    app_url:process.env.APP_URL as string
}

export const config = Object.freeze(_config);
