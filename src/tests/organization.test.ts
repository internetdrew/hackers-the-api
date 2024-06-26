import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../server';
import prisma from '../db';

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
    await prisma.user.update({
      where: {
        id: userResponse.body.data.id,
      },
      data: {
        role: 'ADMIN',
      },
    });
    await request(app)
      .post('/admin/organizations/create')
      .auth(userResponse.body.data.token, { type: 'bearer' })
      .send(ellingson);
    await request(app)
      .post('/admin/organizations/create')
      .auth(userResponse.body.data.token, { type: 'bearer' })
      .send(cyberdelia);

    await prisma.user.update({
      where: {
        id: userResponse.body.data.id,
      },
      data: {
        role: 'USER',
      },
    });

    const organizationResponse = await request(app)
      .get('/api/v1/organizations')
      .auth(userResponse.body.data.token, { type: 'bearer' });

    expect(organizationResponse.status).toBe(200);
    expect(organizationResponse.body.data).toBeInstanceOf(Array);
    expect(organizationResponse.body.data).toHaveLength(2);
  });
});
