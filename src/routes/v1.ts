import { Router } from 'express';

const v1Router = Router();

/*
Characters
*/
v1Router.get('/characters', (req, res) => {
  res.json({
    message: 'yeah baby!',
    data: 'baby is in the corner',
  });
});

export default v1Router;
