// Location: AI-PayBii/server/src/tests/integration/auth.spec.ts
import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
import { setupTestDB, teardownTestDB, clearTestDB } from '../helpers/setup';
import { Application } from 'express';

chai.use(chaiHttp);

describe('Auth Integration Tests', () => {
  let app: Application;

  before(async () => {
    app = await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
      };

      const res = await chai
        .request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('token');
      expect(res.body.data.user).to.have.property('email', userData.email);
    });

    it('should fail to register with existing email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
      };

      // First registration
      await chai
        .request(app)
        .post('/api/auth/register')
        .send(userData);

      // Second registration with same email
      const res = await chai
        .request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('status', 'error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
      };

      await chai
        .request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const res = await chai
        .request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
    });

    it('should fail to login with incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123!'
      };

      const res = await chai
        .request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('status', 'error');
    });
  });
});