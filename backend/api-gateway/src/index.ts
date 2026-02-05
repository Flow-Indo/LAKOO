import express, {type Request, type Response}  from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import { router } from '@src/routes/index.js'

dotenv.config();


const app = express();
const PORT = process.env.API_GATEWAY_PORT || "3000";

const logRequests = String(process.env.GATEWAY_LOG_REQUESTS || 'false').toLowerCase() === 'true';
if (logRequests) {
    app.use((req: Request, res: Response, next) => {
        const startedAt = Date.now();
        res.on('finish', () => {
            const elapsedMs = Date.now() - startedAt;
            console.log(`[api-gateway] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsedMs}ms)`);
        });
        res.on('close', () => {
            if (res.writableEnded) return;
            const elapsedMs = Date.now() - startedAt;
            console.warn(`[api-gateway] ${req.method} ${req.originalUrl} closed (${elapsedMs}ms)`);
        });
        next();
    });
}

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use("/api", router);



app.listen(PORT, () => {
    console.log(`API GATEWAY LISTENING TO PORT ${PORT}`);
})
