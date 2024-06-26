import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../server';
import prisma from '../db';

const dade = {
  name: 'Dade Murphy',
  bio: 'The fearless leader of the hackers.',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Crash_Override.jpg',
  knownAliases: ['Crash Override', 'Zero Cool'],
  skillLevel: 'ELITE',
};

const kate = {
  name: 'Kate Libby',
  bio: 'The queen of the hackers.',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Acid_Burn.jpg',
  knownAliases: ['Acid Burn'],
  skillLevel: 'ELITE',
};

describe('GET /api/v1/characters', () => {
  beforeAll(async () => {});

  it('should return a 200 and an array of characters', async () => {
    const userResponse = await request(app).post('/user').send({
      username: 'adminX',
      password: 'passwordX',
    });
    await prisma.user.update({
      where: {
        id: userResponse.body.data.id,
      },
      data: {
        role: 'ADMIN',
      },
    });
    await request(app)
      .post('/admin/characters/create')
      .auth(userResponse.body.data.token, { type: 'bearer' })
      .send(dade);
    await request(app)
      .post('/admin/characters/create')
      .auth(userResponse.body.data.token, { type: 'bearer' })
      .send(kate);

    const characterResponse = await request(app)
      .get('/api/v1/characters')
      .auth(userResponse.body.data.token, { type: 'bearer' });

    expect(characterResponse.status).toBe(200);
    expect(characterResponse.body.data).toBeInstanceOf(Array);
    expect(characterResponse.body.data).toHaveLength(2);
  });

  it('should return a 401 when a user is not authorized', async () => {
    const characterResponse = await request(app).get('/api/v1/characters');
    expect(characterResponse.status).toBe(401);
    expect(characterResponse.body.message).toBe('Unauthorized!');
  });
});

describe('GET /api/v1/characters/:id', () => {
  it('should return a 200 and a character by id', async () => {
    const userResponse = await request(app).post('/user').send({
      username: 'user123',
      password: 'password123',
    });
    await prisma.user.update({
      where: {
        id: userResponse.body.data.id,
      },
      data: {
        role: 'ADMIN',
      },
    });
    const dadeResponse = await request(app)
      .post('/admin/characters/create')
      .auth(userResponse.body.data.token, { type: 'bearer' })
      .send(dade);
    const kateResponse = await request(app)
      .post('/admin/characters/create')
      .auth(userResponse.body.data.token, { type: 'bearer' })
      .send(kate);

    await prisma.user.update({
      where: {
        id: userResponse.body.data.id,
      },
      data: {
        role: 'USER',
      },
    });

    const dadeDataRes = await request(app)
      .get(`/api/v1/characters/${dadeResponse.body.data.id}`)
      .auth(userResponse.body.data.token, { type: 'bearer' });

    expect(dadeDataRes.status).toBe(200);
    expect(dadeDataRes.body.data.name).toBe('Dade Murphy');
    expect(dadeDataRes.body.data.knownAliases).toEqual([
      'Crash Override',
      'Zero Cool',
    ]);

    const kateDataRes = await request(app)
      .get(`/api/v1/characters/${kateResponse.body.data.id}`)
      .auth(userResponse.body.data.token, { type: 'bearer' });

    expect(kateDataRes.status).toBe(200);
    expect(kateDataRes.body.data.name).toBe('Kate Libby');
    expect(kateDataRes.body.data.knownAliases).toEqual(['Acid Burn']);
  });
});
