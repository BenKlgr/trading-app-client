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

export const adminRouter: Router = express.Router();

passport.use(discordStrategy);
refresh.use(discordStrategy);

adminRouter.use(async (request: Request, response: Response, next: Function) => {
  if (!request.user || !request.isAuthenticated()) {
    return response.json(Failure('unauthorized'));
  }

  const completeUser = await getCompleteUser(request.user);

  if (!completeUser.admin) {
    return response.json(Failure('unauthorized'));
  }

  next();
});

adminRouter.get('/users', async (request: Request, response: Response) => {
  const users = (
    await User.findAll({
      include: [Placement],
    })
  ).map((user) => {
    return {
      ...user.toJSON(),
      name: user.name + '#' + user.discriminator,
      avatar: user.getAvatar(),
    };
  });

  return response.json(Ok(users));
});

adminRouter.post('/user/:userId/delete', async (request: Request, response: Response) => {
  const { userId } = request.params;

  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    return response.json(Failure('user_not_found'));
  }

  await user.destroy();

  const sessions = await connection.models['Session'].findAll({
    where: {
      data: {
        [Op.like]: `%${userId}%`,
      },
    },
  });

  for (const session of sessions) {
    await session.destroy();
  }

  return response.json(Ok('deleted'));
});

adminRouter.post('/user/:userId/admin', async (request: Request, response: Response) => {
  const { userId } = request.params;

  const user = await User.findOne({ where: { id: userId } });
  const newState = !user.admin;

  pushNotification(
    user,
    newState ? 'You are now an admin' : 'You are no longer an admin',
    newState ? 'success' : 'warning'
  );

  if (!user) {
    return response.json(Failure('user_not_found'));
  }

  await user.update({ admin: newState });

  return response.json(Ok('updated'));
});

adminRouter.post(
  '/user/:userId/premium',
  async (request: Request, response: Response) => {
    const { userId } = request.params;

    const user = await User.findOne({ where: { id: userId } });
    const newState = !user.premium;

    pushNotification(
      user,
      newState ? 'You received the premium status' : 'Your premium status got removed',
      newState ? 'success' : 'warning'
    );

    if (!user) {
      return response.json(Failure('user_not_found'));
    }

    await user.update({ premium: newState });

    return response.json(Ok('updated'));
  }
);
