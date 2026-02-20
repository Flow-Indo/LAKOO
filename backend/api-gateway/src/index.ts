import express, {type Request, type Response}  from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import { router } from '@src/routes/index.js'

dotenv.config();


const app = express();
const PORT = process.env.API_GATEWAY_PORT;

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use("/api", router);



app.listen(PORT, () => {
    console.log(`API GATEWAY LISTENING TO PORT ${PORT}`);
})
