import { PrismaService } from 'src/db/prisma.service';
import { PrismaDmobService } from 'src/db/prismaDmob.service';
import { FilSparkService } from 'src/filspark/filspark.service';
import { AggregationRunner } from '../aggregation-runner';
import { AggregationTable } from '../aggregation-table';
import { getUnifiedVerifiedDealHourly } from '../../../prismaDmob/generated/client/sql';

export class UnifiedVerifiedDealRunner implements AggregationRunner {
  async run(
    prismaService: PrismaService,
    prismaDmobService: PrismaDmobService,
    _filSparkService: FilSparkService,
  ): Promise<void> {
    const result = await prismaDmobService.$queryRawTyped(
      getUnifiedVerifiedDealHourly(),
    );

    const data = result.map((dmobResult) => ({
      hour: dmobResult.hour,
      client: dmobResult.client,
      provider: dmobResult.provider,
      num_of_claims: dmobResult.num_of_claims,
      total_deal_size: dmobResult.total_deal_size,
    }));

    await prismaService.$executeRaw`truncate unified_verified_deal_hourly;`;
    await prismaService.unified_verified_deal_hourly.createMany({ data });
  }

  getFilledTables(): AggregationTable[] {
    return [AggregationTable.UnifiedVerifiedDealHourly];
  }

  getDependingTables(): AggregationTable[] {
    return [];
  }

  getName(): string {
    return 'Unified Verified Deal Runner';
  }
}
