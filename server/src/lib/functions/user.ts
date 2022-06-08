import { Notification } from '../db/models/Notification';
import { Placement } from '../db/models/Placement';
import { User } from '../db/models/User';

export type CompleteUser = {
  id: string;
  name: string;
  avatar: string;
  admin: boolean;
  premium: boolean;
  discriminator: string;
  placements: Placement[];
  notifications: Notification[];
};
export const getCompleteUser = async (user: Express.User): Promise<CompleteUser> => {
  const currentUser = user[0];

  const completeUser = await User.findOne({
    where: { id: currentUser.id },
    include: [Placement, Notification],
  });

  return {
    id: completeUser.id,
    name: completeUser.name,
    avatar: completeUser.getAvatar(),
    admin: completeUser.admin,
    premium: completeUser.premium,
    discriminator: completeUser.discriminator,
    placements: completeUser.placements,
    notifications: completeUser.notifications,
  };
};
