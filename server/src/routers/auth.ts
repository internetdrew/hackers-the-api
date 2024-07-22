import { Router } from 'express';
import { handleInputErrors, validateUserInputs } from '../modules/middleware';
import { createUser, login } from '../handlers/user';
import { getCurrentUser } from '../modules/auth';

const authRouter = Router();

authRouter.post('/user', validateUserInputs, handleInputErrors, createUser);
authRouter.post('/login', validateUserInputs, handleInputErrors, login);
authRouter.get('/check-auth', getCurrentUser);

export default authRouter;
