import { PrismaService } from 'src/db/prisma.service';
import { PrismaDmobService } from 'src/db/prismaDmob.service';
import { AggregationRunner } from '../aggregation-runner';
import { AggregationTable } from '../aggregation-table';
import { Prisma } from '../../../prisma/generated/client';
import SortOrder = Prisma.SortOrder;

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
    const providers = await prismaDmobService.dc_allocation_claim.findMany({
      select: {
        providerId: true,
        clientId: true,
      },
      where: {
        termStart: {
          gt: 0,
        },
        removed: false,
      },
      distinct: ['providerId'],
      orderBy: [{ providerId: SortOrder.asc }, { termStart: SortOrder.asc }],
    });

    await prismaService.providers.deleteMany({});

    await prismaService.providers.createMany({
      data: providers.map((dmobProvider) => {
        return {
          provider: `f0${dmobProvider.providerId}`,
          first_client: `f0${dmobProvider.clientId}`,
        };
      }),
    });
  }
}
