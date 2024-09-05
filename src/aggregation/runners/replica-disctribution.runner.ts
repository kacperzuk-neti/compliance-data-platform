import { PrismaService } from 'src/db/prisma.service';
import { PrismaDmobService } from 'src/db/prismaDmob.service';
import { AggregationRunner } from '../aggregation-runner';

export class ReplicaDistributionRunner implements AggregationRunner {
  run(
    prismaService: PrismaService,
    prismaDmobService: PrismaDmobService,
  ): void {
    // todo: implement
    console.log('retrieving and storing Replica Distributions');
  }
}
