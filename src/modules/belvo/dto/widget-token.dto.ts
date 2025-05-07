import { ApiProperty } from '@nestjs/swagger';

export class WidgetTokenResponseDto {
  @ApiProperty({
    description: 'Token de acesso para o widget Belvo',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'Data e hora de geração do token',
    example: '2025-05-07T14:13:32.000Z',
  })
  generatedAt: string;
}
