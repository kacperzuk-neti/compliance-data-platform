import { PrismaService } from 'src/db/prisma.service';
import { PrismaDmobService } from 'src/db/prismaDmob.service';
import { AggregationRunner } from '../aggregation-runner';
import { AggregationTable } from '../aggregation-table';

export class ProviderRunner implements AggregationRunner {
  getName(): string {
    return 'Provider Aggregation Runner';
  }

  getFilledTables(): AggregationTable[] {
    return [AggregationTable.Providers];
  }

  getDependingTables(): AggregationTable[] {
    return [];
  }
  async run(
    prismaService: PrismaService,
    prismaDmobService: PrismaDmobService,
  ): Promise<void> {
    // todo: implement
    console.log('retrieving and storing Providers');
  }
}
