import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthProxy } from '../../proxy/auth.proxy';
import { UsersService } from '../core/users/users.service';
import * as bcrypt from 'bcrypt';
import { CoreUserResponse } from '../../proxy/interfaces/core-api.interface';
import { AuthTokenResponse } from '../../proxy/interfaces/auth-api.interface';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authProxy: AuthProxy,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<CoreUserResponse, 'password'>> {
    try {
      this.logger.log(`User validation started - email: ${email}`);

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _userPassword, ...result } = user;

      this.logger.log(`User validation completed - userId: ${result.id}`);
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(
        `Error validating user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
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

  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      this.logger.error('Error hashing password');
      throw new Error('Error hashing password');
    }
  }

  async register(registerDto: RegisterDto): Promise<{
    user: Omit<CoreUserResponse, 'password'>;
    tokens: AuthTokenResponse;
  }> {
    try {
      this.logger.log(`Registration started - email: ${registerDto.email}`);

      // Verifica se email já existe
      const existingUser = await this.usersService.findByEmail(
        registerDto.email,
      );

      if (existingUser) {
        this.logger.warn(`Email already in use: ${registerDto.email}`);
        throw new ConflictException('Email já está em uso');
      }

      // Hash da senha
      const hashedPassword = await this.hashPassword(registerDto.password);

      // Cria usuário
      const user = await this.usersService
        .create({
          ...registerDto,
          password: hashedPassword,
        })
        .catch((error) => {
          this.logger.error(
            `Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
          throw new InternalServerErrorException('Erro ao criar usuário');
        });

      // Gera tokens
      const tokens = await this.login(user);

      this.logger.log(`Registration completed - userId: ${user.id}`);
      return { user, tokens };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      this.logger.error(
        `Error registering user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InternalServerErrorException('Erro ao registrar usuário');
    }
  }
}
