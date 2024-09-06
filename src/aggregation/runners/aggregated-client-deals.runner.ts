import { PrismaService } from 'src/db/prisma.service';
import { PrismaDmobService } from 'src/db/prismaDmob.service';
import { AggregationRunner } from '../aggregation-runner';
import { AggregationTable } from '../aggregation-table';

export class AggregatedClientDealsRunner implements AggregationRunner {
  async run(
    prismaService: PrismaService,
    prismaDmobService: PrismaDmobService,
  ): Promise<void> {
    const result = await prismaDmobService.$queryRaw<
      {
        client: string;
        term_start_from: number;
        term_start_to: number;
        total_deal_size: number;
      }[]
    >`
        with aggregates as (select 'f0' || "clientId"      as client,
                                   "termStart" * 30 / 3600 as term_start,
                                   sum("pieceSize")        as total_deal_size
                            from dc_allocation_claim
                            where "termStart" > 0
                              and removed = false
                            group by 1, 2)
        select client                           as "client",
               term_start * 3600 / 30           as "term_start_from",
               (term_start + 1) * 3600 / 30 - 1 as "term_start_to",
               total_deal_size::bigint          as "total_deal_size"
        from aggregates
    `;

    await prismaService.aggregated_client_deals.deleteMany({});

    await prismaService.aggregated_client_deals.createMany({
      data: result.map((dmobResult) => {
        return {
          client: dmobResult.client,
          term_start_from: dmobResult.term_start_from,
          term_start_to: dmobResult.term_start_to,
          total_deal_size: dmobResult.total_deal_size,
        };
      }),
    });
  }

  getFilledTables(): AggregationTable[] {
    return [AggregationTable.AggregatedClientDeals];
  }

  getDependingTables(): AggregationTable[] {
    return [];
  }

  getName(): string {
    return 'Aggregated Client Deals Aggregation Runner';
  }
}
