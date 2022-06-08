import express, { Express } from 'express';
import { config } from 'dotenv';
import { routerConfig } from './routes/routerConfig';
import { connection } from './lib/db/connection';
import passport from 'passport';
import { User } from './lib/db/models/User';
import session from 'express-session';
import init from 'connect-session-sequelize';

// Loading .env file
config();
const { SERVER_HOST, SERVER_PORT, SYNC_DATABASE, FORCE_SYNC_DATABASE, SESSION_SECRET } =
  process.env;

// Sync database
if (SYNC_DATABASE == 'true') {
  connection.sync({ force: FORCE_SYNC_DATABASE == 'true' });
}

// Initialize
const server: Express = express();
server.use(express.json());

// Sequelize Store
const SequelizeStore = init(session.Store);

// Passport
server.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: connection,
      tableName: 'sessions',
      extendDefaultFields: (defaults, session) => {
        return {
          ...defaults,
          userId: session.id,
        };
      },
    }),
    resave: false,
    proxy: true,
  })
);
passport.serializeUser((user: User, done) => {
  done(null, user);
});
passport.deserializeUser(async (user: User, done) => {
  done(null, user);
});
server.use(passport.initialize());
server.use(passport.session());

// Init routers
routerConfig.routers.forEach((routerConfig) => {
  server.use(routerConfig.baseUrl, routerConfig.router);
});

server.listen(parseInt(SERVER_PORT), SERVER_HOST, () => {
  console.log(`Server started on address https://${SERVER_HOST}:${SERVER_PORT}`);
});
