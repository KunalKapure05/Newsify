import express from 'express';
const app = express();

import apiRoutes from './routes/api'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json("Welcome to homepage!");
})

app.use('/api', apiRoutes);

export default app;