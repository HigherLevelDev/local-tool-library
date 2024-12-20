import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { ToolRepository } from './repositories/tool.repository';
import { ImageSearchService } from './services/image-search.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import imageSearchConfig from './config/image-search.config';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forFeature(imageSearchConfig),
    AuthModule,
  ],
  controllers: [ToolsController],
  providers: [ToolsService, ToolRepository, ImageSearchService],
  exports: [ToolsService, ImageSearchService],
})
export class ToolsModule {}