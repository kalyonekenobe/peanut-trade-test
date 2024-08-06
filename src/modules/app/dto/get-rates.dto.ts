import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class GetRatesDto {
  @IsString({ message: 'The base currency must be a string' })
  @IsNotEmpty({ message: 'The base currency cannot be empty' })
  @IsDefined({ message: 'The base currency must be defined' })
  baseCurrency: string;

  @IsString({ message: 'The quote currency must be a string' })
  @IsNotEmpty({ message: 'The quote currency cannot be empty' })
  @IsDefined({ message: 'The quote currency must be defined' })
  quoteCurrency: string;
}
