import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BelvoService } from './belvo.service';
import { WidgetTokenResponseDto } from './dto/widget-token.dto';

@ApiTags('Belvo')
@Controller('belvo')
export class BelvoController {
  private readonly logger = new Logger(BelvoController.name);

  constructor(private readonly belvoService: BelvoService) {}

  @Get('widget-token')
  @ApiOperation({ summary: 'Gera um token para o widget do Belvo' })
  @ApiResponse({
    status: 200,
    description: 'Token gerado com sucesso',
    type: WidgetTokenResponseDto,
  })
  async getWidgetToken(): Promise<WidgetTokenResponseDto> {
    this.logger.log('Widget token request received');
    return this.belvoService.getWidgetToken();
  }
}
