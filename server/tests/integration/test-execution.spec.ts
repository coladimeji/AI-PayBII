// Location: AI-PayBii/server/src/tests/integration/test-execution.spec.ts
import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
import { setupTestDB, teardownTestDB, clearTestDB } from '../helpers/setup';
import { Application } from 'express';

chai.use(chaiHttp);

describe('Test Execution Integration Tests', () => {
  let app: Application;
  let authToken: string;

  before(async () => {
    app = await setupTestDB();
    
    // Register and login to get auth token
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User'
    };

    await chai
      .request(app)
      .post('/api/auth/register')
      .send(userData);

    const loginRes = await chai
      .request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    authToken = loginRes.body.token;
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('Protected Routes - Test Creation', () => {
    it('should create test with valid token', async () => {
      const testData = {
        name: 'Integration Test Suite',
        description: 'Testing API endpoints',
        type: 'integration'
      };

      const res = await chai
        .request(app)
        .post('/api/tests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testData);

      expect(res).to.have.status(201);
      expect(res.body.data.test).to.have.property('name', testData.name);
    });

    it('should fail without auth token', async () => {
      const testData = {
        name: 'Integration Test Suite',
        description: 'Testing API endpoints',
        type: 'integration'
      };

      const res = await chai
        .request(app)
        .post('/api/tests')
        .send(testData);

      expect(res).to.have.status(401);
    });
  });

  describe('Test Execution Flow', () => {
    let testId: string;

    beforeEach(async () => {
      // Create a test first
      const testData = {
        name: 'Flow Test Suite',
        description: 'Testing execution flow',
        type: 'integration'
      };

      const res = await chai
        .request(app)
        .post('/api/tests')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testData);

      testId = res.body.data.test._id;
    });

    it('should execute test and update status', async () => {
      const res = await chai
        .request(app)
        .post(`/api/tests/${testId}/execute`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body.data.test).to.have.property('status', 'running');
    });

    it('should get test results', async () => {
      const res = await chai
        .request(app)
        .get(`/api/tests/${testId}/results`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res).to.have.status(200);
      expect(res.body.data).to.have.property('results');
    });
  });
});