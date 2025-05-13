import {
  Body,
  Controller,
  Post,
  Headers,
  HttpCode,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { ApiBearerAuthWithDocs } from './decorators/api-bearer-auth.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { AuthService } from './auth.service';
import {
  AuthTokenResponse,
  LogoutResponse,
  ValidateTokenResponse,
} from '../../proxy/interfaces/auth-api.interface';
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

  @Post('logout')
  @HttpCode(204)
  @ApiBearerAuthWithDocs()
  @ApiOperation({
    summary: 'Logout',
    description: 'Invalida o token de acesso do usuário',
  })
  @ApiResponse({
    status: 204,
    description: 'Logout realizado com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido',
  })
  async logout(
    @Headers('authorization') auth: string | undefined,
  ): Promise<LogoutResponse> {
    const token = auth?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }
    return await this.authService.logout(token);
  }

  @Get('validate')
  @ApiBearerAuthWithDocs()
  @ApiOperation({
    summary: 'Validar token',
    description: `
      Endpoint para validar um token JWT.
      Retorna informações sobre a validade do token, incluindo:
      - ID do usuário dono do token
      - Se o token é válido
      - Tempo restante de validade em segundos
      
      Útil para verificar se um token ainda é válido antes de
      fazer uma requisição que o utilize.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Token validado com sucesso',
    type: ValidateTokenDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado',
  })
  async validate(
    @Headers('authorization') auth: string | undefined,
  ): Promise<ValidateTokenResponse> {
    console.log(`🚀 ~ auth:`, auth);
    if (!auth) {
      throw new UnauthorizedException('Token não fornecido');
    }

    return await this.authService.validateToken(auth);
  }
}
