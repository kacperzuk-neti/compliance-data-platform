import { PrismaService } from 'src/db/prisma.service';
import { PrismaDmobService } from 'src/db/prismaDmob.service';
import { AggregationRunner } from '../aggregation-runner';
import { AggregationTable } from '../aggregation-table';

export class AggregatedClientDealsRunner implements AggregationRunner {
  async run(
    prismaService: PrismaService,
    prismaDmobService: PrismaDmobService,
  ): Promise<void> {
    // todo: implement
    console.log('retrieving and storing AggregatedClientDeals');
  }

  getFilledTables(): AggregationTable[] {
    return [AggregationTable.AggregatedClientDeals];
  }

  getDependingTables(): AggregationTable[] {
    return [AggregationTable.Providers, AggregationTable.ReplicaDistribution];
  }

  getName(): string {
    return 'Aggregated Client Deals Aggregation Runner';
  }
}
