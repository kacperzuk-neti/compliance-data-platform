import { Inject, Injectable } from '@nestjs/common';
import { PrismaDmobService } from '../db/prismaDmob.service';
import { AggregationRunner } from './aggregation-runner';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class AggregationService {
  constructor(
    private readonly prismaDmobService: PrismaDmobService,
    private readonly prismaService: PrismaService,
    @Inject('AggregationRunner')
    private readonly aggregationRunner: AggregationRunner[],
  ) {}

  async runAggregations() {
    for (const aggregationRunner of this.aggregationRunner) {
      aggregationRunner.run(this.prismaService, this.prismaDmobService);
    }
  }
}
