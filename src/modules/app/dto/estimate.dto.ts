import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class EstimateDto {
  @Min(1e-9, { message: 'The input amount must be greater than 0' })
  @IsNumber({ maxDecimalPlaces: 9 })
  @IsDefined({ message: 'The input amount must be defined' })
  @Type(() => Number)
  inputAmount: number;

  @IsString({ message: 'The input currency must be a string' })
  @IsNotEmpty({ message: 'The input currency cannot be empty' })
  @IsDefined({ message: 'The input currency must be defined' })
  inputCurrency: string;

  @IsString({ message: 'The output currency must be a string' })
  @IsNotEmpty({ message: 'The output currency cannot be empty' })
  @IsDefined({ message: 'The output currency must be defined' })
  outputCurrency: string;
}
