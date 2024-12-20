import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageSearchService } from './services/image-search.service';
import imageSearchConfig from './config/image-search.config';

@Module({
  imports: [
    ConfigModule.forFeature(imageSearchConfig),
  ],
  providers: [ImageSearchService],
  exports: [ImageSearchService],
})
export class ToolsModule {}