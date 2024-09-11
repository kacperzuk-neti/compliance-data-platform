import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaDmobService } from '../db/prismaDmob.service';
import { AggregationRunner } from './aggregation-runner';
import { PrismaService } from '../db/prisma.service';
import { AggregationTable } from './aggregation-table';
import { FilSparkService } from 'src/filspark/filspark.service';

@Injectable()
export class AggregationService {
  private readonly logger = new Logger(AggregationService.name);

  constructor(
    private readonly prismaDmobService: PrismaDmobService,
    private readonly prismaService: PrismaService,
    private readonly filSparkService: FilSparkService,
    @Inject('AggregationRunner')
    private readonly aggregationRunners: AggregationRunner[],
  ) {}

  async runAggregations() {
    const filledTables: AggregationTable[] = [];
    const pendingAggregationRunners = Object.assign(
      [],
      this.aggregationRunners,
    );

    while (pendingAggregationRunners.length > 0) {
      let executedRunners = 0;
      for (const aggregationRunner of this.aggregationRunners) {
        if (
          pendingAggregationRunners.indexOf(aggregationRunner) > -1 &&
          aggregationRunner
            .getDependingTables()
            .every((p) => filledTables.includes(p))
        ) {
          // execute runner
          this.logger.debug(`STARTING: ${aggregationRunner.getName()}`);

          await aggregationRunner.run(
            this.prismaService,
            this.prismaDmobService,
            this.filSparkService,
          );
          this.logger.debug(`FINISHED: ${aggregationRunner.getName()}`);
          executedRunners++;

          // store filled tables
          filledTables.push(...aggregationRunner.getFilledTables());

          // remove from pending runners
          pendingAggregationRunners.splice(
            pendingAggregationRunners.indexOf(aggregationRunner),
            1,
          );
        }
      }
      if (executedRunners === 0) {
        this.logger.error(
          'Cannot execute runners - impossible dependencies defined',
        );
        break;
      }
    }
  }
}
