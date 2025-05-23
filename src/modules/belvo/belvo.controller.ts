import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BelvoService } from './belvo.service';
import {
  WidgetTokenResponseDto,
  WidgetTokenErrorResponseDto,
} from './dto/widget-token.dto';
import { LinkAccountDto, LinkAccountResponseDto } from './dto/link-account.dto';

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
}
