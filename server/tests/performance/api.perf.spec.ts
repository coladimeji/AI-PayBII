// Location: AI-PayBii/server/src/tests/performance/api.perf.spec.ts
import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
import { setupTestDB, teardownTestDB } from '../helpers/setup';
import { Application } from 'express';

chai.use(chaiHttp);

describe('API Performance Tests', () => {
  let app: Application;
  let authToken: string;

  before(async () => {
    app = await setupTestDB();
    // Setup auth token as before
  });

  after(async () => {
    await teardownTestDB();
  });

  describe('Test Creation Performance', () => {
    it('should handle bulk test creation efficiently', async () => {
      const startTime = process.hrtime();
      const numberOfTests = 100;
      const promises = [];

      for (let i = 0; i < numberOfTests; i++) {
        const testData = {
          name: `Performance Test ${i}`,
          description: 'Performance testing',
          type: 'unit'
        };

        promises.push(
          chai
            .request(app)
            .post('/api/tests')
            .set('Authorization', `Bearer ${authToken}`)
            .send(testData)
        );
      }

      await Promise.all(promises);
      const endTime = process.hrtime(startTime);
      const duration = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds

      expect(duration).to.be.below(5000); // Should complete within 5 seconds
    });
  });

  describe('Concurrent Test Execution', () => {
    it('should handle multiple concurrent test executions', async () => {
      const concurrentTests = 10;
      const startTime = process.hrtime();
      const promises = [];

      for (let i = 0; i < concurrentTests; i++) {
        promises.push(
          chai
            .request(app)
            .post('/api/tests/execute-batch')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ testIds: [`test-${i}`] })
        );
      }

      await Promise.all(promises);
      const endTime = process.hrtime(startTime);
      const duration = endTime[0] * 1000 + endTime[1] / 1000000;

      expect(duration).to.be.below(3000); // Should complete within 3 seconds
    });
  });
});