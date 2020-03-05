import cookieParser from 'cookie-parser';
import express from 'express';
import { Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes';
import cors from 'cors';

// Init express
const app = express();

// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api', BaseRouter);

/**
 * Point express to the 'views' directory. If you're using a
 * single-page-application framework like react or angular
 * which has its own development server, you might want to
 * configure this to only serve the index file while in
 * production mode.
 */
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
app.get('*', (req: Request, res: Response) => {
    res.sendStatus(404);
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
