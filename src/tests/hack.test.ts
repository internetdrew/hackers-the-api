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

    await request(app)
      .post('/admin/hacks/create')
      .auth(userRes.body.data.token, { type: 'bearer' })
      .send({
        title: 'Test Hack One',
        description: 'Test Description',
      });
    await request(app)
      .post('/admin/hacks/create')
      .auth(userRes.body.data.token, { type: 'bearer' })
      .send({
        title: 'Test Hack Two',
        description: 'Test Description',
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

    const hackOneRes = await request(app)
      .post('/admin/hacks/create')
      .auth(userRes.body.data.token, { type: 'bearer' })
      .send({
        title: 'Test Hack One',
        description: 'Test Description',
      });
    const hackTwoRes = await request(app)
      .post('/admin/hacks/create')
      .auth(userRes.body.data.token, { type: 'bearer' })
      .send({
        title: 'Test Hack Two',
        description: 'Test Description',
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
describe('GET /api/v1/hacks/:id/targets', () => {
  it('should return a 200 status and a hack target', async () => {
    const userRes = await request(app).post('/user').send({
      username: 'test',
      password: 'test',
    });

    await prisma.user.update({
      where: { id: userRes.body.data.id },
      data: { role: 'ADMIN' },
    });

    const hackOneRes = await request(app)
      .post('/admin/hacks/create')
      .auth(userRes.body.data.token, { type: 'bearer' })
      .send({
        title: 'Test Hack One',
        description: 'Test Description',
      });
    const hackTwoRes = await request(app)
      .post('/admin/hacks/create')
      .auth(userRes.body.data.token, { type: 'bearer' })
      .send({
        title: 'Test Hack Two',
        description: 'Test Description',
      });

    await prisma.user.update({
      where: { id: userRes.body.data.id },
      data: { role: 'USER' },
    });

    const resOne = await request(app)
      .get(`/api/v1/hacks/${hackOneRes.body.data.id}/targets`)
      .auth(userRes.body.data.token, { type: 'bearer' });

    expect(resOne.status).toBe(200);
    expect(resOne.body.data).toBeInstanceOf(Object);
    expect(resOne.body.data.targetedCharacters).toBeInstanceOf(Array);
    expect(resOne.body.data.targetedOrganizations).toBeInstanceOf(Array);
  });
});
// describe('GET /api/v1/hacks/:id/hackers', () => {});
// describe('GET /api/v1/hacks/:id/targets', () => {});
