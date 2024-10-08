import { HistogramWeekDto } from './histogramWeek.dto';

export class HistogramWeekResponseDto {
  total: number;
  results: HistogramWeekDto[];

  constructor(total: number, results: HistogramWeekDto[]) {
    this.total = total;
    this.results = results;
  }
}
