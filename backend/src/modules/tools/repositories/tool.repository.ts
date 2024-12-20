import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Tool } from '../entities/tool.entity';
import { ulid } from 'ulid';

@Injectable()
export class ToolRepository {
  constructor(private readonly db: DatabaseService) {}

  async create(tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tool> {
    const now = new Date();
    const [created] = await this.db
      .knex('tools')
      .insert({
        id: ulid(),
        title: tool.title,
        description: tool.description,
        image_url: tool.imageUrl,
        owner_id: tool.ownerId,
        created_at: now,
        updated_at: now,
      })
      .returning('*');

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<Tool | null> {
    const tool = await this.db.knex('tools').where({ id }).first();
    return tool ? this.mapToEntity(tool) : null;
  }

  async findByOwnerId(ownerId: string): Promise<Tool[]> {
    const tools = await this.db.knex('tools').where({ owner_id: ownerId });
    return tools.map(this.mapToEntity);
  }

  async update(id: string, tool: Partial<Tool>): Promise<Tool | null> {
    const [updated] = await this.db
      .knex('tools')
      .where({ id })
      .update({
        ...(tool.title && { title: tool.title }),
        ...(tool.description && { description: tool.description }),
        ...(tool.imageUrl && { image_url: tool.imageUrl }),
        ...(tool.ownerId && { owner_id: tool.ownerId }),
        updated_at: new Date(),
      })
      .returning('*');

    return updated ? this.mapToEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db.knex('tools').where({ id }).delete();
    return deleted > 0;
  }

  private mapToEntity(raw: any): Tool {
    return new Tool({
      id: raw.id,
      title: raw.title,
      description: raw.description,
      imageUrl: raw.image_url,
      ownerId: raw.owner_id,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }
}