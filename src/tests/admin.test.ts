import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../server';
import prisma from '../db';

describe('POST /admin/authorize', () => {
  it('should return a 401 when a user is not authorized as an admin', async () => {
    const typicalUser = await request(app).post('/user').send({
      username: 'typicalUser',
      password: 'weakpassword',
    });

    const userId = typicalUser.body.data.id;

    const response = await request(app)
      .put('/admin/authorize')
      .auth(typicalUser.body.data.token, { type: 'bearer' })
      .send({
        id: userId,
      });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not authorized.');
  });

  it('should return a 200 and a token when a user is authorized as an admin', async () => {
    const typicalUser = await request(app).post('/user').send({
      username: 'typicalUser',
      password: 'weakpassword',
    });
    await prisma.user.update({
      where: {
        id: typicalUser.body.data.id,
      },
      data: {
        role: 'ADMIN',
      },
    });

    const userId = typicalUser.body.data.id;

    const response = await request(app)
      .put('/admin/authorize')
      .auth(typicalUser.body.data.token, { type: 'bearer' })
      .send({
        id: userId,
      });
    expect(response.status).toBe(200);
    expect(response.body.data.role).toBe('ADMIN');
  });

  it('should allow an admin to create a new admin', async () => {
    const adminUser = await request(app).post('/user').send({
      username: 'typicalUser',
      password: 'weakpassword',
    });
    await prisma.user.update({
      where: {
        id: adminUser.body.data.id,
      },
      data: {
        role: 'ADMIN',
      },
    });

    const nonAdminUser = await request(app).post('/user').send({
      username: 'nonAdminUser',
      password: 'somepassword',
    });
    const response = await request(app)
      .put('/admin/authorize')
      .auth(adminUser.body.data.token, { type: 'bearer' })
      .send({
        id: nonAdminUser.body.data.id,
      });
    expect(response.body.data.role).toBe('ADMIN');
  });
});

describe('POST /admin/characters/create', () => {
  it('should return a 401 when a user is not authorized as an admin', async () => {
    const typicalUser = await request(app).post('/user').send({
      username: 'typicalUser',
      password: 'weakpassword',
    });

    const response = await request(app)
      .post('/admin/characters/create')
      .auth(typicalUser.body.data.token, { type: 'bearer' })
      .send({
        name: 'test_character',
        description: 'test_description',
      });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not authorized.');
  });

  it('should return a 200 when a user is authorized as an admin', async () => {
    const typicalUser = await request(app).post('/user').send({
      username: 'typicalUser',
      password: 'weakpassword',
    });
    await prisma.user.update({
      where: {
        id: typicalUser.body.data.id,
      },
      data: {
        role: 'ADMIN',
      },
    });

    const response = await request(app)
      .post('/admin/characters/create')
      .auth(typicalUser.body.data.token, { type: 'bearer' })
      .send({
        name: 'test_character',
        knownAliases: ['Small Fry', 'George Cantstandya', 'The Big Payback'],
        bio: 'test_bio',
        imageUrl: 'http://image.com/image.jpg',
        skillLevel: 'ELITE',
      });
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('test_character');
    expect(response.body.data.knownAliases).toHaveLength(3);
  });

  it('should return a 409 when a character already exists', async () => {
    const userResponse = await request(app).post('/user').send({
      username: 'typicalUser',
      password: 'weakpassword',
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
      .send({
        name: 'test_character',
        knownAliases: ['Small Fry', 'George Cantstandya', 'The Big Payback'],
        bio: 'test_bio',
        imageUrl: 'http://image.com/image.jpg',
        skillLevel: 'ELITE',
      });

    const authResponse = await request(app)
      .post('/admin/characters/create')
      .auth(userResponse.body.data.token, { type: 'bearer' })
      .send({
        name: 'test_character',
        knownAliases: ['Small Fry', 'George Cantstandya', 'The Big Payback'],
        bio: 'test_bio',
        imageUrl: 'http://image.com/image.jpg',
        skillLevel: 'ELITE',
      });
    expect(authResponse.status).toBe(409);
    expect(authResponse.body.error).toBe(
      'A character with this name already exists.'
    );
  });
});
