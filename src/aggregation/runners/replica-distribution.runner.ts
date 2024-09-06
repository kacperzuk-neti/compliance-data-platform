import { PrismaService } from 'src/db/prisma.service';
import { PrismaDmobService } from 'src/db/prismaDmob.service';
import { AggregationRunner } from '../aggregation-runner';
import { AggregationTable } from '../aggregation-table';

export class ReplicaDistributionRunner implements AggregationRunner {
  getName(): string {
    return 'Replica Distribution Aggregation Runner';
  }

  async run(
    prismaService: PrismaService,
    prismaDmobService: PrismaDmobService,
  ): Promise<void> {
    // todo: implement
    console.log('retrieving and storing Replica Distributions');
  }

  getFilledTables(): AggregationTable[] {
    return [AggregationTable.ReplicaDistribution];
  }

  getDependingTables(): AggregationTable[] {
    return [AggregationTable.Providers];
  }
}
