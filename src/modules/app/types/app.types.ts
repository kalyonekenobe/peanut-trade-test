import { ExchangeNames } from '../enums/app.enums';

export interface ExchangeInterface {
  getCurrencyPairInfo(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<CurrencyPairInfo | never>;
  getName(): ExchangeNames;
}

export interface CurrencyPairInfo {
  exchangeName: ExchangeNames;
  baseCurrency: string;
  quoteCurrency: string;
  price: number;
}

export interface EstimateResponse {
  exchangeName: ExchangeNames;
  outputAmount: number;
}

export interface GetRatesResponseItem {
  exchangeName: ExchangeNames;
  rate: number;
}

export type GetRatesResponse = GetRatesResponseItem[];
