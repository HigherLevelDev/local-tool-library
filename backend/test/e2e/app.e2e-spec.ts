import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { SwaggerService } from '../../src/modules/swagger/swagger.service';
import { RestClient } from '../utils/rest-client';
import { ensureTestUser } from '../utils/test-auth';
import { TestLogger } from '../utils/test-logger';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let client: RestClient;
  let logger: TestLogger;

  beforeEach(async () => {
    logger = new TestLogger();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(logger);
      
    // Set up Swagger documentation
    const swaggerService = app.get(SwaggerService);
    swaggerService.setup(app);
    
    await app.init();
    client = new RestClient(app);
  });

  afterEach(async () => {
    await app.close();
    await logger.close();
  });

  it('/api/monitoring/health (GET)', async () => {
    const response = await client.get('/api/monitoring/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  describe('Authentication', () => {
    it('should support user registration', async () => {
      const email = `test${Date.now()}@example.com`;
      const signupResponse = await client.post('/api/auth/signup', {
        email,
        name: 'Test User',
        password: 'test1234',
        phone: '+1234567890',
        postcode: 'AB12CD'
      });
      expect(signupResponse.status).toBe(201);
      expect(signupResponse.body.access_token).toBeDefined();
      expect(signupResponse.body.user_id).toBeDefined();
    });

    it('should reject invalid registration data', async () => {
      const response = await client.post('/api/auth/signup', {
        email: 'not-an-email',
        name: '',
        password: '123',
        phone: '123',
        postcode: '1'
      });
      expect(response.status).toBe(400);
    });

    it('should support user authentication flow', async () => {
    const testUser = await ensureTestUser(client);
    expect(testUser.id).toBeDefined();
    expect(testUser.accessToken).toBeDefined();

    // Verify can get token with password grant
    const authResponse = await client.post('/api/auth/token', {
      email: testUser.email,
      password: 'test1234',
      grant_type: 'password'
    });
    expect(authResponse.status).toBe(201);
    expect(authResponse.body.access_token).toBeDefined();
    expect(authResponse.body.user_id).toBe(testUser.id);
  });

    it('should support user logout', async () => {
      const testUser = await ensureTestUser(client);
      
      // First login
      const authResponse = await client.post('/api/auth/token', {
        email: testUser.email,
        password: 'test1234',
        grant_type: 'password'
      });
      expect(authResponse.status).toBe(201);
      
      // Then logout
      client.setAuthToken(authResponse.body.access_token);
      const logoutResponse = await client.post('/api/auth/logout', {});
      expect(logoutResponse.status).toBe(200);
      
      // Clear token to simulate invalidated token
      client.clearAuthToken();
      
      // Verify token is invalidated
      const protectedResponse = await client.get('/api/users/me');
      expect(protectedResponse.status).toBe(401);
    });
  });

  it('/api/docs-json (GET) should return valid OpenAPI schema', async () => {
    const response = await client.get('/api/docs-json');
    expect(response.status).toBe(200);
    
    const schema = response.body;
    // Verify basic OpenAPI schema structure
    expect(schema).toBeDefined();
    expect(schema.openapi).toBeDefined();
    expect(schema.info).toBeDefined();
    expect(schema.paths).toBeDefined();
    
    // Verify version follows semantic versioning
    expect(schema.openapi).toMatch(/^3\.\d+\.\d+$/);
    
    // Verify required OpenAPI fields
    expect(schema.info.title).toBe('API Documentation');
    expect(schema.info.version).toBe('1.0');
    
    // Verify we have some documented endpoints
    expect(Object.keys(schema.paths)).toContain('/api/monitoring/health');
    expect(Object.keys(schema.paths)).toContain('/api/auth/token');
  });
});
