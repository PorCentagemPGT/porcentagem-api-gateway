import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BelvoProxy } from '../../proxy/belvo.proxy';
import { CoreProxy } from '../../proxy/core.proxy';
import { LinkAccountDto, LinkAccountResponseDto } from './dto/link-account.dto';

@Injectable()
export class BelvoService {
  private readonly logger = new Logger(BelvoService.name);

  constructor(
    private readonly belvoProxy: BelvoProxy,
    private readonly coreProxy: CoreProxy,
  ) {}

  async generateWidgetToken(): Promise<string> {
    try {
      this.logger.log('Generating Belvo widget token');

      const { token } = await this.belvoProxy.get<{ token: string }>(
        '/widget/token',
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

  async linkAccount(data: LinkAccountDto): Promise<LinkAccountResponseDto> {
    try {
      this.logger.log(`Linking account for user ${data.userId}`);

      // Verificar se o usuário existe no Core
      try {
        await this.coreProxy.get(`/users/${data.userId}`);
      } catch (error) {
        this.logger.error(
          `User ${data.userId} not found in Core API: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        throw new NotFoundException('Usuário não encontrado');
      }

      // Registrar a conta no Belvo
      interface LinkAccountResponse {
        id: string;
        linkId: string;
        userId: string;
        institutionName: string;
      }

      const response = await this.belvoProxy.post<LinkAccountResponse>(
        '/accounts/link',
        {
          userId: data.userId,
          linkId: data.linkId,
          institutionName: data.institutionName,
        },
      );

      this.logger.log(`Account linked successfully for user ${data.userId}`);
      this.logger.debug(`Link response: ${JSON.stringify(response)}`);

      return new LinkAccountResponseDto({
        id: response.data.id,
        linkId: response.data.linkId,
        userId: response.data.userId,
        institutionName: response.data.institutionName,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Error linking account: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new BadRequestException('Falha ao linkar conta');
    }
  }
}
