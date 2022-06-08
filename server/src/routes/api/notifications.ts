import express, { Router, Response, Request } from 'express';
import passport from 'passport';
import { discordStrategy } from '../../lib/auth/strategies/discord';
import refresh from 'passport-oauth2-refresh';
import { Failure, Ok } from '../../lib/functions/response';
import { User } from '../../lib/db/models/User';
import { Placement } from '../../lib/db/models/Placement';
import { getCompleteUser } from '../../lib/functions/user';
import { pushNotification } from '../../lib/functions/notifications';
import { Notification } from '../../lib/db/models/Notification';

export const notificationsRouter: Router = express.Router();

passport.use(discordStrategy);
refresh.use(discordStrategy);

notificationsRouter.get('/', async (request: Request, response: Response) => {
  if (!request.user || !request.isAuthenticated()) {
    return response.json(Failure('unauthorized'));
  }

  const completeUser = await getCompleteUser(request.user);

  return response.json(
    Ok(
      completeUser.notifications.sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0
      )
    )
  );
});

notificationsRouter.get('/read', async (request: Request, response: Response) => {
  if (!request.user || !request.isAuthenticated()) {
    return response.json(Failure('unauthorized'));
  }

  const completeUser = await getCompleteUser(request.user);

  const notifications = await Notification.findAll({
    where: {
      userId: completeUser.id,
      read: false,
    },
  });

  notifications.forEach((notification) => notification.update({ read: true }));

  return response.json(Ok('updated'));
});
