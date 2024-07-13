import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../server';
import prisma from '../db';
import { getUserAccessToken, updateUserRole } from './helpers';

const ellingson = {
  name: 'Ellingson Mineral Company',
  description: 'The company that makes everything and will capsize ships.',
  imageUrl:
    'https://upload.wikimedia.org/wikipedia/en/8/8d/Acme_Corporation_Logo.png',
};

const cyberdelia = {
  name: 'Cyberdelia',
  description: 'The coolest club in the world.',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Cyberdelia.jpg',
};

describe('GET /api/v1/organizations', () => {
  it('should return a 200 and an array of organizations', async () => {
    const userResponse = await request(app).post('/user').send({
      username: 'adminX',
      password: 'passwordX',
    });
    await updateUserRole({
      userId: userResponse.body.data.id,
      role: 'ADMIN',
    });
    const accessToken = await getUserAccessToken(userResponse.body.data.id);
    await request(app)
      .post('/admin/organizations')
      .auth(accessToken!, { type: 'bearer' })
      .send(ellingson);
    await request(app)
      .post('/admin/organizations')
      .auth(accessToken!, { type: 'bearer' })
      .send(cyberdelia);

    await updateUserRole({
      userId: userResponse.body.data.id,
      role: 'USER',
    });

    const organizationResponse = await request(app)
      .get('/api/v1/organizations')
      .auth(accessToken!, { type: 'bearer' });

    expect(organizationResponse.status).toBe(200);
    expect(organizationResponse.body.data).toBeInstanceOf(Array);
    expect(organizationResponse.body.data).toHaveLength(2);
  });
});

describe('GET /api/v1/organizations/:id', () => {
  it('should return a 200 and an organization', async () => {
    const userResponse = await request(app).post('/user').send({
      username: 'adminY',
      password: 'password',
    });

    await updateUserRole({
      userId: userResponse.body.data.id,
      role: 'ADMIN',
    });
    const accessToken = await getUserAccessToken(userResponse.body.data.id);
    const ellingsonRes = await request(app)
      .post('/admin/organizations')
      .auth(accessToken!, { type: 'bearer' })
      .send(ellingson);
    const cyberdeliaRes = await request(app)
      .post('/admin/organizations')
      .auth(accessToken!, { type: 'bearer' })
      .send(cyberdelia);

    await updateUserRole({ userId: userResponse.body.data.id, role: 'USER' });
    const ellingsonId = ellingsonRes.body.data.id;
    const cyberdeliaId = cyberdeliaRes.body.data.id;

    const ellingsonQueryResponse = await request(app)
      .get(`/api/v1/organizations/${ellingsonId}`)
      .auth(accessToken!, { type: 'bearer' });

    expect(ellingsonQueryResponse.status).toBe(200);
    expect(ellingsonQueryResponse.body.data.name).toBe(ellingson.name);

    const cyberdeliaQueryResponse = await request(app)
      .get(`/api/v1/organizations/${cyberdeliaId}`)
      .auth(accessToken!, { type: 'bearer' });
    expect(cyberdeliaQueryResponse.status).toBe(200);
    expect(cyberdeliaQueryResponse.body.data.name).toBe(cyberdelia.name);
  });
});
