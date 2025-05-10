import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { AuthTokenResponse } from '../../proxy/interfaces/auth-api.interface';
import { CoreUserResponse } from '../../proxy/interfaces/core-api.interface';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login do usuário',
    description: 'Autentica um usuário com email e senha',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário autenticado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(@Body() loginDto: LoginDto): Promise<{
    user: Omit<CoreUserResponse, 'password'>;
    tokens: AuthTokenResponse;
  }> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    const tokens = await this.authService.login(user);
    return { user, tokens };
  }

  @Post('register')
  @ApiOperation({
    summary: 'Registro de usuário',
    description: 'Cria uma nova conta de usuário',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso',
  })
  async register(@Body() registerDto: RegisterDto): Promise<{
    user: Omit<CoreUserResponse, 'password'>;
    tokens: AuthTokenResponse;
  }> {
    const { user, tokens } = await this.authService.register(registerDto);
    return { user, tokens };
  }
}
