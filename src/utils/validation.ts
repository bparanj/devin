import { ValidationResult, ValidationError } from '../types';

export const validateFeatureData = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // Check if data is an array
  if (!Array.isArray(data)) {
    return {
      isValid: false,
      errors: [{ field: 'data', message: 'Data must be an array' }]
    };
  }

  // Check minimum features requirement (at least 3)
  if (data.length < 3) {
    errors.push({
      field: 'data.length',
      message: 'Must provide at least 3 features for meaningful ranking'
    });
  }

  // Validate each feature entry
  data.forEach((item, index) => {
    // Check feature name
    if (!item.feature || typeof item.feature !== 'string' || item.feature.trim() === '') {
      errors.push({
        field: `data[${index}].feature`,
        message: `Feature at index ${index} must have a non-empty string name`
      });
    }

    // Check importance value
    if (
      item.importance === undefined ||
      item.importance === null ||
      typeof item.importance !== 'number' ||
      isNaN(item.importance)
    ) {
      errors.push({
        field: `data[${index}].importance`,
        message: `Feature "${item.feature || index}" must have a valid numeric importance value`
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};
