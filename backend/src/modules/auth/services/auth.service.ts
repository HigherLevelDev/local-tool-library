import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isValid = await this.userService.validatePassword(user, password);
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async createToken(user: User) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      name: user.name,
      postcode: user.postcode
    };
    const expiresIn = '7d';
    
    return {
      access_token: await this.jwtService.signAsync(payload, { expiresIn }),
      user_id: user.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        postcode: user.postcode
      },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  async logout(userId: string): Promise<void> {
    // In a real application, you might want to:
    // 1. Add the token to a blacklist
    // 2. Clear any refresh tokens
    // 3. Clear any session data
    // For now, we'll just validate the user exists
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
  }
}