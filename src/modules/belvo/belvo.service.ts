import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BelvoProxy } from '../../proxy/belvo.proxy';
import { AccountStatus } from './types/account-status.enum';
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

  async unlinkBank(linkId: string): Promise<LinkAccountResponseDto> {
    try {
      this.logger.log(`Removing bank link ${linkId}`);

      interface UnlinkResponse {
        data: LinkAccountResponseDto;
      }

      const response = await this.belvoProxy.delete<UnlinkResponse>(
        `/accounts/link/${linkId}`,
      );

      this.logger.log('Bank link removed successfully');
      this.logger.debug(`Response: ${JSON.stringify(response.data)}`);

      return response.data.data;
    } catch (error: unknown) {
      this.logger.error(
        `Error removing bank link: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response &&
        error.response.status === 404
      ) {
        throw new NotFoundException('Link não encontrado');
      }

      throw new BadRequestException('Falha ao remover link do banco');
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

      await this.listAndCreateAccounts(data.linkId, data.userId);

      this.logger.log(`Accounts created successfully for user ${data.userId}`);

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

  async listBankAccountsByUserId(
    userId: string,
  ): Promise<BankAccountResponseDto[]> {
    try {
      this.logger.log(`Listing bank accounts for user ${userId}`);

      const { data } = await this.belvoProxy.get<BankAccountResponseDto[]>(
        `/accounts/bank/userId/${userId}`,
      );

      this.logger.debug(`Bank accounts response: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      this.logger.error(
        `Error listing bank accounts: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new BadRequestException('Falha ao listar contas bancárias');
    }
  }

  async listBankAccountsByLinkId(
    linkId: string,
  ): Promise<BankAccountResponseDto[]> {
    try {
      this.logger.log(`Listing bank accounts for link ${linkId}`);

      const { data } = await this.belvoProxy.get<BankAccountResponseDto[]>(
        `/accounts/bank/linkId/${linkId}`,
      );

      this.logger.debug(`Bank accounts response: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      this.logger.error(
        `Error listing bank accounts: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new BadRequestException('Falha ao listar contas bancárias');
    }
  }

  async updateBankAccounts(data: {
    accounts: { id: string; status: AccountStatus }[];
  }): Promise<{ data: BankAccountResponseDto[] }> {
    const mappedAccounts = data.accounts.map((account) => ({
      id: account.id,
      status: account.status === AccountStatus.ACTIVE ? 'enabled' : 'disabled',
    }));
    try {
      this.logger.log(`Updating ${data.accounts.length} accounts in batch`);

      const response = await this.belvoProxy.patch<{
        data: BankAccountResponseDto[];
      }>('/accounts/batch', { accounts: mappedAccounts });

      this.logger.debug(`Batch update response: ${JSON.stringify(response)}`);
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error updating accounts in batch: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new BadRequestException('Falha ao atualizar contas bancárias');
    }
  }

  async listAndCreateAccounts(linkId: string, userId: string): Promise<void> {
    try {
      this.logger.log(`Listing and creating accounts for link ${linkId}`);

      const accounts = await this.listBelvoAccounts(linkId);

      const accountsAlreadyCreated =
        await this.listBankAccountsByLinkId(linkId);

      for (const account of accounts) {
        try {
          if (
            accountsAlreadyCreated.some((a) => a.bankAccountId === account.id)
          ) {
            this.logger.log(`Bank account ${account.id} already created`);
            continue;
          }
          this.logger.log(`Creating bank account ${JSON.stringify(account)}`);

          await this.createBankAccount({
            userId,
            linkId,
            category: account.category,
            type: account.type,
            number: account.number,
            name: account.name,
            bankAccountId: account.id,
          });
          this.logger.log(`Created bank account ${account.id} successfully`);
        } catch (error) {
          this.logger.error(
            `Error creating bank account ${account.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
          // Continuar criando outras contas mesmo se uma falhar
          continue;
        }
      }
    } catch (error) {
      this.logger.error(
        `Error listing and creating accounts: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new BadRequestException('Falha ao listar e criar contas');
    }
  }
}
