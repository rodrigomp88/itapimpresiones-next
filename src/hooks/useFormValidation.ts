import { useState } from "react";
import { z } from "zod";

type ValidationSchema = z.ZodSchema<unknown>;
type FormData = Record<string, unknown>;
type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function useFormValidation<T extends FormData>(
  schema: ValidationSchema
) {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors<T>>(
    {}
  );

  const validate = (data: T): boolean => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errors: ValidationErrors<T> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof T;
        errors[field] = issue.message;
      });
      setValidationErrors(errors);
      return false;
    }
    setValidationErrors({});
    return true;
  };

  const clearErrors = () => {
    setValidationErrors({});
  };

  const setError = (field: keyof T, message: string) => {
    setValidationErrors((prev) => ({ ...prev, [field]: message }));
  };

  return {
    validationErrors,
    validate,
    clearErrors,
    setError,
    hasErrors: Object.keys(validationErrors).length > 0,
  };
}
