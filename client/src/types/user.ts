import { Notification } from './notification';
import { Placement } from './placement';

export type User = {
  id: string;
  name: string;
  avatar: string;

  admin: boolean;
  premium: boolean;

  placements: Placement[];
  notifications: Notification[];
};
