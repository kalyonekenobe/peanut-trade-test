import { ExchangeNames } from '../enums/app.enums';
import { Exchange } from './exchange';
import { HttpService } from '@nestjs/axios';
import { CurrencyPairInfo } from '../types/app.types';
import { HttpStatusCode } from 'axios';

export class KuCoinExchange extends Exchange {
  constructor(
    readonly httpService: HttpService,
    readonly apiUrl: string,
  ) {
    super(httpService, ExchangeNames.KuCoin, apiUrl);
  }

  public async getCurrencyPairInfo(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<CurrencyPairInfo | never> {
    const response = await this.httpService.axiosRef.get(
      `${this.baseApiUrl}/api/v1/market/stats?symbol=${baseCurrency}-${quoteCurrency}`,
    );

    if (response.status !== HttpStatusCode.Ok) {
      throw new Error('Cannot fetch info for the requested currency pair');
    }

    if (!response.data.data?.buy) {
      const response = await this.httpService.axiosRef.get(
        `${this.baseApiUrl}/api/v1/market/stats?symbol=${quoteCurrency}-${baseCurrency}`,
      );

      if (response.status !== HttpStatusCode.Ok || !response.data.data?.buy) {
        throw new Error('Cannot fetch info for the requested currency pair');
      }

      return {
        exchangeName: this.name,
        baseCurrency,
        quoteCurrency,
        price: 1 / Number(response.data.data.buy),
      };
    }

    return {
      exchangeName: this.name,
      baseCurrency,
      quoteCurrency,
      price: Number(response.data.data.buy),
    };
  }
}
