import { PrismaService } from 'src/db/prisma.service';
import { PrismaDmobService } from 'src/db/prismaDmob.service';
import { FilSparkService } from 'src/filspark/filspark.service';
import { AggregationRunner } from '../aggregation-runner';
import { AggregationTable } from '../aggregation-table';
import { getAllocatorsWeeklyAcc } from '../../../prisma/generated/client/sql';

export class AllocatorsAccRunner implements AggregationRunner {
  async run(
    prismaService: PrismaService,
    _prismaDmobService: PrismaDmobService,
    _filSparkService: FilSparkService,
  ): Promise<void> {
    const result = await prismaService.$queryRawTyped(getAllocatorsWeeklyAcc());

    const data = result.map((row) => ({
      week: row.week,
      allocator: row.allocator,
      num_of_clients: row.num_of_clients,
      biggest_client_sum_of_allocations: row.biggest_client_sum_of_allocations,
      total_sum_of_allocations: row.total_sum_of_allocations,
      avg_weighted_retrievability_success_rate:
        row.avg_weighted_retrievability_success_rate,
    }));

    await prismaService.$executeRaw`truncate allocators_weekly_acc;`;
    await prismaService.allocators_weekly_acc.createMany({ data });
  }

  getFilledTables(): AggregationTable[] {
    return [AggregationTable.AllocatorsWeeklyAcc];
  }

  getDependingTables(): AggregationTable[] {
    return [
      AggregationTable.ClientProviderDistributionWeeklyAcc,
      AggregationTable.ProvidersWeekly,
      AggregationTable.ClientAllocatorDistributionWeeklyAcc,
    ];
  }

  getName(): string {
    return 'Allocators Acc Runner';
  }
}
