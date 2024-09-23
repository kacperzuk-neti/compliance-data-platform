import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { getAllocatorBiggestClientDistribution } from '../../../prisma/generated/client/sql';
import { HistogramHelper } from '../../helper/histogram.helper';

@Injectable()
export class AllocatorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly histogramHelper: HistogramHelper,
  ) {}

  async getAllocatorRetrievability() {
    // todo: implement
  }

  async getAllocatorBiggestClientDistribution() {
    const allocatorCountResult = await this.prismaService.$queryRaw<
      [
        {
          count: number;
        },
      ]
    >`select count(distinct allocator)::int
      from client_allocator_distribution_weekly`;

    return await this.histogramHelper.getWeeklyHistogramResult(
      await this.prismaService.$queryRawTyped(
        getAllocatorBiggestClientDistribution(),
      ),
      allocatorCountResult[0].count,
    );
  }

  async getAllocatorSpsCompliance() {
    // todo: implement
  }
}
