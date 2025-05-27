import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AccountStatus } from '../types/account-status.enum';

class UpdateBankAccountItem {
  @IsString()
  id: string;

  @IsEnum(AccountStatus)
  status: AccountStatus;
}

export class UpdateBankAccountsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBankAccountItem)
  accounts: UpdateBankAccountItem[];
}
