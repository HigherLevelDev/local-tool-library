import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../src/modules/database/database.module';
import { DatabaseService } from '../../src/modules/database/database.service';
import { ToolRepository } from '../../src/modules/tools/repositories/tool.repository';
import { Tool } from '../../src/modules/tools/entities/tool.entity';
import { createTestUser } from '../utils/test-auth';

describe('Tools (e2e)', () => {
  let app: INestApplication;
  let toolRepository: ToolRepository;
  let testUserId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        DatabaseModule,
      ],
      providers: [ToolRepository],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    toolRepository = moduleRef.get<ToolRepository>(ToolRepository);
    const testUser = await createTestUser(app);
    testUserId = testUser.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create and retrieve a tool', async () => {
    // Create a tool
    const toolData = {
      title: 'Test Tool',
      description: 'A test tool description',
      imageUrl: 'https://example.com/test.jpg',
      ownerId: testUserId,
      latitude: 51.5074,
      longitude: -0.1278,
    };

    const created = await toolRepository.create(toolData);
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.title).toBe(toolData.title);

    // Retrieve the tool
    const retrieved = await toolRepository.findById(created.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.title).toBe(toolData.title);

    // Update the tool
    const updated = await toolRepository.update(created.id, {
      title: 'Updated Tool',
    });
    expect(updated).toBeDefined();
    expect(updated?.title).toBe('Updated Tool');

    // Delete the tool
    const deleted = await toolRepository.delete(created.id);
    expect(deleted).toBe(true);

    // Verify deletion
    const notFound = await toolRepository.findById(created.id);
    expect(notFound).toBeNull();
  });

  it('should find tools by owner ID', async () => {
    // Create multiple tools for the test user
    const toolsData = [
      {
        title: 'Tool 1',
        description: 'Description 1',
        imageUrl: 'https://example.com/1.jpg',
        ownerId: testUserId,
        latitude: 51.5074,
        longitude: -0.1278,
      },
      {
        title: 'Tool 2',
        description: 'Description 2',
        imageUrl: 'https://example.com/2.jpg',
        ownerId: testUserId,
        latitude: 51.5074,
        longitude: -0.1278,
      },
    ];

    const createdTools = await Promise.all(
      toolsData.map(data => toolRepository.create(data))
    );

    // Find tools by owner
    const ownerTools = await toolRepository.findByOwnerId(testUserId);
    expect(ownerTools).toHaveLength(2);
    expect(ownerTools[0].ownerId).toBe(testUserId);
    expect(ownerTools[1].ownerId).toBe(testUserId);

    // Cleanup
    await Promise.all(
      createdTools.map(tool => toolRepository.delete(tool.id))
    );
  });
});