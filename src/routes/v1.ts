import { Router } from 'express';
import {
  getAllCharacters,
  getCharacterById,
  getCharacterQuotes,
} from '../handlers/characters';

const v1Router = Router();

/* Characters */
v1Router.get('/characters', getAllCharacters);
v1Router.get('/characters/:id', getCharacterById);
v1Router.get('/characters/:id/quotes', getCharacterQuotes);

/* Characters */

export default v1Router;
