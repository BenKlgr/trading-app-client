import express, { Request, Response, Router } from 'express';
import { Ok } from '../lib/functions/response';

export const CHANGENAME: Router = express.Router();

CHANGENAME.get('url', (request: Request, response: Response) => {
  response.send(Ok('Client Hallo!'));
});
