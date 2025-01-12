// Location: AI-PayBii/server/src/tests/unit/auth.spec.ts
import { expect } from 'chai';
import { User } from '../../models/user.model';
import { setupTestDB, teardownTestDB, clearTestDB } from '../helpers/setup';

describe('Auth Unit Tests', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('User Model', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
      };

      const user = await User.create(userData);
      expect(user).to.have.property('email', userData.email);
      expect(user).to.have.property('name', userData.name);
      expect(user.password).to.not.equal(userData.password); // Password should be hashed
    });

    it('should fail to create user with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Password123!',
        name: 'Test User'
      };

      try {
        await User.create(userData);
        expect.fail('Should not create user with invalid email');
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });
});