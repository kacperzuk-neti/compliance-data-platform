import { HistogramWeekDto } from './histogramWeek.dto';

export class ProviderClientsResponseDto {
  total: number;
  results: HistogramWeekDto[];

  constructor(total: number, results: HistogramWeekDto[]) {
    this.total = total;
    this.results = results;
  }
}
