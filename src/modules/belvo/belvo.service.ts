import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { BelvoProxy } from '../../proxy/belvo.proxy';

@Injectable()
export class BelvoService {
  private readonly logger = new Logger(BelvoService.name);

  constructor(private readonly belvoProxy: BelvoProxy) {}

  async generateWidgetToken(): Promise<string> {
    try {
      this.logger.log('Generating Belvo widget token');

      const { token } = await this.belvoProxy.get<{ token: string }>(
        '/belvo/widget-token',
      );

      this.logger.log('Belvo widget token generated successfully');
      this.logger.debug(`Generated token: ${JSON.stringify(token)}`);
      return token || '';
    } catch (error) {
      this.logger.error(
        `Error generating Belvo widget token: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
      throw new UnauthorizedException('Falha ao gerar token do widget Belvo');
    }
  }
}
