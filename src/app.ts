import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import config from 'config';

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(helmet());

app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);

app.use(
  cookieSession({
    name: config.get<string>('cookieName'),
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.get<string>('cookieKey1')],
  }),
);

export default app;