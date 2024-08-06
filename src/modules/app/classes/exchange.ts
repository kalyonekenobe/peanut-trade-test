import { HttpService } from '@nestjs/axios';
import { ExchangeNames } from '../enums/app.enums';
import { CurrencyPairInfo, ExchangeInterface } from '../types/app.types';

export abstract class Exchange implements ExchangeInterface {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly name: ExchangeNames,
    protected readonly baseApiUrl: string,
  ) {}

  public abstract getCurrencyPairInfo(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<CurrencyPairInfo | never>;

  public getName(): ExchangeNames {
    return this.name;
  }
}
