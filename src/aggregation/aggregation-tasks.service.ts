import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AggregationService } from './aggregation.service';

@Injectable()
export class AggregationTasksService {
  private readonly logger = new Logger(AggregationTasksService.name);

  constructor(private readonly aggregationService: AggregationService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async runAggregationJob() {
    this.logger.debug('Starting Aggregations');

    await this.aggregationService.runAggregations();

    this.logger.debug('Finished Aggregations');
  }
}
