import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AggregationService } from './aggregation.service';

@Injectable()
export class AggregationTasksService {
  private readonly logger = new Logger(AggregationTasksService.name);
  private aggregationJobInProgress = false;

  constructor(private readonly aggregationService: AggregationService) {}

  @Cron("59 19 * * * *")
  async runAggregationJob() {
    if (!this.aggregationJobInProgress) {
      this.aggregationJobInProgress = true;

      let success = false;
      let executionNumber = 0;
      //retry up to 3 times in case of error
      while (!success && executionNumber < 3) {
        try {
          this.logger.debug('Starting Aggregations');

          await this.aggregationService.runAggregations();
          success = true;

          this.logger.debug('Finished Aggregations');
        } catch (err) {
          this.logger.error(
            `Error during Aggregations job, execution ${executionNumber}: ${err}`,
          );
          executionNumber++;
        }
      }

      this.aggregationJobInProgress = false;
    } else {
      this.logger.debug(
        'Aggregations job still in progress - skipping next execution',
      );
    }
  }
}
