import express from 'express';
const app = express();
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import cors from 'cors';
import limiter from './config/rateLimiter';
import apiRoutes from './routes/api'

app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(fileUpload()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.json("Welcome to homepage!");
})

app.use('/api', apiRoutes);




export default app;