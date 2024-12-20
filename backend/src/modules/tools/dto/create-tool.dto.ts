import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateToolDto {
  @ApiProperty({ description: 'Tool title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Tool description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Location latitude' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Location longitude' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}