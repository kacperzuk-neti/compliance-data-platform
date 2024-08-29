import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AggregationTasksService {
  private readonly logger = new Logger(AggregationTasksService.name);

  @Cron(CronExpression.EVERY_HOUR)
  runAggregation() {
    //todo: implement
  }
}
