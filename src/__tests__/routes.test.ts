import supertest from 'supertest';
import { User } from '@prisma/client';
import { prismaMock } from '../singleton';
import app from '../server';
import prisma from '../db';

const userPayload: User = {
  id: '1',
  username: 'test',
  password: 'testpassword',
  createdAt: new Date(),
  role: 'USER',
};

const adminPayload: User = {
  id: '2',
  username: 'admin',
  password: 'adminpassword',
  createdAt: new Date(),
  role: 'ADMIN',
};

describe('GET /api/v1/characters', () => {
  it('returns a 401 when no token is provided.', async () => {
    await supertest(app).get('/api/v1/characters').expect(401);
  });

  it('returns a 401 for requests made with invalid tokens', async () => {
    await supertest(app)
      .get('/api/v1/characters')
      .auth('some_token', { type: 'bearer' })
      .expect(401);
  });

  it('returns a 200 for requests made with valid tokens', async () => {
    const userRes = await supertest(app)
      .post('/user')
      .send(userPayload)
      .expect(200);
    const token = userRes.body.data.token;

    await supertest(app)
      .get('/api/v1/characters')
      .auth(token, { type: 'bearer' })
      .expect(200);
  });
});

describe('GET /api/v1/organizations', () => {
  it('returns a 401 when no token is provided.', async () => {
    await supertest(app).get('/api/v1/organizations').expect(401);
  });

  it('returns a 401 for requests made with invalid tokens', async () => {
    await supertest(app)
      .get('/api/v1/organizations')
      .auth('some_token', { type: 'bearer' })
      .expect(401);
  });

  it('returns a 200 for requests made with valid tokens', async () => {
    const userRes = await supertest(app)
      .post('/user')
      .send(userPayload)
      .expect(200);
    const token = userRes.body.data.token;

    await supertest(app)
      .get('/api/v1/organizations')
      .auth(token, { type: 'bearer' })
      .expect(200);
  });
});

describe('GET /api/v1/hacks', () => {
  it('returns a 401 when no token is provided.', async () => {
    await supertest(app).get('/api/v1/hacks').expect(401);
  });

  it('returns a 401 for requests made with invalid tokens', async () => {
    await supertest(app)
      .get('/api/v1/hacks')
      .auth('some_token', { type: 'bearer' })
      .expect(401);
  });

  it('returns a 200 for requests made with valid tokens', async () => {
    const userRes = await supertest(app)
      .post('/user')
      .send(userPayload)
      .expect(200);
    const token = userRes.body.data.token;

    await supertest(app)
      .get('/api/v1/hacks')
      .auth(token, { type: 'bearer' })
      .expect(200);
  });
});

describe('GET /api/v1/quotes', () => {
  it('returns a 401 when no token is provided.', async () => {
    await supertest(app).get('/api/v1/quotes').expect(401);
  });

  it('returns a 401 for requests made with invalid tokens', async () => {
    await supertest(app)
      .get('/api/v1/quotes')
      .auth('some_token', { type: 'bearer' })
      .expect(401);
  });

  it('returns a 200 for requests made with valid tokens', async () => {
    const userRes = await supertest(app)
      .post('/user')
      .send(userPayload)
      .expect(200);
    const token = userRes.body.data.token;

    await supertest(app)
      .get('/api/v1/quotes')
      .auth(token, { type: 'bearer' })
      .expect(200);
  });
});

describe('POST /api/v1/admin/authorize', () => {
  it('returns a 401 when no token is provided.', async () => {
    await supertest(app).put('/api/v1/admin/authorize').expect(401);
  });

  it('returns a 401 for requests made with invalid tokens', async () => {
    await supertest(app)
      .put('/api/v1/admin/authorize')
      .auth('some_token', { type: 'bearer' })
      .expect(401);
  });

  it('returns a 401 for requests made with non-admin tokens', async () => {
    const userRes = await supertest(app)
      .post('/user')
      .send(userPayload)
      .expect(200);
    const token = userRes.body.token;

    await supertest(app)
      .put('/api/v1/admin/authorize')
      .auth(token, { type: 'bearer' })
      .expect(401);
  });

  it('returns a 200 for requests made with admin tokens', async () => {
    const adminUser = await supertest(app)
      .post('/user')
      .send(adminPayload)
      .expect(200);

    await supertest(app)
      .put('/api/v1/admin/authorize')
      .auth(adminUser.body.data.token, { type: 'bearer' })
      .expect(200);

    const adminToken = adminUser.body.data.token;
    console.log(process.env.ADMIN_TOKEN);
  });
});
