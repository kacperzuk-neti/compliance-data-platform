import { Injectable } from '@nestjs/common';
import { groupBy } from 'lodash';
import { HistogramWeekDto } from '../types/histogramWeek.dto';
import { HistogramDto } from '../types/histogram.dto';
import { HistogramWeekResponseDto } from '../types/histogramWeek.response.dto';

@Injectable()
export class HistogramHelper {
  async getWeeklyHistogramResult(
    results: {
      valueFromExclusive: number | null;
      valueToInclusive: number | null;
      count: number | null;
      week: Date;
    }[],
    totalCount: number,
  ) {
    const resultsByWeek = groupBy(results, (p) => p.week);

    const histogramWeekDtos: HistogramWeekDto[] = [];
    for (const key in resultsByWeek) {
      const value = resultsByWeek[key];
      const weekResponses = value.map((r) => {
        return new HistogramDto(
          r.valueFromExclusive,
          r.valueToInclusive,
          r.count,
        );
      });
      histogramWeekDtos.push(
        new HistogramWeekDto(
          new Date(key),
          weekResponses,
          weekResponses.reduce(
            (partialSum, response) => partialSum + response.count,
            0,
          ),
        ),
      );
    }

    return new HistogramWeekResponseDto(totalCount, histogramWeekDtos);
  }
}
