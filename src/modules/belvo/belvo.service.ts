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
import {
  BankAccountRequestDto,
  BankAccountResponseDto,
} from './dto/bank-account.dto';
import { ListBelvoAccountsResponseDto } from './dto/list-belvo-accounts.dto';

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

  async listBelvoAccounts(
    linkId: string,
  ): Promise<ListBelvoAccountsResponseDto[]> {
    try {
      this.logger.log(`Listing Belvo accounts for link ${linkId}`);

      const { data } = await this.belvoProxy.get<
        ListBelvoAccountsResponseDto[]
      >(`/accounts/belvo/${linkId}`);

      this.logger.debug(`Belvo accounts response: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      this.logger.error(
        `Error listing Belvo accounts: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new BadRequestException('Falha ao listar contas do Belvo');
    }
  }

  async listUserAccounts(userId: string): Promise<LinkAccountResponseDto[]> {
    try {
      this.logger.log(`Listing accounts for user ${userId}`);

      const { data } = await this.belvoProxy.get<LinkAccountResponseDto[]>(
        `/accounts/link/${userId}`,
      );

      this.logger.debug(`User accounts response: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      this.logger.error(
        `Error listing user accounts: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new BadRequestException('Falha ao listar contas do usuário');
    }
  }

  async createBankAccount(
    bankAccountRequestDto: BankAccountRequestDto,
  ): Promise<{ data: BankAccountResponseDto }> {
    try {
      this.logger.log(
        `Creating bank account for link ${bankAccountRequestDto.linkId}`,
      );

      const responseData = await this.belvoProxy.post<BankAccountResponseDto>(
        '/accounts/bank',
        bankAccountRequestDto,
      );

      this.logger.debug(
        `Bank account response: ${JSON.stringify(responseData)}`,
      );
      return responseData;
    } catch (error) {
      this.logger.error(
        `Error creating bank account: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new BadRequestException('Falha ao criar conta bancária');
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
