import { Router } from 'express';
import { adminRouter } from './api/admin';
import { authRouter } from './api/auth';
import { discordAuthRouter } from './api/discord';
import { infoRouter } from './api/info';
import { notificationsRouter } from './api/notifications';
import { placementsRouter } from './api/placements';
import { clientRouter } from './client';

export type RouterConfig = {
  routers: {
    baseUrl: string;
    router: Router;
  }[];
};
export const routerConfig: RouterConfig = {
  routers: [
    {
      baseUrl: '/api/auth/discord',
      router: discordAuthRouter,
    },
    {
      baseUrl: '/api/auth',
      router: authRouter,
    },
    {
      baseUrl: '/api/user/notifications',
      router: notificationsRouter,
    },
    {
      baseUrl: '/api/admin',
      router: adminRouter,
    },
    {
      baseUrl: '/api/placements',
      router: placementsRouter,
    },
    {
      baseUrl: '/api/info',
      router: infoRouter,
    },
    {
      baseUrl: '/',
      router: clientRouter,
    },
  ],
};
