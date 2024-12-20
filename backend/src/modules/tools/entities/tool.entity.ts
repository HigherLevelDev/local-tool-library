import { ApiProperty } from '@nestjs/swagger';

export class Tool {
  @ApiProperty({ description: 'Unique identifier (ULID)' })
  id: string;

  @ApiProperty({ description: 'Tool title' })
  title: string;

  @ApiProperty({ description: 'Tool description' })
  description: string;

  @ApiProperty({ description: 'URL to tool image' })
  imageUrl: string;

  @ApiProperty({ description: 'Owner user ID' })
  ownerId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  constructor(partial: Partial<Tool>) {
    Object.assign(this, partial);
  }
}