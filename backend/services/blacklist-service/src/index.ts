import dotenv from 'dotenv';
import router from './routes/index';
import express from 'express';


const app = express();


app.use(express.json());

app.use("/api/blacklist", router);



const PORT = process.env.BLACKLIST_SERVICE_PORT || 8017
app.listen(PORT, () => {
    console.log(`Blacklist service running on ${PORT}`)
})