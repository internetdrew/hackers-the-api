import { Router } from 'express';
import {
  createCharacter,
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
  getHackerHacks,
} from '../handlers/hacks';
import {
  handleInputErrors,
  validateCharacterCreationInputs,
} from '../modules/middleware';
import { getAllQuotes, getQuoteById } from '../handlers/quotes';
import { authorizeAdmin } from '../handlers/user';

const v1Router = Router();
const adminRouter = Router();

v1Router.get('/characters', getAllCharacters);
v1Router.get('/characters/:id', getCharacterById);
v1Router.get('/characters/:id/quotes', getCharacterQuotes);

v1Router.get('/organizations', getAllOrganizations);
v1Router.get('/organizations/:id', getOrganizationById);

v1Router.get('/hacks', getAllHacks);
v1Router.get('/hacks/:id', getHackById);
v1Router.get('/hacks/:id/target', getHackTarget);
v1Router.get('/hacks/:id/hacker', getHackHackers);
v1Router.get('/hacks/hacker/:id', getHackerHacks);

v1Router.get('/quotes', getAllQuotes);
v1Router.get('/quotes/:id', getQuoteById);

adminRouter.post(
  '/characters',
  validateCharacterCreationInputs,
  handleInputErrors,
  createCharacter
);
adminRouter.put('/authorize', handleInputErrors, authorizeAdmin);
// adminRouter.put('/characters/:id', updateCharacter);
// adminRouter.delete('/characters/:id', deleteCharacter);

export { v1Router, adminRouter };
