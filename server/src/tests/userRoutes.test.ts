import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../server';

describe('POST /user', () => {
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
    await request(app).post('/user').send({
      username: 'test_user_X',
      password: 'password',
    });
    const userX2 = await request(app).post('/user').send({
      username: 'test_user_X',
      password: 'password2',
    });
    expect(userX2.status).toBe(409);
  });

  it('should respond with error message for each missing value', async () => {
    const res = await request(app).post('/user').send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveLength(2);
  });
});

describe('POST /login', () => {
  it('should return a 200 and a token when a user logs in', async () => {
    await request(app).post('/user').send({
      username: 'typicalUser',
      password: 'weakpassword123',
    });
    const response = await request(app).post('/login').send({
      username: 'typicalUser',
      password: 'weakpassword123',
    });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  it('should return a 401 when a user logs in with invalid credentials', async () => {
    await request(app).post('/user').send({
      username: 'typicalUser',
      password: 'weakpassword 123',
    });
    const response = await request(app).post('/login').send({
      username: 'typicalUser',
      password: 'wrongpassword',
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials.');
  });

  it('should respond with error message for each missing value', async () => {
    const res = await request(app).post('/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveLength(2);
  });
});
