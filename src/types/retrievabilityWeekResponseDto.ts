import { HistogramWeekResponseDto } from './histogramWeek.response.dto';

export class RetrievabilityWeekResponseDto {
  averageSuccessRate: number;
  histogram: HistogramWeekResponseDto;

  public static of(
    averageSuccessRate: number,
    histogram: HistogramWeekResponseDto,
  ): RetrievabilityWeekResponseDto {
    const dto = new RetrievabilityWeekResponseDto();

    dto.averageSuccessRate = averageSuccessRate;
    dto.histogram = histogram;

    return dto;
  }
}
