import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../server';
import createTestOrganization from './helpers/createTestOrganization';
import updateUserRole from './helpers/updateUserRole';
import e from 'express';

const dade = {
  name: 'Dade Murphy',
  knownAliases: ['Zero Cool'],
  bio: 'Elite hacker',
  imageUrl: 'http://image.com/image.jpg',
  skillLevel: 'ELITE',
};

const kate = {
  name: 'Kate Libby',
  knownAliases: ['Acid Burn'],
  bio: 'Elite hacker',
  imageUrl: 'http://image.com/image.jpg',
  skillLevel: 'ELITE',
};

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

      await updateUserRole({ userId: typicalUser.body.data.id, role: 'ADMIN' });
      const userId = typicalUser.body.data.id;

      const response = await request(app)
        .patch('/admin/authorize')
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

      await updateUserRole({ userId: adminUser.body.data.id, role: 'ADMIN' });

      const nonAdminUser = await request(app).post('/user').send({
        username: 'nonAdminUser',
        password: 'somepassword',
      });
      const response = await request(app)
        .patch('/admin/authorize')
        .auth(adminUser.body.data.token, { type: 'bearer' })
        .send({
          id: nonAdminUser.body.data.id,
        });
      expect(response.body.data.role).toBe('ADMIN');
    });
  });
});

describe('Characters', () => {
  describe('POST /admin/characters', () => {
    it('should return a 401 when a user is not authorized as an admin', async () => {
      const typicalUser = await request(app).post('/user').send({
        username: 'typicalUser',
        password: 'weakpassword',
      });

      const response = await request(app)
        .post('/admin/characters')
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

      await updateUserRole({ userId: typicalUser.body.data.id, role: 'ADMIN' });

      const response = await request(app)
        .post('/admin/characters')
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

      await updateUserRole({
        userId: userResponse.body.data.id,
        role: 'ADMIN',
      });

      await request(app)
        .post('/admin/characters')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_character',
          knownAliases: ['Small Fry', 'George Cantstandya', 'The Big Payback'],
          bio: 'test_bio',
          imageUrl: 'http://image.com/image.jpg',
          skillLevel: 'ELITE',
        });

      const authResponse = await request(app)
        .post('/admin/characters')
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
  describe('PATCH /admin/characters/:id', () => {
    it('should update a character', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });

      await updateUserRole({
        userId: userResponse.body.data.id,
        role: 'ADMIN',
      });
      const characterRes = await request(app)
        .post('/admin/characters')
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

      const updatedRes = await request(app)
        .patch(`/admin/characters/${characterRes.body.data.id}`)
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'updated_character',
        });
      expect(updatedRes.status).toBe(200);
      expect(updatedRes.body.data.name).toBe('updated_character');
      expect(updatedRes.body.data.knownAliases).toHaveLength(3);
    });

    it('should return a 401 when a user is not authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'typicalUser',
        password: 'weakpassword',
      });
      const characterRes = await request(app)
        .post('/admin/characters')
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

  describe('DELETE /admin/characters/:id', () => {
    it('should return a 401 when a user is not authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'typicalUser',
        password: 'weakpassword',
      });

      await updateUserRole({
        userId: userResponse.body.data.id,
        role: 'ADMIN',
      });

      const characterRes = await request(app)
        .post('/admin/characters')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_character',
          knownAliases: ['Small Fry', 'George Cantstandya', 'The Big Payback'],
          bio: 'test_bio',
          imageUrl: 'http://image.com/image.jpg',
          skillLevel: 'ELITE',
        });

      await updateUserRole({ userId: userResponse.body.data.id, role: 'USER' });
      const characterId = characterRes.body.data.id;

      const deletionRes = await request(app)
        .del(`/admin/characters/${characterId}`)
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

      await updateUserRole({
        userId: userResponse.body.data.id,
        role: 'ADMIN',
      });

      const characterRes = await request(app)
        .post('/admin/characters')
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
        .del(`/admin/characters/${characterId}`)
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
  describe('POST /admin/organizations', () => {
    it('should return a 401 when a user is not authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'typicalUser',
        password: 'weakpassword',
      });

      const orgRes = await createTestOrganization({
        authToken: userResponse.body.data.token,
        name: 'Test Organization',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
      });
      expect(orgRes.status).toBe(401);
      expect(orgRes.body.message).toBe('Not authorized.');
    });

    it('should return a 200 when a user is authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });

      await updateUserRole({
        userId: userResponse.body.data.id,
        role: 'ADMIN',
      });

      const organizationRes = await request(app)
        .post('/admin/organizations')
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

  describe('PATCH /admin/organizations/:id', () => {
    it('should return a 401 when a user is not authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'typicalUser',
        password: 'weakpassword',
      });
      const organizationRes = await request(app)
        .post('/admin/organizations')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_organization',
          description: 'test_description',
          imageUrl: 'http://image.com/image.jpg',
        });
      expect(organizationRes.status).toBe(401);
      expect(organizationRes.body.message).toBe('Not authorized.');
    });

    it('should patch an organizations data', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });

      await updateUserRole({
        userId: userResponse.body.data.id,
        role: 'ADMIN',
      });

      const organizationRes = await request(app)
        .post('/admin/organizations')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_organization',
          description: 'test_description',
          imageUrl: 'http://image.com/image.jpg',
        });

      expect(organizationRes.status).toBe(200);
      expect(organizationRes.body.data.name).toBe('test_organization');

      const response = await request(app)
        .patch(`/admin/organizations/${organizationRes.body.data.id}`)
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'updated_organization',
          imageUrl: 'http://super.com/image.jpg',
        });
      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('updated_organization');
      expect(response.body.data.description).toBe('test_description');
      expect(response.body.data.imageUrl).toBe('http://super.com/image.jpg');
    });

    it('should return a 404 when an organization does not exist', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });

      await updateUserRole({
        userId: userResponse.body.data.id,
        role: 'ADMIN',
      });

      const response = await request(app)
        .patch('/admin/organizations/1000')
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
  describe('DELETE /admin/organizations/:id', () => {
    it('should return a 401 when a user is not authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });

      await updateUserRole({
        userId: userResponse.body.data.id,
        role: 'ADMIN',
      });

      const organizationRes = await request(app)
        .post('/admin/organizations')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_organization',
          description: 'test_description',
          imageUrl: 'http://image.com/image.jpg',
        });

      const orgId = organizationRes.body.data.id;

      await updateUserRole({ userId: userResponse.body.data.id, role: 'USER' });

      const deletionRes = await request(app)
        .del(`/admin/organizations/${orgId}`)
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({ id: orgId });

      expect(deletionRes.status).toBe(401);
      expect(deletionRes.body.message).toBe('Not authorized.');
    });

    it('should return a 200 and success message', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'adminUser',
        password: 'adminPassword',
      });

      await updateUserRole({
        userId: userResponse.body.data.id,
        role: 'ADMIN',
      });

      const organizationRes = await request(app)
        .post('/admin/organizations')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          name: 'test_organization',
          description: 'test_description',
          imageUrl: 'http://image.com/image.jpg',
        });

      const orgId = organizationRes.body.data.id;

      const deletionRes = await request(app)
        .del(`/admin/organizations/${orgId}`)
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

      await updateUserRole({
        userId: userResponse.body.data.id,
        role: 'ADMIN',
      });

      const response = await request(app)
        .del('/admin/organizations/1000')
        .auth(userResponse.body.data.token, { type: 'bearer' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Organization not found.');
    });
  });
});

describe('Hacks', () => {
  describe('POST /admin/hacks', () => {
    it('should return a 401 when a user is not authorized as an admin', async () => {
      const userResponse = await request(app).post('/user').send({
        username: 'typicalUser',
        password: 'weakpassword',
      });

      const hackRes = await request(app)
        .post('/admin/hacks')
        .auth(userResponse.body.data.token, { type: 'bearer' })
        .send({
          title: 'test_hack',
          description: 'test_description',
        });
      expect(hackRes.status).toBe(401);
      expect(hackRes.body.message).toBe('Not authorized.');
    });

    it('Should not allow two hacks with the same title', async () => {
      const userRes = await request(app).post('/user').send({
        username: 'test',
        password: 'test',
      });

      await updateUserRole({ userId: userRes.body.data.id, role: 'ADMIN' });

      const orgRes = await createTestOrganization({
        authToken: userRes.body.data.token,
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
      const res = await request(app)
        .post('/admin/hacks')
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send({
          title: 'Test Hack One',
          description: 'Test Description',
          targetOrganizationId: orgRes.body.data.id,
        });
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('This hack already exists.');
    });
  });
  describe('PATCH /admin/hacks/:id', () => {
    it('Should return a 401 for non-admin users', async () => {
      const userRes = await request(app).post('/user').send({
        username: 'test',
        password: 'test',
      });

      await updateUserRole({ userId: userRes.body.data.id, role: 'ADMIN' });

      const orgRes = await createTestOrganization({
        authToken: userRes.body.data.token,
        name: 'Test Organization',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
      });

      const hackRes = await request(app)
        .post('/admin/hacks')
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send({
          title: 'test_hack',
          description: 'test_description',
          targetOrganizationId: orgRes.body.data.id,
        });

      await updateUserRole({ userId: userRes.body.data.id, role: 'USER' });

      const res = await request(app)
        .put(`/admin/hacks/${hackRes.body.data.id}`)
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send({
          title: 'updated_hack',
          description: 'updated_description',
        });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Not authorized.');
    });

    it('Should update a hack', async () => {
      const userRes = await request(app).post('/user').send({
        username: 'test',
        password: 'test',
      });

      await updateUserRole({ userId: userRes.body.data.id, role: 'ADMIN' });

      const orgRes = await createTestOrganization({
        authToken: userRes.body.data.token,
        name: 'Test Organization',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
      });

      const hackRes = await request(app)
        .post('/admin/hacks')
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send({
          title: 'test_hack',
          description: 'test_description',
          targetOrganizationId: orgRes.body.data.id,
        });

      const res = await request(app)
        .patch(`/admin/hacks/${hackRes.body.data.id}`)
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send({
          title: 'updated_hack',
        });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('updated_hack');
      expect(res.body.data.description).toBe('test_description');
    });

    it('Should return a 404 for a non-existent hack', async () => {
      const userRes = await request(app).post('/user').send({
        username: 'test',
        password: 'test',
      });

      await updateUserRole({ userId: userRes.body.data.id, role: 'ADMIN' });

      const res = await request(app)
        .patch('/admin/hacks/1000')
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send({
          title: 'updated_hack',
          description: 'updated_description',
        });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('This hack record does not exist.');
    });

    it('Should add a contributor to a hack', async () => {
      const userRes = await request(app).post('/user').send({
        username: 'test',
        password: 'test',
      });

      await updateUserRole({ userId: userRes.body.data.id, role: 'ADMIN' });

      const orgRes = await createTestOrganization({
        authToken: userRes.body.data.token,
        name: 'Test Organization',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
      });

      const dadeRes = await request(app)
        .post('/admin/characters')
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send(dade);

      const kateRes = await request(app)
        .post('/admin/characters')
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send(kate);

      const hackRes = await request(app)
        .post('/admin/hacks')
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send({
          title: 'test_hack',
          description: 'test_description',
          targetOrganizationId: orgRes.body.data.id,
        });

      expect(hackRes.body.data.contributors).toHaveLength(0);
      await request(app)
        .post(`/admin/hacks/${hackRes.body.data.id}/contribution`)
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send({
          characterId: dadeRes.body.data.id,
          hackId: hackRes.body.data.id,
        });
      await request(app)
        .post(`/admin/hacks/${hackRes.body.data.id}/contribution`)
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send({
          characterId: kateRes.body.data.id,
          hackId: hackRes.body.data.id,
        });

      const newHackRes = await request(app)
        .get(`/api/v1/hacks/${hackRes.body.data.id}`)
        .auth(userRes.body.data.token, { type: 'bearer' });

      expect(newHackRes.body.data.contributors).toHaveLength(2);
    });
  });
  describe('DELETE /admin/hacks/:id', () => {
    it('Should return a 401 status for non-admin users', async () => {
      const userRes = await request(app).post('/user').send({
        username: 'test',
        password: 'test',
      });

      await updateUserRole({ userId: userRes.body.data.id, role: 'ADMIN' });

      const orgRes = await createTestOrganization({
        authToken: userRes.body.data.token,
        name: 'Test Organization',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
      });

      const hackRes = await request(app)
        .post('/admin/hacks')
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send({
          title: 'test_hack',
          description: 'test_description',
          targetOrganizationId: orgRes.body.data.id,
        });

      await updateUserRole({ userId: userRes.body.data.id, role: 'USER' });

      const res = await request(app)
        .del(`/admin/hacks/${hackRes.body.data.id}`)
        .auth(userRes.body.data.token, { type: 'bearer' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Not authorized.');
    });

    it('Should return a 200 status and success message', async () => {
      const userRes = await request(app).post('/user').send({
        username: 'test',
        password: 'test',
      });

      await updateUserRole({ userId: userRes.body.data.id, role: 'ADMIN' });

      const orgRes = await createTestOrganization({
        authToken: userRes.body.data.token,
        name: 'Test Organization',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
      });

      const hackRes = await request(app)
        .post('/admin/hacks')
        .auth(userRes.body.data.token, { type: 'bearer' })
        .send({
          title: 'test_hack',
          description: 'test_description',
          targetOrganizationId: orgRes.body.data.id,
        });

      const res = await request(app)
        .del(`/admin/hacks/${hackRes.body.data.id}`)
        .auth(userRes.body.data.token, { type: 'bearer' });
      expect(res.status).toBe(200);
      expect(res.body.data.message).toEqual('Hack deleted successfully.');

      const getRes = await request(app)
        .get(`/api/v1/hacks/${hackRes.body.data.id}`)
        .auth(userRes.body.data.token, { type: 'bearer' });
      expect(getRes.status).toBe(404);
      expect(getRes.body.data.message).toBe('This hack does not exist.');
    });
  });
});
