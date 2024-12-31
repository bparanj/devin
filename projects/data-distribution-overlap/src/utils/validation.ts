import type { DataPoint, Dataset } from '../types';

export const validateDataPoint = (point: unknown): { isValid: boolean; error?: string; point?: DataPoint } => {
  if (!point || typeof point !== 'object') {
    return { isValid: false, error: 'Invalid data point' };
  }

  const p = point as Record<string, unknown>;
  if (!p.id || typeof p.id !== 'string') {
    return { isValid: false, error: 'Invalid or missing id' };
  }

  if (typeof p.x !== 'number' || isNaN(p.x)) {
    return { isValid: false, error: 'Invalid x coordinate' };
  }

  if (typeof p.y !== 'number' || isNaN(p.y)) {
    return { isValid: false, error: 'Invalid y coordinate' };
  }

  if (!p.class || typeof p.class !== 'string') {
    return { isValid: false, error: 'Invalid or missing class' };
  }

  const validPoint: DataPoint = {
    id: p.id,
    x: p.x,
    y: p.y,
    class: p.class
  };

  return { isValid: true, point: validPoint };
};

export const validateDataset = (data: unknown): { isValid: boolean; error?: string; data?: Dataset } => {
  if (!Array.isArray(data)) {
    return { isValid: false, error: 'Data must be an array' };
  }

  if (data.length < 6) {
    return { isValid: false, error: 'Dataset must contain at least 6 points' };
  }

  const validatedPoints: Dataset = [];
  
  for (const point of data) {
    const validation = validateDataPoint(point);
    if (!validation.isValid || !validation.point) {
      return { isValid: false, error: validation.error };
    }
    validatedPoints.push(validation.point);
  }

  return { isValid: true, data: validatedPoints };
};
