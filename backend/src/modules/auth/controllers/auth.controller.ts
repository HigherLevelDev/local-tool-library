import { Body, Controller, Post, UnauthorizedException, HttpStatus, HttpCode, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { SignupDto } from '../dto/signup.dto';
import { TokenDto } from '../dto/token.dto';
import { Public } from '../decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user or authenticate existing user' })
  @ApiResponse({ status: 201, description: 'User successfully registered/authenticated' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Email already registered with different credentials' })
  async signup(@Body() signupDto: SignupDto) {
    try {
      // Validate input data
      if (!signupDto.email || !signupDto.name || !signupDto.password || !signupDto.phone || !signupDto.postcode) {
        throw new BadRequestException('All fields are required');
      }

      const existingUser = await this.userService.findByEmail(signupDto.email);
      if (existingUser) {
        // If user exists, try to authenticate them
        try {
          await this.authService.validateUser(signupDto.email, signupDto.password);
          return this.authService.createToken(existingUser);
        } catch (error) {
          throw new UnauthorizedException('Email already registered');
        }
      }

      const user = await this.userService.create(
        signupDto.email,
        signupDto.name,
        signupDto.password,
        signupDto.phone,
        signupDto.postcode
      );
      return this.authService.createToken(user);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Invalid input data');
    }
  }

  @Public()
  @Post('token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Authenticate user and get access token' })
  @ApiResponse({ status: 201, description: 'Successfully authenticated' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async token(@Body() tokenDto: TokenDto) {
    try {
      const user = await this.authService.validateUser(
        tokenDto.email,
        tokenDto.password
      );
      return this.authService.createToken(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user and invalidate token' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async logout(@Request() req) {
    try {
      await this.authService.logout(req.user.id);
      return { message: 'Successfully logged out' };
    } catch (error) {
      throw new UnauthorizedException('Failed to logout');
    }
  }
}