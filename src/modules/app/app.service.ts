import { Injectable } from '@nestjs/common';
import {
  CurrencyPairInfo,
  EstimateResponse,
  GetRatesResponse,
} from './types/app.types';
import { EstimateDto } from './dto/estimate.dto';
import { KuCoinExchange } from './classes/kucoin-exchange';
import { Exchange } from './classes/exchange';
import { HttpService } from '@nestjs/axios';
import { GetRatesDto } from './dto/get-rates.dto';
import { BinanceExchange } from './classes/binance-exchange';

@Injectable()
export class AppService {
  private readonly exchanges: Exchange[];

  constructor(readonly httpService: HttpService) {
    this.exchanges = [
      new KuCoinExchange(
        httpService,
        process.env.KUCOIN_API_URL || 'https://api.kucoin.com',
      ),
      new BinanceExchange(
        httpService,
        process.env.BINANCE_API_URL || 'https://api.binance.com',
      ),
    ];
  }

  public async estimate(
    estimateDto: EstimateDto,
  ): Promise<EstimateResponse | never> {
    this.assertExchangesExist();

    const { inputAmount, inputCurrency, outputCurrency } = estimateDto;
    const currencyPairsInfo = await Promise.all(
      this.exchanges.map((exchange) =>
        exchange.getCurrencyPairInfo(inputCurrency, outputCurrency),
      ),
    );

    const result = currencyPairsInfo.reduce(
      (
        previousResult: EstimateResponse | null,
        currencyPairInfo: CurrencyPairInfo,
      ): EstimateResponse | null => {
        return !previousResult ||
          currencyPairInfo.price > previousResult.outputAmount
          ? {
              outputAmount: currencyPairInfo.price,
              exchangeName: currencyPairInfo.exchangeName,
            }
          : previousResult;
      },
      null,
    );

    if (!result || !result.outputAmount) {
      throw new Error('Cannot fetch info for the requested currency pair');
    }

    return {
      ...result,
      outputAmount: inputAmount * result.outputAmount,
    };
  }

  public async getRates(
    getRatesDto: GetRatesDto,
  ): Promise<GetRatesResponse | never> {
    this.assertExchangesExist();

    const { baseCurrency, quoteCurrency } = getRatesDto;
    const currencyPairsInfo = await Promise.all(
      this.exchanges.map((exchange) =>
        exchange.getCurrencyPairInfo(baseCurrency, quoteCurrency),
      ),
    );

    return currencyPairsInfo.map((currencyPairInfo) => ({
      exchangeName: currencyPairInfo.exchangeName,
      rate: currencyPairInfo.price,
    }));
  }

  private assertExchangesExist(): void | never {
    if (!this.exchanges.length) {
      throw new Error(
        'Cannot fetch info for the requested currency pair due to the lack of crypto exchanges',
      );
    }
  }
}
