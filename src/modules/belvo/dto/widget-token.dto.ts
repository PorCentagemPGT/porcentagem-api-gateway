import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO para a resposta do token do widget Belvo
 */
export class WidgetTokenResponseDto {
  @ApiProperty({
    description: 'Token de acesso para o widget Belvo',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Timestamp de quando o token foi gerado',
    example: '2025-05-07T13:24:31.123Z',
  })
  @IsString()
  @IsNotEmpty()
  generatedAt: string;

  constructor(token: string) {
    this.token = token;
    this.generatedAt = new Date().toISOString();
  }
}

/**
 * DTO para a resposta de erro do widget Belvo
 */
export class WidgetTokenErrorResponseDto {
  @ApiProperty({
    description: 'Código HTTP do erro',
    example: 401,
  })
  @IsNotEmpty()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem descritiva do erro',
    example: 'Falha na autenticação com a API Belvo',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Tipo do erro',
    example: 'Belvo Authentication Error',
  })
  @IsString()
  @IsNotEmpty()
  error: string;
}
