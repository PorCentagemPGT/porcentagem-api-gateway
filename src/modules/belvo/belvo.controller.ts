import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BelvoService } from './belvo.service';
import {
  WidgetTokenResponseDto,
  WidgetTokenErrorResponseDto,
} from './dto/widget-token.dto';
import { LinkAccountDto, LinkAccountResponseDto } from './dto/link-account.dto';
import {
  BankAccountRequestDto,
  BankAccountResponseDto,
} from './dto/bank-account.dto';
import { ListBelvoAccountsResponseDto } from './dto/list-belvo-accounts.dto';

@ApiTags('Belvo Integration')
@Controller('belvo')
export class BelvoController {
  constructor(private readonly belvoService: BelvoService) {}

  @Get('widget-token')
  @ApiOperation({
    summary: 'Gerar token para o widget Belvo',
    description: 'Gera um token JWT para autenticação com o widget Belvo',
  })
  @ApiResponse({
    status: 200,
    description: 'Token gerado com sucesso',
    type: WidgetTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Erro de autenticação com a API Belvo',
    type: WidgetTokenErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao gerar o token',
    type: WidgetTokenErrorResponseDto,
  })
  async getWidgetToken(): Promise<WidgetTokenResponseDto> {
    const token = await this.belvoService.generateWidgetToken();
    return new WidgetTokenResponseDto(token);
  }

  @Post('link-account')
  @ApiOperation({
    summary: 'Vincular conta bancária',
    description: 'Vincula uma conta bancária ao usuário usando o Belvo',
  })
  @ApiResponse({
    status: 201,
    description: 'Conta vinculada com sucesso',
    type: LinkAccountResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Link não encontrado no Belvo',
    type: WidgetTokenErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Link já registrado para outro usuário',
    type: WidgetTokenErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao vincular conta',
    type: WidgetTokenErrorResponseDto,
  })
  async linkAccount(
    @Body() data: LinkAccountDto,
  ): Promise<LinkAccountResponseDto> {
    return this.belvoService.linkAccount(data);
  }

  @Get('accounts/:userId')
  @ApiOperation({
    summary: 'Listar contas vinculadas',
    description: 'Lista todas as contas vinculadas ao usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Contas listadas com sucesso',
    type: [LinkAccountResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao listar contas',
    type: WidgetTokenErrorResponseDto,
  })
  async listUserAccounts(
    @Param('userId') userId: string,
  ): Promise<LinkAccountResponseDto[]> {
    return this.belvoService.listUserAccounts(userId);
  }

  @Get('accounts/belvo/:linkId')
  @ApiOperation({
    summary: 'Listar contas do Belvo',
    description: 'Lista todas as contas do Belvo para um determinado link',
  })
  @ApiResponse({
    status: 200,
    description: 'Contas listadas com sucesso',
    type: [ListBelvoAccountsResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao listar contas',
    type: WidgetTokenErrorResponseDto,
  })
  async listBelvoAccounts(
    @Param('linkId') linkId: string,
  ): Promise<ListBelvoAccountsResponseDto[]> {
    return this.belvoService.listBelvoAccounts(linkId);
  }

  @Post('accounts/bank')
  @ApiOperation({
    summary: 'Registrar conta bancária',
    description: 'Registra uma nova conta bancária para um link',
  })
  @ApiResponse({
    status: 201,
    description: 'Conta registrada com sucesso',
    type: BankAccountResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao registrar conta',
    type: WidgetTokenErrorResponseDto,
  })
  async createBankAccount(
    @Body() data: BankAccountRequestDto,
  ): Promise<{ data: BankAccountResponseDto }> {
    console.log(`Creating bank account for link ${data.linkId}`);
    return this.belvoService.createBankAccount(data);
  }
}
