import { PrismaService } from 'src/db/prisma.service';
import { PrismaDmobService } from 'src/db/prismaDmob.service';
import { AggregationRunner } from '../aggregation-runner';

export class ProviderRunner implements AggregationRunner {
  async run(
    prismaService: PrismaService,
    prismaDmobService: PrismaDmobService,
  ): Promise<void> {
    // todo: implement
    console.log('retrieving and storing Providers');
  }
}
