import { ApiProperty } from '@nestjs/swagger';

export class ListBelvoAccountsRequestDto {
  @ApiProperty({
    description: 'ID do link no Belvo',
    example: 'f9beb63c-e385-4cc2-899c-36976990faf1',
  })
  linkId: string;
}

export class ListBelvoAccountsResponseDto {
  @ApiProperty({
    description: 'ID da conta no Belvo',
    example: 'f9beb63c-e385-4cc2-899c-36976990faf1',
  })
  id: string;

  @ApiProperty({
    description: 'ID do link no Belvo',
    example: 'f9beb63c-e385-4cc2-899c-36976990faf1',
  })
  link: string;

  @ApiProperty({
    description: 'Número da conta',
    example: '4835 None5744',
  })
  number: string;

  @ApiProperty({
    description: 'Informações da instituição',
    example: {
      name: 'Banco do Brasil',
      type: 'bank',
    },
  })
  institution: {
    name: string;
    type: string;
  };

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
    description: 'Nome da conta',
    example: 'Cartão crédito visa gold',
  })
  name: string;

  @ApiProperty({
    description: 'Status da conta',
    example: 'enabled',
  })
  status: string;

  constructor(partial: Partial<ListBelvoAccountsResponseDto>) {
    Object.assign(this, partial);
  }
}
