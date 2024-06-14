import { Router } from 'express';
import prisma from '../db';

const v1Router = Router();

v1Router.get('/characters', (_, res) => {
  const characters = prisma.character.findMany();
  res.json({
    characters,
  });
});

v1Router.get('/characters/:id', async (req, res) => {
  const character = await prisma.character.findUnique({
    where: {
      id: parseInt(req.params?.id),
    },
  });
  return res.json({ character });
});

export default v1Router;
