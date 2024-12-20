import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { RestClient } from '../utils/rest-client';
import { ensureTestUser } from '../utils/test-auth';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let client: RestClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    client = new RestClient(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Registration Flow', () => {
    const testEmail = 'newuser@example.com';

    it('should successfully register a new user', async () => {
      const response = await client.post('/api/auth/signup', {
        email: testEmail,
        name: 'New User',
        password: 'Password123!',
        phone: '+1234567890',
        postcode: 'AB12CD'
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user_id');
    });

    it('should reject registration with duplicate email and wrong password', async () => {
      const response = await client.post('/api/auth/signup', {
        email: testEmail,
        name: 'Duplicate User',
        password: 'WrongPassword123!',
        phone: '+1234567890',
        postcode: 'AB12CD'
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('already registered');
    });

    it('should reject registration with missing required fields', async () => {
      const response = await client.post('/api/auth/signup', {
        email: 'test@example.com',
        name: 'Test User'
        // Missing password, phone, and postcode
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('required');
    });

    it('should reject registration with invalid input data', async () => {
      const response = await client.post('/api/auth/signup', {
        email: 'invalid-email',
        name: '',
        password: '123',
        phone: 'invalid',
        postcode: ''
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('All fields are required');
    });
  });

  describe('Login Flow', () => {
    const testEmail = 'logintest@example.com';
    const testPassword = 'test1234';

    beforeAll(async () => {
      // Create a test user for login tests
      await client.post('/api/auth/signup', {
        email: testEmail,
        name: 'Login Test User',
        password: testPassword,
        phone: '+1234567890',
        postcode: 'AB12CD'
      });
    });

    it('should successfully login with valid credentials', async () => {
      const response = await client.post('/api/auth/token', {
        email: testEmail,
        password: testPassword,
        grant_type: 'password'
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('access_token');
      expect(typeof response.body.access_token).toBe('string');
    });

    it('should reject login with invalid password', async () => {
      const response = await client.post('/api/auth/token', {
        email: testEmail,
        password: 'wrongpassword',
        grant_type: 'password'
      });

      expect(response.status).toBe(401);
    });

    it('should reject login with non-existent email', async () => {
      const response = await client.post('/api/auth/token', {
        email: 'nonexistent@example.com',
        password: testPassword,
        grant_type: 'password'
      });

      expect(response.status).toBe(401);
    });
  });

  describe('Protected Routes', () => {
    let accessToken: string;
    let userId: string;

    beforeAll(async () => {
      // Create a test user
      const signupResponse = await client.post('/api/auth/signup', {
        email: 'protected@example.com',
        name: 'Protected User',
        password: 'test1234',
        phone: '+1234567890',
        postcode: 'AB12CD'
      });

      accessToken = signupResponse.body.access_token;
      userId = signupResponse.body.user.id;
    });

    it('should access protected route with valid token', async () => {
      client.setAuthToken(accessToken);
      const response = await client.get('/api/users/me');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email', 'protected@example.com');
    });

    it('should reject access to protected route without token', async () => {
      client.clearAuthToken();
      const response = await client.get('/api/users/me');

      expect(response.status).toBe(401);
    });

    it('should reject access with invalid token', async () => {
      client.setAuthToken('invalid.token.here');
      const response = await client.get('/api/users/me');

      expect(response.status).toBe(401);
    });
  });
});