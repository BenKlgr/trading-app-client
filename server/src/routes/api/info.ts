import express, { Router, Response, Request } from 'express';
import passport from 'passport';
import { discordStrategy } from '../../lib/auth/strategies/discord';
import refresh from 'passport-oauth2-refresh';
import { Failure, Ok } from '../../lib/functions/response';
import { User } from '../../lib/db/models/User';
import { Placement } from '../../lib/db/models/Placement';
import { getCompleteUser } from '../../lib/functions/user';
import { pushNotification } from '../../lib/functions/notifications';
import { connection } from '../../lib/db/connection';
import { Op } from 'sequelize';

export const infoRouter: Router = express.Router();

passport.use(discordStrategy);
refresh.use(discordStrategy);

infoRouter.get('/admins', async (request: Request, response: Response) => {
  const admins = (
    await User.findAll({
      where: {
        admin: true,
      },
      order: [['createdAt', 'ASC']],
    })
  ).map((user) => {
    return {
      name: user.name,
      avatar: user.getAvatar(),
    };
  });

  return response.json(Ok(admins));
});
