import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';

import { apiLimiter, isAdmin, protect } from './modules/middleware';

import v1Router from './routers/v1';
import adminRouter from './routers/admin';
import { restResponseTimeHistogram } from './modules/metrics';
import authRouter from './routers/auth';

const app = express();

app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:4321',
    credentials: true,
  })
);
app.use(
  responseTime((req: Request, res: Response, time: number) => {
    if (req?.route?.path) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time * 1000
      );
    }
  })
);
app.use(morgan('dev'));

app.use('/api/v1', protect, apiLimiter, v1Router);
app.use('/admin', protect, apiLimiter, isAdmin, adminRouter);
app.use('/auth', authRouter);

export default app;
