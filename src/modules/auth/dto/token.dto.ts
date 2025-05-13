import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TokenDto {
  @ApiProperty({
    description: 'Token de acesso (Bearer)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  token: string;
}
