import { Router } from 'express';
import {
  getAllCharacters,
  getCharacterById,
  getCharacterQuotes,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from '../handlers/characters';
import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
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
v1Router.get('/hacks/hacker/:id', getHackerHacks);

/* Quotes */
v1Router.get('/quotes', getAllQuotes);
v1Router.get('/quotes/:id', getQuoteById);

/* Admin (Characters) */
adminRouter.post(
  '/characters/create',
  validateCharacterCreationInputs,
  handleInputErrors,
  createCharacter
);
adminRouter.put('/characters/:id', updateCharacter);
adminRouter.delete('/characters/delete/:id', deleteCharacter);

/* Admin (Organizations) */
adminRouter.post('/organizations/create', createOrganization);
adminRouter.put('/organizations/update/:id', updateOrganization);
adminRouter.delete('/organizations/delete/:id', deleteOrganization);

/* Admin (Users) */
adminRouter.put('/authorize', handleInputErrors, authorizeAdmin);

export { v1Router, adminRouter };
