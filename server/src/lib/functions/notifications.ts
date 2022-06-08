import { Notification } from '../db/models/Notification';
import { User } from '../db/models/User';
import { CompleteUser } from './user';

export async function pushNotification(
  user: User | CompleteUser,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning'
) {
  const notification = await Notification.create({
    message,
    type,
    userId: user.id,
    read: false,
  });

  return notification;
}
