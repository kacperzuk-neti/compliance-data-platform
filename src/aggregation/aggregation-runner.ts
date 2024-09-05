import { PrismaService } from '../db/prisma.service';
import { PrismaDmobService } from '../db/prismaDmob.service';
import { AggregationTable } from './aggregation-table';

export interface AggregationRunner {
  run(
    prismaService: PrismaService,
    prismaDmobService: PrismaDmobService,
  ): Promise<void>;

  getFilledTables(): AggregationTable[];

  getDependingTables(): AggregationTable[];

  getName(): string;
}
