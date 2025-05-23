import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class LinkAccountDto {
  @ApiProperty({
    description: 'ID do usuário que está linkando a conta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Link ID gerado pelo widget do Belvo',
    example: 'abcdef12-3456-7890-abcd-ef1234567890',
  })
  @IsString()
  @IsNotEmpty()
  linkId: string;

  @ApiProperty({
    description: 'Nome da instituição financeira selecionada',
    example: 'Banco do Brasil',
  })
  @IsString()
  @IsNotEmpty()
  institutionName: string;
}

export class LinkAccountResponseDto {
  @ApiProperty({
    description: 'ID da conta linkada no Belvo',
    example: 'abcdef12-3456-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Link ID associado à conta',
    example: 'abcdef12-3456-7890-abcd-ef1234567890',
  })
  linkId: string;

  @ApiProperty({
    description: 'ID do usuário que linkou a conta',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Nome da instituição financeira da conta',
    example: 'Banco do Brasil',
  })
  institutionName: string;

  constructor(partial: Partial<LinkAccountResponseDto>) {
    Object.assign(this, partial);
  }
}

export class LinkAccountErrorResponseDto {
  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Erro ao linkar conta',
  })
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
