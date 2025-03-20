import {
  Injectable,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthApiService } from '../proxy/services/auth-api.service';
import { CoreApiService } from '../proxy/services/core-api.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authApiService: AuthApiService,
    private readonly coreApiService: CoreApiService,
  ) {}

  async signUp(dto: SignUpDto): Promise<AuthResponseDto> {
    this.logger.log(`Sign up request started - email: ${dto.email}`);

    try {
      // 1. Criar usuário no core-api
      const user = await this.coreApiService.createUser(dto);

      // 2. Realizar login no auth-api
      const auth = await this.authApiService.login(user.id);

      this.logger.log(`Sign up request completed - email: ${dto.email}`);

      // 3. Retornar resposta combinada
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        tokens: {
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          expiresIn: auth.expiresIn,
        },
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Sign up request failed - email: ${dto.email}, error: ${errorMessage}`,
      );

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating user account');
    }
  }

  async signIn(dto: SignInDto): Promise<AuthResponseDto> {
    this.logger.log(`Sign in request started - email: ${dto.email}`);

    try {
      // 1. Buscar e validar usuário no core-api
      const user = await this.coreApiService.getUserByEmail(dto.email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // 2. Realizar login no auth-api
      const auth = await this.authApiService.login(user.id);

      this.logger.log(`Sign in request completed - userId: ${user.id}`);

      // 3. Retornar resposta combinada
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        tokens: {
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          expiresIn: auth.expiresIn,
        },
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Sign in request failed - email: ${dto.email}, error: ${errorMessage}`,
      );

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Error during sign in');
    }
  }

  async validateToken(auth: string): Promise<{ valid: boolean }> {
    this.logger.log('Token validation request started');

    try {
      await this.authApiService.validateToken(auth);
      this.logger.log('Token validation successful');
      return { valid: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.log(`Token validation failed: ${errorMessage}`);
      return { valid: false };
    }
  }
}
