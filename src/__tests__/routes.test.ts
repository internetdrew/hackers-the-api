import supertest from 'supertest';
import prisma from '../db';
import app from '../server';
import { User } from '@prisma/client';

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

let token: string;

beforeAll(async () => {
  await prisma.character.createMany({
    data: [
      {
        id: 1,
        name: 'Test Character 1',
        knownAliases: ['Test Character 1', 'Test Character 001'],
        imageUrl: 'https://example.com/image.jpg',
        bio: 'Hey, I am a test character. Call me #1!',
        skillLevel: 'BEGINNER',
      },
      {
        id: 2,
        name: 'Test Character 2',
        knownAliases: ['Test Character 2', 'Test Character 002'],
        imageUrl: 'https://example.com/image.jpg',
        bio: 'Hey, I am a test character. Call me #2!',
        skillLevel: 'ADVANCED',
      },
    ],
  });
});

afterAll(async () => {
  const deleteChars = prisma.character.deleteMany();
  const deleteUsers = prisma.user.deleteMany();
  await prisma.$transaction([deleteChars, deleteUsers]);
  await prisma.$disconnect();
});
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
    const token = userRes.body.token;

    await supertest(app)
      .get('/api/v1/characters')
      .auth(token, { type: 'bearer' })
      .expect(200);
  });
});
