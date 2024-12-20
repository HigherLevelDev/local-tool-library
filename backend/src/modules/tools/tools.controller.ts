import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { Tool } from './entities/tool.entity';

@ApiTags('tools')
@Controller('api/tools')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tool' })
  @ApiResponse({ status: 201, description: 'Tool created successfully', type: Tool })
  async createTool(@Request() req, @Body() createToolDto: CreateToolDto): Promise<Tool> {
    return this.toolsService.createTool(req.user.id, createToolDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a tool' })
  @ApiResponse({ status: 200, description: 'Tool updated successfully', type: Tool })
  async updateTool(
    @Request() req,
    @Param('id') id: string,
    @Body() updateToolDto: UpdateToolDto,
  ): Promise<Tool> {
    return this.toolsService.updateTool(req.user.id, id, updateToolDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tool' })
  @ApiResponse({ status: 200, description: 'Tool deleted successfully' })
  async deleteTool(@Request() req, @Param('id') id: string): Promise<void> {
    await this.toolsService.deleteTool(req.user.id, id);
  }

  @Get('my-tools')
  @ApiOperation({ summary: 'Get all tools owned by the current user' })
  @ApiResponse({ status: 200, description: 'List of user\'s tools', type: [Tool] })
  async getMyTools(@Request() req): Promise<Tool[]> {
    return this.toolsService.getUserTools(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tool by ID' })
  @ApiResponse({ status: 200, description: 'Tool details', type: Tool })
  async getToolById(@Param('id') id: string): Promise<Tool> {
    return this.toolsService.getToolById(id);
  }
}