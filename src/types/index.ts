export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};
