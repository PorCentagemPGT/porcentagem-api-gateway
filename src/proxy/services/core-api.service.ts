/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SignUpDto } from '../../auth/dto/sign-up.dto';

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

  async createUser(data: SignUpDto) {
    this.logger.log(`Create user request started - email: ${data.email}`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.coreApiUrl}/users`, data),
      );

      this.logger.log(`Create user request completed - email: ${data.email}`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Create user request failed - email: ${data.email}, error: ${errorMessage}`,
      );
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    this.logger.log(`Get user request started - email: ${email}`);

    try {
      const response = await firstValueFrom(
        this.logger.debug(`CoreApiUrl: ${this.coreApiUrl}`);
        this.httpService.get(`${this.coreApiUrl}/users/email/${email}`),
      );

      this.logger.log(`Get user request completed - email: ${email}`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Get user request failed - email: ${email}, error: ${errorMessage}`,
      );
      throw error;
    }
  }
}
