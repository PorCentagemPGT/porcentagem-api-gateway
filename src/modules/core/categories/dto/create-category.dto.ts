import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Transporte',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Color code of the category (usually a HEX or color name)',
    example: '#FF5733',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: 'Icon name or reference for the category',
    example: 'car',
  })
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'Despesas relacionadas a transporte diário',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
