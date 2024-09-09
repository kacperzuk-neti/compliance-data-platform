import { PrismaService } from 'src/db/prisma.service';
import { PrismaDmobService } from 'src/db/prismaDmob.service';
import { AggregationRunner } from '../aggregation-runner';
import { AggregationTable } from '../aggregation-table';
import { getClientClaimsHourly } from '../../../prisma/generated/client/sql';

export class ClientClaimsRunner implements AggregationRunner {
  async run(
    prismaService: PrismaService,
    prismaDmobService: PrismaDmobService,
  ): Promise<void> {
    const result = await prismaService.$queryRawTyped(getClientClaimsHourly());

    const data = result.map((row) => (
      {
        hour: row.hour,
        client: row.client,
        total_deal_size: row.total_deal_size,
      }
    ));

    await prismaService.$executeRaw`truncate client_claims_hourly;`
    await prismaService.client_claims_hourly.createMany({ data });
  }

  getFilledTables(): AggregationTable[] {
    return [AggregationTable.ClientClaimsHourly];
  }

  getDependingTables(): AggregationTable[] {
    return [AggregationTable.UnifiedVerifiedDealHourly];
  }

  getName(): string {
    return 'Client Claims Runner';
  }
}
