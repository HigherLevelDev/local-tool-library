import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { RestClient } from '../utils/rest-client';
import { TestAuth } from '../utils/test-auth';
import { Tool } from '../../src/modules/tools/entities/tool.entity';
import { CreateToolDto } from '../../src/modules/tools/dto/create-tool.dto';
import { UpdateToolDto } from '../../src/modules/tools/dto/update-tool.dto';

describe('Tools (e2e)', () => {
  let app: INestApplication;
  let restClient: RestClient;
  let testAuth: TestAuth;
  let testUserId: string;
  let testToken: string;
  let createdTool: Tool;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    restClient = new RestClient(app);
    testAuth = new TestAuth(restClient);

    // Create test user and get token
    const auth = await testAuth.createTestUserAndLogin();
    testUserId = auth.userId;
    testToken = auth.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/tools', () => {
    it('should create a new tool', async () => {
      const createToolDto: CreateToolDto = {
        title: 'Power Drill',
        description: 'A powerful cordless drill',
        latitude: 45.5231,
        longitude: -122.6765,
      };

      const response = await restClient.post('/api/tools')
        .set('Authorization', `Bearer ${testToken}`)
        .send(createToolDto);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: createToolDto.title,
        description: createToolDto.description,
        latitude: createToolDto.latitude,
        longitude: createToolDto.longitude,
        ownerId: testUserId,
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.imageUrl).toBeDefined();

      createdTool = response.body;
    });
  });

  describe('GET /api/tools/my-tools', () => {
    it('should return user\'s tools', async () => {
      const response = await restClient.get('/api/tools/my-tools')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toMatchObject({
        id: createdTool.id,
        title: createdTool.title,
      });
    });
  });

  describe('PUT /api/tools/:id', () => {
    it('should update a tool', async () => {
      const updateToolDto: UpdateToolDto = {
        title: 'Updated Power Drill',
        description: 'An updated powerful cordless drill',
      };

      const response = await restClient.put(`/api/tools/${createdTool.id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send(updateToolDto);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: createdTool.id,
        title: updateToolDto.title,
        description: updateToolDto.description,
      });
    });

    it('should not allow updating another user\'s tool', async () => {
      // Create another user and get their token
      const otherAuth = await testAuth.createTestUserAndLogin();
      const otherToken = otherAuth.token;

      const updateToolDto: UpdateToolDto = {
        title: 'Should Not Update',
      };

      const response = await restClient.put(`/api/tools/${createdTool.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send(updateToolDto);

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/tools/:id', () => {
    it('should not allow deleting another user\'s tool', async () => {
      const otherAuth = await testAuth.createTestUserAndLogin();
      const otherToken = otherAuth.token;

      const response = await restClient.delete(`/api/tools/${createdTool.id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
    });

    it('should delete a tool', async () => {
      const response = await restClient.delete(`/api/tools/${createdTool.id}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);

      // Verify tool is deleted
      const getResponse = await restClient.get(`/api/tools/${createdTool.id}`)
        .set('Authorization', `Bearer ${testToken}`);
      expect(getResponse.status).toBe(404);
    });
  });
});