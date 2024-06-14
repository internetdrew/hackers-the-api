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
} from '../handlers/hacks';
import {
  handleInputErrors,
  validateCharacterCreationInputs,
} from '../modules/middleware';

const v1Router = Router();
const adminRouter = Router();

/* Characters */
v1Router.get('/characters', getAllCharacters);
v1Router.get('/characters/:id', getCharacterById);
v1Router.get('/characters/:id/quotes', getCharacterQuotes);
/* Characters admin routes */
adminRouter.post(
  '/characters',
  validateCharacterCreationInputs,
  handleInputErrors,
  createCharacter
);
// adminRouter.put('/characters/:id', updateCharacter);
// adminRouter.delete('/characters/:id', deleteCharacter);

/* Organizations */
v1Router.get('/organizations', getAllOrganizations);
v1Router.get('/organizations/:id', getOrganizationById);

/* Hacks */
v1Router.get('/hacks', getAllHacks);
v1Router.get('/hacks/:id', getHackById);
v1Router.get('/hacks/:id/target', getHackTarget);
v1Router.get('/hacks/:id/hacker', getHackHackers);

export { v1Router, adminRouter };
