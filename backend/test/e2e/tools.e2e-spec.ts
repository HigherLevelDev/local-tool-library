import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { RestClient } from '../utils/rest-client';
import { ensureTestUser, TestUser } from '../utils/test-auth';

describe('Tools Management (e2e)', () => {
  let app: INestApplication;
  let client: RestClient;
  let testUser: TestUser;
  let createdToolId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    client = new RestClient(app);
    
    // Create test user and get auth token
    testUser = await ensureTestUser(client, 'tooltest@example.com');
    client.setAuthToken(testUser.accessToken);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Tool Creation', () => {
    it('should create a new tool', async () => {
      const createToolDto = {
        title: 'Power Drill',
        description: 'Professional grade power drill with multiple attachments',
        latitude: 51.5074,
        longitude: -0.1278
      };

      const response = await client.post('/api/tools', createToolDto);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(createToolDto.title);
      expect(response.body.description).toBe(createToolDto.description);
      expect(response.body.latitude).toBe(createToolDto.latitude);
      expect(response.body.longitude).toBe(createToolDto.longitude);
      expect(response.body.ownerId).toBe(testUser.id);

      createdToolId = response.body.id;
    });
  });

  describe('Tool Retrieval', () => {
    it('should get user\'s tools', async () => {
      const response = await client.get('/api/tools/my-tools');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
    });

    it('should get a specific tool by ID', async () => {
      const response = await client.get(`/api/tools/${createdToolId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdToolId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('description');
    });
  });

  describe('Tool Update', () => {
    it('should update an existing tool', async () => {
      const updateToolDto = {
        title: 'Updated Power Drill',
        description: 'Updated description with new features',
        latitude: 51.5075,
        longitude: -0.1279
      };

      const response = await client.put(`/api/tools/${createdToolId}`, updateToolDto);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', createdToolId);
      expect(response.body.title).toBe(updateToolDto.title);
      expect(response.body.description).toBe(updateToolDto.description);
      expect(response.body.latitude).toBe(updateToolDto.latitude);
      expect(response.body.longitude).toBe(updateToolDto.longitude);
    });
  });

  describe('Tool Deletion', () => {
    it('should delete a tool', async () => {
      const response = await client.delete(`/api/tools/${createdToolId}`);
      expect(response.status).toBe(200);

      // Verify tool is deleted
      const getResponse = await client.get(`/api/tools/${createdToolId}`);
      expect(getResponse.status).toBe(404);
    });
  });
});