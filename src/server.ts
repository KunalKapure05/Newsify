import app from './app';
import {config} from "./config/config";

const startServer=async()=>{
    const port = config.port || 3000;
   

    app.listen(port,()=>{
        console.log(`Listening on Port: ${port}`);
      
        
        
    })

}

startServer();

