export interface DataPoint {
  id: string;
  x: number;
  y: number;
  outlier: boolean | 'outlier' | 'normal';
}

export type Dataset = DataPoint[];
