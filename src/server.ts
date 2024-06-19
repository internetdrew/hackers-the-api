import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';

import { adminRouter, v1Router } from './routes/v1';
import { isAdmin, protect } from './modules/auth';
import { createUser, login } from './handlers/user';
import {
  apiLimiter,
  handleInputErrors,
  validateUserInputs,
} from './modules/middleware';

const app = express();

app.use(compression());
app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', protect, apiLimiter, v1Router);
app.use('/api/v1/admin', protect, apiLimiter, isAdmin, adminRouter);

app.post('/user', validateUserInputs, handleInputErrors, createUser);
app.post('/login', validateUserInputs, handleInputErrors, login);

export default app;
