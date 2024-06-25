import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../server';
import prisma from '../db';

describe('POST /user', () => {
  let adminUser;

  beforeAll(async () => {
    const typicalUser = await prisma.user.create({
      data: {
        username: 'futureAdmin',
        password: 'securepassword',
      },
    });

    adminUser = await prisma.user.update({
      where: {
        id: typicalUser.id,
      },
      data: {
        role: 'ADMIN',
      },
    });
  });

  it('should return a 200 and user info when a user is created', async () => {
    const res = await request(app).post('/user').send({
      username: 'test_user_X',
      password: 'password',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.username).toBe('test_user_X');
    expect(res.body.data.password).not.toBeDefined();
  });

  it('should return a 409 when a user already exists', async () => {
    const userX = await request(app).post('/user').send({
      username: 'test_user_X',
      password: 'password',
    });
    const userX2 = await request(app).post('/user').send({
      username: 'test_user_X',
      password: 'password2',
    });
    expect(userX2.status).toBe(409);
  });
});
