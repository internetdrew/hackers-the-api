import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../server';
import prisma from '../db';

describe('GET /api/v1/hacks', () => {
  it('should return 401 if not authorized', async () => {
    const res = await request(app).get('/api/v1/hacks');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized!');
  });

  it('should return a 200 status and all hacks', async () => {
    const userRes = await request(app).post('/user').send({
      username: 'test',
      password: 'test',
    });

    await prisma.user.update({
      where: { id: userRes.body.data.id },
      data: { role: 'ADMIN' },
    });

    const orgRes = await request(app)
      .post('/admin/organizations')
      .auth(userRes.body.data.token, { type: 'bearer' })
      .send({
        name: 'Test Organization',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
      });

    await request(app)
      .post('/admin/hacks')
      .auth(userRes.body.data.token, { type: 'bearer' })
      .send({
        title: 'Test Hack One',
        description: 'Test Description',
        targetOrganizationId: orgRes.body.data.id,
      });
    await request(app)
      .post('/admin/hacks')
      .auth(userRes.body.data.token, { type: 'bearer' })
      .send({
        title: 'Test Hack Two',
        description: 'Test Description',
        targetOrganizationId: orgRes.body.data.id,
      });

    await prisma.user.update({
      where: { id: userRes.body.data.id },
      data: { role: 'USER' },
    });

    const res = await request(app)
      .get('/api/v1/hacks')
      .auth(userRes.body.data.token, { type: 'bearer' });
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(2);
  });
});
describe('GET /api/v1/hacks/:id', () => {
  it('should return a 200 status and a hack', async () => {
    const userRes = await request(app).post('/user').send({
      username: 'test',
      password: 'test',
    });

    await prisma.user.update({
      where: { id: userRes.body.data.id },
      data: { role: 'ADMIN' },
    });

    const orgRes = await request(app)
      .post('/admin/organizations')
      .auth(userRes.body.data.token, { type: 'bearer' })
      .send({
        name: 'Test Organization',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
      });

    const hackOneRes = await request(app)
      .post('/admin/hacks')
      .auth(userRes.body.data.token, { type: 'bearer' })
      .send({
        title: 'Test Hack One',
        description: 'Test Description',
        targetOrganizationId: orgRes.body.data.id,
      });
    const hackTwoRes = await request(app)
      .post('/admin/hacks')
      .auth(userRes.body.data.token, { type: 'bearer' })
      .send({
        title: 'Test Hack Two',
        description: 'Test Description',
        targetOrganizationId: orgRes.body.data.id,
      });

    await prisma.user.update({
      where: { id: userRes.body.data.id },
      data: { role: 'USER' },
    });

    const resOne = await request(app)
      .get(`/api/v1/hacks/${hackOneRes.body.data.id}`)
      .auth(userRes.body.data.token, { type: 'bearer' });
    expect(resOne.status).toBe(200);
    expect(resOne.body.data.title).toBe('Test Hack One');

    const resTwo = await request(app)
      .get(`/api/v1/hacks/${hackTwoRes.body.data.id}`)
      .auth(userRes.body.data.token, { type: 'bearer' });
    expect(resTwo.status).toBe(200);
    expect(resTwo.body.data.title).toBe('Test Hack Two');
  });
});
