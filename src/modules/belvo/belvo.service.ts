import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { WidgetTokenResponseDto } from './dto/widget-token.dto';

@Injectable()
export class BelvoService {
  private readonly logger = new Logger(BelvoService.name);
  private readonly belvoApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.belvoApiUrl = this.configService.getOrThrow<string>('BELVO_API_URL');
  }

  async getWidgetToken(): Promise<WidgetTokenResponseDto> {
    this.logger.log('Requesting widget token from Belvo API');

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<WidgetTokenResponseDto>(
          `${this.belvoApiUrl}/belvo/widget-token`,
        ),
      );

      this.logger.log('Widget token received successfully');
      return data;
    } catch (error) {
      this.logger.error('Error getting widget token:', error);

      if (error instanceof AxiosError) {
        throw error.response?.data ?? error;
      }

      throw error;
    }
  }
}
