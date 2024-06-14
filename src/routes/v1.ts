import { Router } from 'express';
import {
  getAllCharacters,
  getCharacterById,
  getCharacterQuotes,
} from '../handlers/characters';
import {
  getAllOrganizations,
  getOrganizationById,
} from '../handlers/organizations';
import {
  getAllHacks,
  getHackById,
  getHackHackers,
  getHackTarget,
} from '../handlers/hacks';

const v1Router = Router();

/* Characters */
v1Router.get('/characters', getAllCharacters);
v1Router.get('/characters/:id', getCharacterById);
v1Router.get('/characters/:id/quotes', getCharacterQuotes);

/* Organizations */
v1Router.get('/organizations', getAllOrganizations);
v1Router.get('/organizations/:id', getOrganizationById);

/* Hacks */
v1Router.get('/hacks', getAllHacks);
v1Router.get('/hacks/:id', getHackById);
v1Router.get('/hacks/:id/target', getHackTarget);
v1Router.get('/hacks/:id/hacker', getHackHackers);

export default v1Router;
