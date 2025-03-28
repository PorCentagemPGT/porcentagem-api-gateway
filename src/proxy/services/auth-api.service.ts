/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthApiService {
  private readonly logger = new Logger(AuthApiService.name);
  private readonly authApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authApiUrl = this.configService.getOrThrow<string>('AUTH_API_URL');
  }

  async login(userId: string) {
    this.logger.log(`Login request started - userId: ${userId}`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authApiUrl}/auth/login`, {
          userId,
        }),
      );

      this.logger.log(`Login request completed - userId: ${userId}`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Login request failed - userId: ${userId}, error: ${errorMessage}`,
      );
      throw error;
    }
  }

  async validateToken(auth: string): Promise<void> {
    await this.httpService.axiosRef.get(`${this.authApiUrl}/auth/validate`, {
      headers: {
        Authorization: auth,
      },
    });
  }
}
