/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SignUpDto } from '../../auth/dto/sign-up.dto';
import { SignInDto } from '../../auth/dto/sign-in.dto';
import { UserResponseSchema } from '../../auth/schemas/user-response.schema';
import { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class CoreApiService {
  private readonly logger = new Logger(CoreApiService.name);
  private readonly coreApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.coreApiUrl = this.configService.getOrThrow<string>('CORE_API_URL');
  }

  async createUser(data: SignUpDto): Promise<UserResponseSchema> {
    this.logger.log(`Create user request started - email: ${data.email}`);

    try {
      const response = await firstValueFrom<AxiosResponse<UserResponseSchema>>(
        this.httpService.post(`${this.coreApiUrl}/users`, data),
      );

      this.logger.log(
        `Create user request completed - userId: ${response.data.id}`,
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Create user request failed - email: ${data.email}`,
        axiosError.response?.data,
      );
      throw axiosError.response?.data || error;
    }
  }

  async getUserByEmail(email: string) {
    this.logger.log(`Get user request started - email: ${email}`);

    try {
      this.logger.debug(`CoreApiUrl: ${this.coreApiUrl}`);
      const response = await firstValueFrom<AxiosResponse>(
        this.httpService.get(`${this.coreApiUrl}/users/email/${email}`),
      );

      this.logger.log(`Get user request completed - email: ${email}`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError instanceof Error ? axiosError.message : 'Unknown error';
      this.logger.error(
        `Get user request failed - email: ${email}, error: ${errorMessage}`,
      );
      throw error;
    }
  }

  async validateCredentials(data: SignInDto): Promise<UserResponseSchema> {
    this.logger.log(`Validate credentials started - email: ${data.email}`);

    try {
      const response = await firstValueFrom<AxiosResponse<UserResponseSchema>>(
        this.httpService.post(`${this.coreApiUrl}/users/validate`, data),
      );

      this.logger.log(
        `Validate credentials completed - userId: ${response.data.id}`,
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Validate credentials failed - email: ${data.email}`,
        axiosError.response?.data,
      );

      if (axiosError.response?.status === 401) {
        throw new UnauthorizedException('Invalid credentials');
      }

      throw axiosError.response?.data || error;
    }
  }
}
