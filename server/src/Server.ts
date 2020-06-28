import cookieParser from 'cookie-parser';
import express from 'express';
import { Request, Response } from 'express';
import { createServer, IncomingMessage } from 'http';
import * as WebSocket from 'ws';
import logger from 'morgan';
import BaseRouter from './routes';
import cors from 'cors';
import {NextFunction} from 'express-serve-static-core';

// Init express
const app = express();
const server = createServer(app);

// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
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

const wss = new WebSocket.Server({ server, path: '/vote' });

wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
        try {
            const msgObj = JSON.parse(message);
            
            const otherClients = [...wss.clients].filter(c => c != ws);
            
            otherClients.forEach((client) => {
                const replyObj = {
                    text: msgObj.text
                };
                const reply = JSON.stringify(replyObj);
                client.send(reply);
            });
        } catch (ex) {
        }
    });
});

// Export express instance
export default server;
