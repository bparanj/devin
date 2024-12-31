export interface ModelPerformance {
  model: string;
  metric: number;
}

export interface ValidationError {
  message: string;
  field?: string;
}

export const validateModelData = (data: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!Array.isArray(data)) {
    errors.push({ message: "Data must be an array" });
    return errors;
  }

  if (data.length < 2) {
    errors.push({ message: "At least 2 models are required for comparison" });
    return errors;
  }

  data.forEach((item, index) => {
    if (!item.model || typeof item.model !== "string" || item.model.trim() === "") {
      errors.push({
        message: `Invalid model name at index ${index}`,
        field: "model"
      });
    }

    if (typeof item.metric !== "number" || isNaN(item.metric) || item.metric < 0 || item.metric > 1) {
      errors.push({
        message: `Invalid metric value at index ${index}. Must be a number between 0 and 1`,
        field: "metric"
      });
    }
  });

  return errors;
};
