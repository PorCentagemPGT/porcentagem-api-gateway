import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BankAccountRequestDto {
  @ApiProperty({
    description: 'ID do link no Belvo',
    example: 'f9beb63c-e385-4cc2-899c-36976990faf1',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  linkId: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: 'f9beb63c-e385-4cc2-899c-36976990faf1',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID da conta no Belvo',
    example: 'f9beb63c-e385-4cc2-899c-36976990faf1',
  })
  @IsString()
  @IsNotEmpty()
  bankAccountId: string;

  @ApiProperty({
    description: 'Categoria da conta',
    example: 'CREDIT_CARD',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Tipo da conta',
    example: 'Contas',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Número da conta',
    example: '4835 None5744',
  })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    description: 'Nome da conta',
    example: 'Cartão crédito visa gold',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class BankAccountResponseDto {
  @ApiProperty({
    description: 'ID da conta',
  })
  id: string;

  @ApiProperty({
    description: 'ID do usuário',
  })
  userId: string;

  @ApiProperty({
    description: 'ID do link no Belvo',
  })
  linkId: string;

  @ApiProperty({
    description: 'ID da conta no Belvo',
  })
  bankAccountId: string;

  @ApiProperty({
    description: 'Categoria da conta',
    example: 'CREDIT_CARD',
  })
  category: string;

  @ApiProperty({
    description: 'Tipo da conta',
    example: 'Contas',
  })
  type: string;

  @ApiProperty({
    description: 'Número da conta',
    example: '4835 None5744',
  })
  number: string;

  @ApiProperty({
    description: 'Nome da conta',
    example: 'Cartão crédito visa gold',
  })
  name: string;

  @ApiProperty({
    description: 'Status da conta',
    example: 'enabled',
  })
  status: string;

  @ApiProperty({
    description: 'Data de criação',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
  })
  updatedAt: Date;
}
