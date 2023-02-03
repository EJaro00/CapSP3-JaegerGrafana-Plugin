type SeriesSize = 'sm' | 'md' | 'lg';

export interface SimpleOptions {
  // new code
  limit: number;
  // new code
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
}
