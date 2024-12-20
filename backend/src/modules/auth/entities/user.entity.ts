import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class User {
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  passwordHash: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]{2,10}$/, { message: 'Invalid postcode format' })
  postcode: string;

  createdAt: Date;
  updatedAt: Date;
}