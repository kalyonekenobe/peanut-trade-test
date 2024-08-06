import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { EstimateDto } from './dto/estimate.dto';
import { GetRatesDto } from './dto/get-rates.dto';
import { EstimateResponse, GetRatesResponse } from './types/app.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/estimate')
  public async estimate(
    @Query() estimateDto: EstimateDto,
  ): Promise<EstimateResponse | never> {
    return this.appService.estimate(estimateDto).catch(({ message: error }) => {
      throw new BadRequestException({ error });
    });
  }

  @Get('/getRates')
  public async getRates(
    @Query() getRatesDto: GetRatesDto,
  ): Promise<GetRatesResponse | never> {
    return this.appService.getRates(getRatesDto).catch(({ message: error }) => {
      throw new BadRequestException({ error });
    });
  }
}
