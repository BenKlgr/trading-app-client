import { config } from 'dotenv';
import { Profile, Strategy } from 'passport-discord';
import { User } from '../../db/models/User';

config();
const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, SERVER_URL, SERVER_HTTPS } =
  process.env;

export const discordStrategy = new Strategy(
  {
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: `${
      SERVER_HTTPS == 'true' ? 'https' : 'http'
    }://${SERVER_URL}/api/auth/discord/callback`,
    scope: ['identify'],
  },
  async function (accessToken: string, refreshToken: string, profile: Profile, done) {
    done(
      null,
      await User.findOrCreate({
        where: {
          provider_id: profile.id,
          name: profile.username,
          discriminator: profile.discriminator,
        },
        defaults: { avatar: profile.avatar },
      })
    );
  }
);
