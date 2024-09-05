import { PrismaService } from '../db/prisma.service';
import { PrismaDmobService } from '../db/prismaDmob.service';

export interface AggregationRunner {
  run(prismaService: PrismaService, prismaDmobService: PrismaDmobService): void;
}
