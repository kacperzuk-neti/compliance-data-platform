export class HistogramDto {
  valueFromExclusive: number | null;
  valueToExclusive: number | null;
  week: Date;
  count: number | null;

  constructor(
    valueFromExclusive: number | null,
    valueToExclusive: number | null,
    week: Date,
    count: number | null,
  ) {
    this.valueFromExclusive = valueFromExclusive;
    this.valueToExclusive = valueToExclusive;
    this.week = week;
    this.count = count;
  }
}
