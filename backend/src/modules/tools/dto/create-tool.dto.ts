import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateToolDto {
  @ApiProperty({ description: 'Tool title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Tool description' })
  @IsString()
  @IsNotEmpty()
  description: string;
}