import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Transporte',
    minLength: 2,
    maxLength: 50,
  })
  name: string;

  @ApiProperty({
    description: 'Color code of the category (usually a HEX or color name)',
    example: '#FF5733',
  })
  color: string;

  @ApiProperty({
    description: 'Icon name or reference for the category',
    example: 'car',
  })
  icon: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'Despesas relacionadas a transporte diário',
  })
  description: string;
}
