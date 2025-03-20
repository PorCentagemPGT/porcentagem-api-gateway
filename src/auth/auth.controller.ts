import { Body, Controller, Post, Get, Logger, Headers } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({
    summary: 'Create a new user account',
    description: `Creates a new user account and returns authentication tokens.
    
Requirements:
- Email must be unique
- Password must be at least 8 characters long
- All fields are required`,
  })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  async signUp(@Body() dto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  @ApiOperation({
    summary: 'Sign in to an existing account',
    description: `Authenticates a user and returns tokens with user data.
    
Notes:
- Returns 401 for invalid credentials
- Returns user profile along with tokens`,
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  async signIn(@Body() dto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signIn(dto);
  }

  @Get('validate')
  @ApiOperation({
    summary: 'Validate current session',
    description: 'Validates if the current access token is valid and active',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired token',
  })
  async validateToken(
    @Headers('authorization') auth: string,
  ): Promise<{ valid: boolean }> {
    return await this.authService.validateToken(auth);
  }
}
