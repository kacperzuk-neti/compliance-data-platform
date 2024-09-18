export class HistogramDto {
  valueFromExclusive: number | null;
  valueToExclusive: number | null;
  count: number | null;

  constructor(
    valueFromExclusive: number | null,
    valueToExclusive: number | null,
    count: number | null,
  ) {
    this.valueFromExclusive = valueFromExclusive;
    this.valueToExclusive = valueToExclusive;
    this.count = count;
  }
}
