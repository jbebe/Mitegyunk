import cookieParser from 'cookie-parser';
import express from 'express';
import { Request, Response } from 'express';
import logger from 'morgan';
import BaseRouter from './routes';
import cors from 'cors';
import {NextFunction} from 'express-serve-static-core';

// Init express
const app = express();

// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api', BaseRouter);
app.get('*', (req: Request, res: Response) => {
    res.sendStatus(404);
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send('Something broke!');
});

// Init CORS
app.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send('ok');
});
app.use((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
});

// Export express instance
export default app;
