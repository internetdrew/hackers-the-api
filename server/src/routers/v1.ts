import { Router } from 'express';
import {
  getAllCharacters,
  getCharacterById,
  getCharacterQuotes,
  getCharacterHacks,
} from '../handlers/characters';
import {
  getAllOrganizations,
  getOrganizationById,
} from '../handlers/organizations';
import { getAllHacks, getHackById } from '../handlers/hacks';
import { getAllQuotes, getQuoteById } from '../handlers/quotes';

const v1Router = Router();

/* Characters */
v1Router.get('/characters', getAllCharacters);
v1Router.get('/characters/:id', getCharacterById);
v1Router.get('/characters/:id/quotes', getCharacterQuotes);
v1Router.get('/characters/:id/hacks', getCharacterHacks);

/* Organizations */
v1Router.get('/organizations', getAllOrganizations);
v1Router.get('/organizations/:id', getOrganizationById);

/* Hacks */
v1Router.get('/hacks', getAllHacks);
v1Router.get('/hacks/:id', getHackById);

/* Quotes */
v1Router.get('/quotes', getAllQuotes);
v1Router.get('/quotes/:id', getQuoteById);

export default v1Router;
