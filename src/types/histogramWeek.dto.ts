import { HistogramDto } from './histogram.dto';

export class HistogramWeekDto {
  week: Date;
  results: HistogramDto[];
  total: number;

  constructor(week: Date, results: HistogramDto[], total: number) {
    this.week = week;
    this.results = results;
    this.total = total;
  }
}
