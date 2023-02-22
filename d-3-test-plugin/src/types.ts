type SeriesSize = 'sm' | 'md' | 'lg';
type CircleColor = 'red' | 'green' | 'blue';

export interface SimpleOptions {
  color: CircleColor;
  node: string;
  link: string;
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
  removeNode: string;
}
