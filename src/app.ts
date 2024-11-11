import express from 'express';
const app = express();
import fileUpload from 'express-fileupload';


import apiRoutes from './routes/api'

app.use(fileUpload()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.json("Welcome to homepage!");
})

app.use('/api', apiRoutes);




export default app;