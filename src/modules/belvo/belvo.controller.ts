import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BelvoService } from './belvo.service';
import {
  WidgetTokenResponseDto,
  WidgetTokenErrorResponseDto,
} from './dto/widget-token.dto';

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
}
