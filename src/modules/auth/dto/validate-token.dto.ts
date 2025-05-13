import { ApiProperty } from '@nestjs/swagger';

export class ValidateTokenDto {
  @ApiProperty({
    description: 'ID do usuário dono do token',
    example: '205e0585-9300-492f-abce-28826501d308',
  })
  userId: string;

  @ApiProperty({
    description: 'Indica se o token é válido',
    example: true,
  })
  isValid: boolean;

  @ApiProperty({
    description: 'Tempo restante de validade em segundos',
    example: 3600,
    required: false,
  })
  expiresIn?: number;
}
