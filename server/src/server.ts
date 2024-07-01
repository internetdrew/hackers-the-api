import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { createUser, login } from './handlers/user';
import {
  apiLimiter,
  handleInputErrors,
  isAdmin,
  protect,
  validateUserInputs,
} from './modules/middleware';

import v1Router from './routers/v1';
import adminRouter from './routers/admin';

const app = express();

app.use(compression());
app.use(helmet());
app.use(cookieParser());

app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', protect, apiLimiter, v1Router);
app.use('/admin', protect, apiLimiter, isAdmin, adminRouter);

app.post('/user', validateUserInputs, handleInputErrors, createUser);
app.post('/login', validateUserInputs, handleInputErrors, login);

export default app;
