import express, { Router } from 'express';
import passport from 'passport';
import { discordStrategy } from '../../lib/auth/strategies/discord';
import refresh from 'passport-oauth2-refresh';

export const discordAuthRouter: Router = express.Router();

passport.use(discordStrategy);
refresh.use(discordStrategy);

discordAuthRouter.get('/', passport.authenticate('discord'));
discordAuthRouter.get(
  '/callback',
  passport.authenticate('discord', { failureRedirect: '/', successRedirect: '/' })
);
