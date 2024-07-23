import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../server';
import { getUserAccessToken, updateUserRole } from './helpers';

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
  it('should return a 200 and an array of characters', async () => {
    const userResponse = await request(app).post('/auth/user').send({
      username: 'adminX',
      password: 'passwordX',
    });
    await updateUserRole({ userId: userResponse.body.data.id, role: 'ADMIN' });

    const accessToken = await getUserAccessToken(userResponse.body.data.id);
    await request(app)
      .post('/admin/characters')
      .auth(accessToken!, { type: 'bearer' })
      .send(dade);
    await request(app)
      .post('/admin/characters')
      .auth(accessToken!, { type: 'bearer' })
      .send(kate);

    await updateUserRole({ userId: userResponse.body.data.id, role: 'USER' });

    const characterResponse = await request(app)
      .get('/api/v1/characters')
      .auth(accessToken!, { type: 'bearer' });

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
    const userResponse = await request(app).post('/auth/user').send({
      username: 'user123',
      password: 'password123',
    });
    const userId = userResponse.body.data.id;
    await updateUserRole({ userId, role: 'ADMIN' });

    const accessToken = await getUserAccessToken(userResponse.body.data.id);
    const dadeResponse = await request(app)
      .post('/admin/characters')
      .auth(accessToken!, { type: 'bearer' })
      .send(dade);
    const kateResponse = await request(app)
      .post('/admin/characters')
      .auth(accessToken!, { type: 'bearer' })
      .send(kate);

    await updateUserRole({ userId, role: 'USER' });

    const dadeDataRes = await request(app)
      .get(`/api/v1/characters/${dadeResponse.body.data.id}`)
      .auth(accessToken!, { type: 'bearer' });

    expect(dadeDataRes.status).toBe(200);
    expect(dadeDataRes.body.data.name).toBe('Dade Murphy');
    expect(dadeDataRes.body.data.knownAliases).toEqual([
      'Crash Override',
      'Zero Cool',
    ]);

    const kateDataRes = await request(app)
      .get(`/api/v1/characters/${kateResponse.body.data.id}`)
      .auth(accessToken!, { type: 'bearer' });

    expect(kateDataRes.status).toBe(200);
    expect(kateDataRes.body.data.name).toBe('Kate Libby');
    expect(kateDataRes.body.data.knownAliases).toEqual(['Acid Burn']);
  });
});
