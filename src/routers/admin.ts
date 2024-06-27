import { Router } from 'express';
import {
  handleInputErrors,
  validateCharacterCreationInputs,
  validateHackContributorInput,
  validateHackCreationInputs,
  validateOrganizationCreationInputs,
} from '../modules/middleware';
import {
  createCharacter,
  deleteCharacter,
  updateCharacter,
} from '../handlers/characters';
import {
  createOrganization,
  deleteOrganization,
  updateOrganization,
} from '../handlers/organizations';
import { createHack, addHackContributor, updateHack } from '../handlers/hacks';
import { authorizeAdmin } from '../handlers/user';

const adminRouter = Router();

/*
Characters
*/
adminRouter.post(
  '/characters',
  validateCharacterCreationInputs,
  handleInputErrors,
  createCharacter
);
adminRouter.patch('/characters/:id', updateCharacter);
adminRouter.delete('/characters/:id', deleteCharacter);

/*
Organizations
*/
adminRouter.post(
  '/organizations',
  validateOrganizationCreationInputs,
  handleInputErrors,
  createOrganization
);
adminRouter.patch('/organizations/:id', updateOrganization);
adminRouter.delete('/organizations/:id', deleteOrganization);

/* 
Hacks
*/
adminRouter.post(
  '/hacks',
  validateHackCreationInputs,
  handleInputErrors,
  createHack
);
adminRouter.patch('/hacks/:id', updateHack);
// adminRouter.delete('/hacks/:id', deleteHack);

adminRouter.post(
  '/hacks/:id/contribution',
  validateHackContributorInput,
  handleInputErrors,
  addHackContributor
);

/* Admin (Users) */
adminRouter.patch('/authorize', handleInputErrors, authorizeAdmin);

export default adminRouter;
