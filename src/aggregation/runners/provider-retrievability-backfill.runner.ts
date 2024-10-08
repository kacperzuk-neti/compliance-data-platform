import { PrismaService } from 'src/db/prisma.service';
import { PrismaDmobService } from 'src/db/prismaDmob.service';
import { FilSparkService } from 'src/filspark/filspark.service';
import { AggregationRunner } from '../aggregation-runner';
import { AggregationTable } from '../aggregation-table';
import { DateTime } from 'luxon';

export class ProviderRetrievabilityBackfillRunner implements AggregationRunner {
  // will fetch 1 day worth of data each run until everything is backfilled
  async run(
    prismaService: PrismaService,
    _prismaDmobService: PrismaDmobService,
    filSparkService: FilSparkService,
  ): Promise<void> {
    const retrieved =
      await prismaService.provider_retrievability_daily.findMany({
        distinct: ['date'],
        select: {
          date: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
    if (retrieved.length == 0) return;
    const retrievedUtc = retrieved.map((v) =>
      DateTime.fromJSDate(v.date, { zone: 'UTC' }),
    );
    const cutoff = DateTime.fromISO('2024-04-22T00:00:00', { zone: 'UTC' });

    let latestStored = retrievedUtc[0];
    let backfillDate = null;

    while (latestStored != cutoff) {
      const next = latestStored.minus({ days: 1 });
      if (!retrievedUtc.find((v) => v.equals(next))) {
        backfillDate = next;
        break;
      }
      latestStored = next;
    }

    if (!backfillDate) return;

    const retrievabilityData =
      await filSparkService.fetchRetrievability(backfillDate);

    const data = retrievabilityData.map((row) => ({
      date: backfillDate.toJSDate(),
      provider: row.miner_id,
      total: parseInt(row.total),
      successful: parseInt(row.successful),
      success_rate: row.success_rate,
    }));

    await prismaService.provider_retrievability_daily.createMany({ data });
  }

  getFilledTables(): AggregationTable[] {
    return [];
  }

  getDependingTables(): AggregationTable[] {
    return [];
  }

  getName(): string {
    return 'Provider Retrievability Backfill Runner';
  }
}
