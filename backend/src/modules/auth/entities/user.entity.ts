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
  @Matches(/^(\+44|0044|0)7\d{9}$|^(\+33|0033|0)[67]\d{8}$/, { 
    message: 'Phone number must be a valid UK (+44) or French (+33) mobile number' 
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]{2,10}$/, { message: 'Invalid postcode format' })
  postcode: string;

  createdAt: Date;
  updatedAt: Date;
}