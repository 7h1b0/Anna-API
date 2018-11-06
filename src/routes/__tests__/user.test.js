import request from 'supertest';
import createUser from 'createUser';
import knex from '../../knexClient';
import * as User from '../../modules/models/user';
import app from '../..';

const user = createUser();

describe('User API', () => {
  beforeAll(async () => {
    await knex(User.TABLE).truncate();
  });

  beforeEach(async () => {
    await knex(User.TABLE).insert(user);
  });

  afterEach(async () => {
    await knex(User.TABLE).truncate();
  });

  describe('/register', () => {
    it('should return 400 if the request is malformed', async () => {
      const response = await request(app)
        .post('/register')
        .set('Accept', 'application/json')
        .send({ username: 'teste2e' });

      expect(response.status).toBeBadRequest();
    });

    it('should return the new User and create user in database', async () => {
      const response = await request(app)
        .post('/register')
        .set('Accept', 'application/json')
        .send({ username: 'teste2e', password: 'anna' });

      expect(response.status).toHaveStatusOk();
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).toHaveProperty('username', 'teste2e');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('userId');

      const users = await knex(User.TABLE)
        .first()
        .where('userId', response.body.userId);

      expect(users).toHaveProperty('username', response.body.username);
      expect(users).toHaveProperty('token', response.body.token);
      expect(users.password).not.toBe('anna');
    });
  });

  describe('/login', () => {
    it('should retun the token', async () => {
      const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ username: 'test', password: 'anna' });

      expect(response.body).toEqual({
        token: user.token,
      });
    });

    it('should return 403 when providing a fake password', async () => {
      const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ username: 'test', password: 'fake' });

      expect(response.status).toBe(403);
    });

    it('should return 403 when providing a fake username', async () => {
      const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ username: 'fake', password: 'test' });

      expect(response.status).toBe(403);
    });

    it('should return 400 body is invalid', async () => {
      const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ name: 'fake', password: 'test' });

      expect(response.status).toBeBadRequest();
    });
  });

  describe('api/users', () => {
    describe('GET', () => {
      it('should retun 200 when user is authenticated', async () => {
        const response = await request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send();

        expect(response.body).toEqual([
          {
            username: user.username,
            userId: user.userId,
          },
        ]);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/users')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake')
          .send();

        expect(response.status).toBeUnauthorized();
      });
    });
  });

  describe('api/users/id', () => {
    describe('DELETE', () => {
      it('should delete target user when user is authenticated', async () => {
        const response = await request(app)
          .delete(`/api/users/${user.userId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send();

        expect(response.status).toHaveStatusOk();
        const users = await knex(User.TABLE).select();
        expect(users).toHaveLength(0);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete(`/api/users/${user.userId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake')
          .send();

        expect(response.status).toBeUnauthorized();
      });
    });

    describe('PATCH', () => {
      it('should do not update username', async () => {
        const response = await request(app)
          .patch(`/api/users/${user.userId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({ username: 'test_changed', password: 'anna' });

        expect(response.status).toHaveStatusOk();
        const users = await knex(User.TABLE)
          .first()
          .where('userId', user.userId);

        expect(users).toHaveProperty('username', user.username);
      });

      it('should update password', async () => {
        const response = await request(app)
          .patch(`/api/users/${user.userId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({ username: 'test', password: 'toto' });

        expect(response.status).toHaveStatusOk();
        const users = await knex(User.TABLE).select();
        expect(users).toHaveLength(1);

        const { password, username, userId, token } = users[0];
        expect(password !== user.password).toBeTruthy();
        expect(userId).toBe(user.userId);
        expect(username).toBe(user.username);
        expect(token).toBe(user.token);
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch(`/api/users/${user.userId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake')
          .send();

        expect(response.status).toBeUnauthorized();
      });

      it('should retun 400 if body is invalid', async () => {
        const response = await request(app)
          .patch(`/api/users/${user.userId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send();

        expect(response.status).toBeBadRequest();
      });
    });
  });
});
