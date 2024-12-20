import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'The user password - minimum 8 characters',
    example: 'password123',
    minLength: 8
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  })
  password: string;

  @ApiProperty({
    description: 'The phone number of the user (must be a valid UK or French phone number with country code)',
    example: '+447911123456',
    examples: ['+447911123456', '+33612345678']
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+44|0044|0)7\d{9}$|^(\+33|0033|0)[67]\d{8}$/, { 
    message: 'Phone number must be a valid UK (+44) or French (+33) mobile number' 
  })
  phone: string;

  @ApiProperty({
    description: 'The postcode of the user',
    example: 'AB12CD'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(10)
  @Matches(/^[A-Z0-9]{4,10}$/, { 
    message: 'Invalid postcode format - must be 4-10 uppercase alphanumeric characters' 
  })
  postcode: string;
}