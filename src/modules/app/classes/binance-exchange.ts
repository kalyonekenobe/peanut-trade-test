import { ExchangeNames } from '../enums/app.enums';
import { Exchange } from './exchange';
import { HttpService } from '@nestjs/axios';
import { CurrencyPairInfo } from '../types/app.types';
import { HttpStatusCode } from 'axios';

export class BinanceExchange extends Exchange {
  constructor(
    readonly httpService: HttpService,
    readonly baseApiUrl: string,
  ) {
    super(httpService, ExchangeNames.Binance, baseApiUrl);
  }

  public async getCurrencyPairInfo(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<CurrencyPairInfo | never> {
    const response = await this.httpService.axiosRef.get(
      `${this.baseApiUrl}/api/v3/ticker/price?symbol=${baseCurrency}${quoteCurrency}`,
      { validateStatus: () => true },
    );

    if (!response.data.price) {
      const response = await this.httpService.axiosRef.get(
        `${this.baseApiUrl}/api/v3/ticker/price?symbol=${quoteCurrency}${baseCurrency}`,
      );

      if (response.status !== HttpStatusCode.Ok || !response.data.price) {
        throw new Error('Cannot fetch info for the requested currency pair');
      }

      return {
        exchangeName: this.name,
        baseCurrency,
        quoteCurrency,
        price: 1 / Number(response.data.price),
      };
    }

    return {
      exchangeName: this.name,
      baseCurrency,
      quoteCurrency,
      price: Number(response.data.price),
    };
  }
}
