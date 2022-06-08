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
import { ITEM_DATA } from '../../lib/data/items';

export const placementsRouter: Router = express.Router();

passport.use(discordStrategy);
refresh.use(discordStrategy);

placementsRouter.get('/all', async (request: Request, response: Response) => {
  const placements = (
    await Placement.findAll({
      include: [User],
    })
  ).map((placement) => {
    return {
      ...placement.toJSON(),
      user: {
        id: placement.user.id,
        name: placement.user.name,
        discriminator: placement.user.discriminator,
        avatar: placement.user.getAvatar(),
      },
    } as Placement;
  });

  return response.json(Ok(placements));
});

placementsRouter.post(
  '/update/:placementId',
  async (request: Request, response: Response) => {
    if (!request.user || !request.isAuthenticated()) {
      return response.json(Failure('unauthorized'));
    }

    const completeUser = await getCompleteUser(request.user);

    const { placementId } = request.params;

    const { stock, promoted } = request.body;

    if (!(parseInt(stock) && stock > 0 && stock < 1000000))
      return response.status(200).send(Failure('invalid_stock'));

    const placement = await Placement.findOne({ where: { id: placementId } });

    if (placement.userId != completeUser.id) {
      return response.json(Failure('unauthorized'));
    }
    const promotedUserPlacements = completeUser.placements.filter(
      (placement) => placement.promoted
    );

    if (completeUser.premium && promoted && promotedUserPlacements.length >= 2) {
      return response.status(200).send(Failure('invalid_promoted'));
    }

    await placement.update({ stock, promoted });

    return response.json(Ok('updated'));
  }
);

placementsRouter.post(
  '/delete/:placementId',
  async (request: Request, response: Response) => {
    if (!request.user || !request.isAuthenticated()) {
      return response.json(Failure('unauthorized'));
    }

    const completeUser = await getCompleteUser(request.user);

    const { placementId } = request.params;

    const placement = await Placement.findOne({ where: { id: placementId } });

    if (placement.userId != completeUser.id) {
      return response.json(Failure('unauthorized'));
    }

    await placement.destroy();

    return response.json(Ok('deleted'));
  }
);

placementsRouter.post('/new', async (request: Request, response: Response) => {
  if (!request.user || !request.isAuthenticated()) {
    return response.json(Failure('unauthorized'));
  }

  const completeUser = await getCompleteUser(request.user);

  const {
    type,
    item,
    quantity,
    unit,
    price,
    location,
    description,
    stock,
    itemCompressed,
    unitCompressed,
    promoted,
  } = request.body;

  const promotedUserPlacements = completeUser.placements.filter(
    (placement) => placement.promoted
  );

  if (!completeUser.premium && completeUser.placements.length >= 2) {
    return response.status(200).send(Failure('invalid_placements_amount'));
  }
  if (!completeUser.premium && promoted) {
    return response.status(200).send(Failure('invalid_promoted'));
  }
  if (completeUser.premium && promoted && promotedUserPlacements.length >= 2) {
    return response.status(200).send(Failure('invalid_promoted'));
  }

  if (type != 'buy' && type != 'sell') {
    return response.status(200).send(Failure('invalid_type'));
  }

  if (ITEM_DATA.find((p) => p.name == item) == null)
    return response.status(200).send(Failure('invalid_item'));
  if (ITEM_DATA.find((p) => p.name == unit) == null)
    return response.status(200).send(Failure('invalid_unit'));

  if (!(parseInt(quantity) && quantity > 0 && quantity < 1000000))
    return response.status(200).send(Failure('invalid_quantity'));
  if (!(parseInt(price) && price > 0 && price < 1000000))
    return response.status(200).send(Failure('invalid_price'));
  if (!(parseInt(stock) && stock >= 0 && stock < 1000000))
    return response.status(200).send(Failure('invalid_stock'));

  const newPlacement = await Placement.create({
    type,
    item,
    quantity,
    unit,
    price,
    location,
    description,
    stock,
    unitcompressed: unitCompressed,
    itemcompressed: itemCompressed,
    promoted,
    userId: completeUser.id,
  });

  return response.status(200).json(Ok(newPlacement.toJSON()));
});
