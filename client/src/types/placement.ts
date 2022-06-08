import { User } from './user';

export type Placement = {
  id: string;
  userId: string;
  type: 'sell' | 'buy';
  stock: number;
  quantity: number;
  item: string;
  itemCompressed: boolean;
  price: number;
  unit: string;
  unitCompressed: boolean;
  location: string;
  description: string;
  promoted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    discriminator: string;
    avatar: string;
  };
};
