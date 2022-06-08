import { config } from 'dotenv';
import express, { Request, Response, Router } from 'express';
import proxy from 'express-http-proxy';
import path from 'path';
import { Failure } from '../lib/functions/response';

export const clientRouter: Router = express.Router();

config();
const { SERVE_REACT_CLIENT } = process.env;

if (SERVE_REACT_CLIENT == 'true') {
  clientRouter.use(proxy('http://localhost:3000', { timeout: 1000 }));
} else {
  clientRouter.use(express.static('public'));
  clientRouter.get('*', (request: Request, response: Response) => {
    response.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}
