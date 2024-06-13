import express from 'express';
import v1Router from './routes/v1';
import morgan from 'morgan';
import cors from 'cors';
import { protect } from './modules/auth';
import { createUser, login } from './handlers/user';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.big_secret = 'big secret';
  next();
});

app.get('/', (req: any, res) => {
  res.status(200);
  res.json('Hello world!');
});

app.use('/api/v1', protect, v1Router);

app.post('/user', createUser);
app.post('/login', login);

export default app;
