import { Injectable } from '@nestjs/common';
import { PrismaDmobService } from '../db/prismaDmob.service';

@Injectable()
export class AggregationService {
  constructor(private readonly prismaDmobService: PrismaDmobService) {}

  async runAggregations() {
    //todo: implement
    console.log(await this.prismaDmobService.api_key.findMany());
  }
}
