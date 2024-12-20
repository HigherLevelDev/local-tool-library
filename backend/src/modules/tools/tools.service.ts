import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ToolRepository } from './repositories/tool.repository';
import { ImageSearchService } from './services/image-search.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { Tool } from './entities/tool.entity';
import { UserService } from '../auth/services/user.service';

@Injectable()
export class ToolsService {
  constructor(
    private readonly toolRepository: ToolRepository,
    private readonly imageSearchService: ImageSearchService,
    private readonly userService: UserService,
  ) {}

  async createTool(userId: string, createToolDto: CreateToolDto): Promise<Tool> {
    const imageUrl = await this.imageSearchService.searchToolImage(createToolDto.title);
    
    // Get user's postcode for location
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return this.toolRepository.create({
      ...createToolDto,
      ownerId: userId,
      imageUrl,
    });
  }

  async updateTool(userId: string, toolId: string, updateToolDto: UpdateToolDto): Promise<Tool> {
    const tool = await this.toolRepository.findById(toolId);
    if (!tool) {
      throw new NotFoundException('Tool not found');
    }

    if (tool.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own tools');
    }

    // If title is updated, search for a new image
    const imageUrl = updateToolDto.title 
      ? await this.imageSearchService.searchToolImage(updateToolDto.title)
      : undefined;

    const updated = await this.toolRepository.update(toolId, {
      ...updateToolDto,
      ...(imageUrl && { imageUrl }),
    });

    if (!updated) {
      throw new NotFoundException('Tool not found');
    }

    return updated;
  }

  async deleteTool(userId: string, toolId: string): Promise<void> {
    const tool = await this.toolRepository.findById(toolId);
    if (!tool) {
      throw new NotFoundException('Tool not found');
    }

    if (tool.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own tools');
    }

    const deleted = await this.toolRepository.delete(toolId);
    if (!deleted) {
      throw new NotFoundException('Tool not found');
    }
  }

  async getUserTools(userId: string): Promise<Tool[]> {
    return this.toolRepository.findByOwnerId(userId);
  }

  async getToolById(toolId: string): Promise<Tool> {
    const tool = await this.toolRepository.findById(toolId);
    if (!tool) {
      throw new NotFoundException('Tool not found');
    }
    return tool;
  }

  async searchTools(searchTerm: string, page: number = 1, limit: number = 10) {
    return this.toolRepository.search(searchTerm, page, limit);
  }
}