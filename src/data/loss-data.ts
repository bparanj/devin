import { DataPoint } from '../types/index';

export const sampleLossData: DataPoint[] = [
  { epoch: 1, run: "lr=0.01,batch=32", loss: 0.90 },
  { epoch: 2, run: "lr=0.01,batch=32", loss: 0.78 },
  { epoch: 3, run: "lr=0.01,batch=32", loss: 0.66 },
  { epoch: 4, run: "lr=0.01,batch=32", loss: 0.60 },
  { epoch: 5, run: "lr=0.01,batch=32", loss: 0.57 },
  { epoch: 1, run: "lr=0.001,batch=64", loss: 0.92 },
  { epoch: 2, run: "lr=0.001,batch=64", loss: 0.85 },
  { epoch: 3, run: "lr=0.001,batch=64", loss: 0.75 },
  { epoch: 4, run: "lr=0.001,batch=64", loss: 0.71 },
  { epoch: 5, run: "lr=0.001,batch=64", loss: 0.70 }
];
