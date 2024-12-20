import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123'
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'OAuth2 grant type',
    example: 'password',
    enum: ['password']
  })
  @IsEnum(['password'])
  grant_type: 'password';
}