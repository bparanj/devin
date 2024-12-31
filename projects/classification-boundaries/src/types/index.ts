export interface Point {
  id: string;
  x: number;
  y: number;
  class: string;
}

export interface BoundaryPoint {
  x: number;
  y: number;
  predictedClass: string;
}

export interface ClassificationData {
  points: Point[];
  boundary: BoundaryPoint[];
}

export const isValidPoint = (point: any): point is Point => {
  return (
    typeof point === 'object' &&
    typeof point.id === 'string' &&
    typeof point.x === 'number' &&
    !isNaN(point.x) &&
    typeof point.y === 'number' &&
    !isNaN(point.y) &&
    typeof point.class === 'string'
  );
};

export const isValidBoundaryPoint = (point: any): point is BoundaryPoint => {
  return (
    typeof point === 'object' &&
    typeof point.x === 'number' &&
    !isNaN(point.x) &&
    typeof point.y === 'number' &&
    !isNaN(point.y) &&
    typeof point.predictedClass === 'string'
  );
};

export const isValidClassificationData = (data: any): data is ClassificationData => {
  return (
    typeof data === 'object' &&
    Array.isArray(data.points) &&
    Array.isArray(data.boundary) &&
    data.points.length >= 4 && // Minimum points requirement
    data.points.every(isValidPoint) &&
    data.boundary.every(isValidBoundaryPoint) &&
    hasAdequateGridCoverage(data)
  );
};

const hasAdequateGridCoverage = (data: ClassificationData): boolean => {
  if (data.points.length === 0 || data.boundary.length === 0) return false;

  const pointsXMin = Math.min(...data.points.map(p => p.x));
  const pointsXMax = Math.max(...data.points.map(p => p.x));
  const pointsYMin = Math.min(...data.points.map(p => p.y));
  const pointsYMax = Math.max(...data.points.map(p => p.y));

  const boundaryXMin = Math.min(...data.boundary.map(p => p.x));
  const boundaryXMax = Math.max(...data.boundary.map(p => p.x));
  const boundaryYMin = Math.min(...data.boundary.map(p => p.y));
  const boundaryYMax = Math.max(...data.boundary.map(p => p.y));

  // Boundary should extend slightly beyond the points
  return (
    boundaryXMin <= pointsXMin &&
    boundaryXMax >= pointsXMax &&
    boundaryYMin <= pointsYMin &&
    boundaryYMax >= pointsYMax
  );
};
