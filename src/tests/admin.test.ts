import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../server';
import prisma from '../db';

describe('Authorization', () => {
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
});

describe('Characters', () => {
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
  describe('PUT /admin/characters/update/:id', () => {
    it('should create a character and update it', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });
      await prisma.user.update({
        where: {
          id: userResponse.body.data.id,
        },
        data: {
          role: 'ADMIN',
        },
      });
      const characterRes = await request(app)
        .post('/admin/characters/create')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_character',
          knownAliases: ['Small Fry', 'George Cantstandya', 'The Big Payback'],
          bio: 'test_bio',
          imageUrl: 'http://image.com/image.jpg',
          skillLevel: 'ELITE',
        });
      expect(characterRes.status).toBe(200);
      expect(characterRes.body.data.name).toBe('test_character');
    });

    it('should return a 401 when a user is not authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'typicalUser',
        password: 'weakpassword',
      });
      const characterRes = await request(app)
        .post('/admin/characters/create')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_character',
          knownAliases: ['Small Fry', 'George Cantstandya', 'The Big Payback'],
          bio: 'test_bio',
          imageUrl: 'http://image.com/image.jpg',
          skillLevel: 'ELITE',
        });
      expect(characterRes.status).toBe(401);
      expect(characterRes.body.message).toBe('Not authorized.');
    });
  });

  describe('DELETE /admin/characters/delete/:id', () => {
    it('should return a 401 when a user is not authorized as an admin', async () => {
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

      const characterRes = await request(app)
        .post('/admin/characters/create')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_character',
          knownAliases: ['Small Fry', 'George Cantstandya', 'The Big Payback'],
          bio: 'test_bio',
          imageUrl: 'http://image.com/image.jpg',
          skillLevel: 'ELITE',
        });

      await prisma.user.update({
        where: {
          id: userResponse.body.data.id,
        },
        data: {
          role: 'USER',
        },
      });
      const characterId = characterRes.body.data.id;

      const deletionRes = await request(app)
        .del(`/admin/characters/delete/${characterId}`)
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_character',
          knownAliases: ['Small Fry', 'George Cantstandya', 'The Big Payback'],
          bio: 'test_bio',
          imageUrl: 'http://image.com/image.jpg',
          skillLevel: 'ELITE',
        });
      expect(deletionRes.status).toBe(401);
      expect(deletionRes.body.message).toBe('Not authorized.');
    });

    it('should return a 200 and success message when a user is authorized as an admin', async () => {
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

      const characterRes = await request(app)
        .post('/admin/characters/create')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_character',
          knownAliases: ['Small Fry', 'George Cantstandya', 'The Big Payback'],
          bio: 'test_bio',
          imageUrl: 'http://image.com/image.jpg',
          skillLevel: 'ELITE',
        });

      const characterId = characterRes.body.data.id;

      const deletionRes = await request(app)
        .del(`/admin/characters/delete/${characterId}`)
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_character',
          knownAliases: ['Small Fry', 'George Cantstandya', 'The Big Payback'],
          bio: 'test_bio',
          imageUrl: 'http://image.com/image.jpg',
          skillLevel: 'ELITE',
        });
      expect(deletionRes.status).toBe(200);
      expect(deletionRes.body.message).toBe('Character deleted.');
    });
  });
});

describe('Organizations', () => {
  describe('POST /admin/organizations/create', () => {
    it('should return a 401 when a user is not authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'typicalUser',
        password: 'weakpassword',
      });
      const organizationRes = await request(app)
        .post('/admin/organizations/create')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_organization',
          description: 'test_description',
          imageUrl: 'http://image.com/image.jpg',
        });
      expect(organizationRes.status).toBe(401);
      expect(organizationRes.body.message).toBe('Not authorized.');
    });

    it('should return a 200 when a user is authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });
      await prisma.user.update({
        where: {
          id: userResponse.body.data.id,
        },
        data: {
          role: 'ADMIN',
        },
      });
      const organizationRes = await request(app)
        .post('/admin/organizations/create')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_organization',
          description: 'test_description',
          imageUrl: 'http://image.com/image.jpg',
        });
      expect(organizationRes.status).toBe(200);
      expect(organizationRes.body.data.name).toBe('test_organization');
    });
  });

  describe('PUT /admin/organizations/update/:id', () => {
    it('should return a 401 when a user is not authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'typicalUser',
        password: 'weakpassword',
      });
      const organizationRes = await request(app)
        .post('/admin/organizations/create')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_organization',
          description: 'test_description',
          imageUrl: 'http://image.com/image.jpg',
        });
      expect(organizationRes.status).toBe(401);
      expect(organizationRes.body.message).toBe('Not authorized.');
    });

    it('should return a 200 when a user is authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });
      await prisma.user.update({
        where: {
          id: userResponse.body.data.id,
        },
        data: {
          role: 'ADMIN',
        },
      });

      const organizationRes = await request(app)
        .post('/admin/organizations/create')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_organization',
          description: 'test_description',
          imageUrl: 'http://image.com/image.jpg',
        });

      expect(organizationRes.status).toBe(200);
      expect(organizationRes.body.data.name).toBe('test_organization');

      const response = await request(app)
        .put(`/admin/organizations/update/${organizationRes.body.data.id}`)
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'updated_organization',
          description: 'updated_description',
          imageUrl: 'http://image.com/image.jpg',
        });
      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('updated_organization');
      expect(response.body.data.description).toBe('updated_description');
    });

    it('should return a 404 when an organization does not exist', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });

      await prisma.user.update({
        where: {
          id: userResponse.body.data.id,
        },
        data: {
          role: 'ADMIN',
        },
      });

      const response = await request(app)
        .put('/admin/organizations/update/1000')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'updated_organization',
          description: 'updated_description',
          imageUrl: 'http://image.com/image.jpg',
        });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Organization not found.');
    });
  });
  describe('DELETE /admin/organizations/delete/:id', () => {
    it('should return a 401 when a user is not authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });

      await prisma.user.update({
        where: {
          id: userResponse.body.data.id,
        },
        data: {
          role: 'ADMIN',
        },
      });

      const organizationRes = await request(app)
        .post('/admin/organizations/create')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_organization',
          description: 'test_description',
          imageUrl: 'http://image.com/image.jpg',
        });

      const orgId = organizationRes.body.data.id;

      await prisma.user.update({
        where: {
          id: userResponse.body.data.id,
        },
        data: {
          role: 'USER',
        },
      });

      const deletionRes = await request(app)
        .del(`/admin/organizations/delete/${orgId}`)
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({ id: orgId });

      expect(deletionRes.status).toBe(401);
      expect(deletionRes.body.message).toBe('Not authorized.');
    });

    it('should return a 200 and success message when a user is authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });

      await prisma.user.update({
        where: {
          id: userResponse.body.data.id,
        },
        data: {
          role: 'ADMIN',
        },
      });

      const organizationRes = await request(app)
        .post('/admin/organizations/create')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_organization',
          description: 'test_description',
          imageUrl: 'http://image.com/image.jpg',
        });

      const orgId = organizationRes.body.data.id;

      const deletionRes = await request(app)
        .del(`/admin/organizations/delete/${orgId}`)
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({ id: orgId });

      expect(deletionRes.status).toBe(200);
      expect(deletionRes.body.message).toBe('Organization deleted.');
    });

    it('should return a 404 when an organization does not exist', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });

      await prisma.user.update({
        where: {
          id: userResponse.body.data.id,
        },
        data: {
          role: 'ADMIN',
        },
      });

      const response = await request(app)
        .del('/admin/organizations/delete/1000')
        .auth(userResponse.body.data.token, { type: 'bearer' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Organization not found.');
    });
  });
});
