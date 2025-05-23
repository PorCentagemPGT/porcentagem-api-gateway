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
  })
  id: string;

  @ApiProperty({
    description: 'ID do link no Belvo',
  })
  link: string;

  @ApiProperty({
    description: 'ID da conta no Belvo',
  })
  bankAccountId: string;

  @ApiProperty({
    description: 'Nome da instituição',
  })
  institution: string;

  @ApiProperty({
    description: 'Categoria da conta',
  })
  category: string;

  @ApiProperty({
    description: 'Tipo da conta',
  })
  type: string;

  @ApiProperty({
    description: 'Nome da conta',
  })
  name: string;

  constructor(partial: Partial<ListBelvoAccountsResponseDto>) {
    Object.assign(this, partial);
  }
}
