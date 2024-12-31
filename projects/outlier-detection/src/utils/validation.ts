export const validateDataPoint = (point: any): string[] => {
  const errors: string[] = [];

  // Check if id exists and is a string
  if (!point.id || typeof point.id !== 'string') {
    errors.push('ID must be a non-empty string');
  }

  // Check if x and y are valid numbers
  if (typeof point.x !== 'number' || isNaN(point.x)) {
    errors.push('X coordinate must be a valid number');
  }
  if (typeof point.y !== 'number' || isNaN(point.y)) {
    errors.push('Y coordinate must be a valid number');
  }

  // Check outlier field
  if (typeof point.outlier !== 'boolean' && 
      point.outlier !== 'outlier' && 
      point.outlier !== 'normal') {
    errors.push('Outlier must be a boolean or "outlier"/"normal" string');
  }

  return errors;
};

export const validateDataset = (data: any[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if data is an array
  if (!Array.isArray(data)) {
    return { isValid: false, errors: ['Data must be an array'] };
  }

  // Check minimum points requirement
  if (data.length < 5) {
    errors.push('Dataset must contain at least 5 points');
  }

  // Validate each point
  data.forEach((point, index) => {
    const pointErrors = validateDataPoint(point);
    if (pointErrors.length > 0) {
      errors.push(`Point ${index + 1}: ${pointErrors.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};
