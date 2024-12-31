export interface DataPoint {
  id: string;
  x: number;
  y: number;
  class: string;
}

export type Dataset = DataPoint[];
