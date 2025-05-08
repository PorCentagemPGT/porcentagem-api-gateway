import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthProxy } from '../../proxy/auth.proxy';
import { CoreProxy } from '../../proxy/core.proxy';
import { AuthTokenResponse } from '../../proxy/interfaces/auth-api.interface';
import { CoreUserResponse } from '../../proxy/interfaces/core-api.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authProxy: AuthProxy,
    private readonly coreProxy: CoreProxy,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<CoreUserResponse, 'password'>> {
    try {
      this.logger.log(`Validating user - email: ${email}`);

      // Busca usuário no Core API
      const userData = await this.coreProxy.get<CoreUserResponse>(
        `/users/email/${email}`,
      );

      if (!userData?.email) {
        this.logger.warn(`User not found - email: ${email}`);
        throw new UnauthorizedException('Credenciais inválidas');
      }

      this.logger.log('User found, validating password...');

      // Valida senha
      const isPasswordValid = await bcrypt.compare(password, userData.password);

      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user ${email}`);
        throw new UnauthorizedException('Credenciais inválidas');
      }

      // Remove senha antes de retornar
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = userData;

      return userWithoutPassword;
    } catch (error) {
      this.logger.error(`Error validating user ${email}: ${error.message}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }

  async login(
    user: Omit<CoreUserResponse, 'password'>,
  ): Promise<AuthTokenResponse> {
    try {
      this.logger.log(`Login operation started - userId: ${user.id}`);

      // Gera tokens
      const response = await this.authProxy.post<AuthTokenResponse>(
        '/auth/login',
        { userId: user.id },
      );

      if (!response) {
        throw new Error('Tokens não gerados pelo Auth API');
      }

      const { accessToken, refreshToken, expiresIn } = response;

      this.logger.log(`Login operation completed - userId: ${user.id}`);
      return { accessToken, refreshToken, expiresIn };
    } catch (error) {
      this.logger.error(`Error logging in user ${user.id}: ${error.message}`);
      throw new UnauthorizedException('Erro ao gerar tokens');
    }
  }
}
