import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import {
  getAllocatorBiggestClientDistribution,
  getAllocatorRetrievability,
} from '../../../prisma/generated/client/sql';
import { HistogramHelper } from '../../helper/histogram.helper';
import { RetrievabilityWeekResponseDto } from '../../types/retrievabilityWeekResponseDto';

@Injectable()
export class AllocatorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly histogramHelper: HistogramHelper,
  ) {}

  async getAllocatorRetrievability() {
    const averageSuccessRate =
      await this.prismaService.allocators_weekly.aggregate({
        _avg: {
          avg_weighted_retrievability_success_rate: true,
        },
      });

    const allocatorCountResult = await this.prismaService.$queryRaw<
      [
        {
          count: number;
        },
      ]
    >`select count(distinct allocator)::int
      from client_allocator_distribution_weekly`;

    const weeklyHistogramResult =
      await this.histogramHelper.getWeeklyHistogramResult(
        await this.prismaService.$queryRawTyped(getAllocatorRetrievability()),
        allocatorCountResult[0].count,
      );

    return RetrievabilityWeekResponseDto.of(
      averageSuccessRate._avg.avg_weighted_retrievability_success_rate * 100,
      weeklyHistogramResult,
    );
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
