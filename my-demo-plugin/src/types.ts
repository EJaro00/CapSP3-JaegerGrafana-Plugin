type SeriesSize = 'sm' | 'md' | 'lg';

type CircleColor = 'red' | 'green' | 'blue';

export interface SimpleOptions {
  node: string; // node name
  connection: string // node connection
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;

  color: CircleColor;
}
