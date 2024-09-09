import { PrismaService } from 'src/db/prisma.service';
import { PrismaDmobService } from 'src/db/prismaDmob.service';
import { AggregationRunner } from '../aggregation-runner';
import { AggregationTable } from '../aggregation-table';

export class ProviderRetrievabilityRunner implements AggregationRunner {
  async run(
    prismaService: PrismaService,
    prismaDmobService: PrismaDmobService,
  ): Promise<void> {
    // TODO - needs to download from filspark using HTTP
    // TODO - needs to store some meta data in DB to only fetch once a day, despite being run hourly
  }

  getFilledTables(): AggregationTable[] {
    return [AggregationTable.ProviderRetrievabilityDaily];
  }

  getDependingTables(): AggregationTable[] {
    return [];
  }

  getName(): string {
    return 'Provider Retrievability Runner';
  }
}
