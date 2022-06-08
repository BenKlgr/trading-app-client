import express, { Router, Response, Request } from 'express';
import passport from 'passport';
import { discordStrategy } from '../../lib/auth/strategies/discord';
import refresh from 'passport-oauth2-refresh';
import { Ok } from '../../lib/functions/response';
import { User } from '../../lib/db/models/User';
import { Placement } from '../../lib/db/models/Placement';
import { getCompleteUser } from '../../lib/functions/user';

export const authRouter: Router = express.Router();

passport.use(discordStrategy);
refresh.use(discordStrategy);

authRouter.get('/signout', (request: Request, response: Response) => {
  request.logout(() => {
    response.json(Ok('logged_out'));
  });
});
authRouter.get('/signedin', (request: Request, response: Response) => {
  return response.json(Ok(request.isAuthenticated()));
});
authRouter.get('/current', async (request: Request, response: Response) => {
  if (!request.user || !request.isAuthenticated()) {
    return response.json(Ok(null));
  }

  const completeUser = await getCompleteUser(request.user);

  return response.json(Ok(completeUser));
});
