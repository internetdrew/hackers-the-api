import express, { Response } from 'express';
import { adminRouter, v1Router } from './routes/v1';
import morgan from 'morgan';
import cors from 'cors';
import { isAdmin, protect } from './modules/auth';
import { createUser, login } from './handlers/user';
import { handleInputErrors, validateUserInputs } from './modules/middleware';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res: Response) => {
  res.status(200);
  res.json('Hello world!');
});

app.use('/api/v1', protect, v1Router);
app.use('/api/v1/admin', protect, isAdmin, adminRouter);

app.post('/user', validateUserInputs, handleInputErrors, createUser);
app.post('/login', validateUserInputs, handleInputErrors, login);

export default app;
