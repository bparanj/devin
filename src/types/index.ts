export interface LossDataPoint {
  epoch: number;
  run: string;
  loss: number;
}

export interface GroupedData {
  [key: string]: {
    epochs: number[];
    losses: number[];
  };
}
