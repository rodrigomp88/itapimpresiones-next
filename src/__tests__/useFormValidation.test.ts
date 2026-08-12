import { renderHook, act } from "@testing-library/react";
import { useFormValidation } from "../hooks/useFormValidation";
import { z } from "zod";

const testSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(18, "Must be at least 18"),
});

describe("useFormValidation", () => {
  it("should validate valid data", () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    act(() => {
      const isValid = result.current.validate({ name: "John", age: 25 });
      expect(isValid).toBe(true);
    });

    expect(result.current.hasErrors).toBe(false);
    expect(result.current.validationErrors).toEqual({});
  });

  it("should return errors for invalid data", () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    act(() => {
      const isValid = result.current.validate({ name: "", age: 16 });
      expect(isValid).toBe(false);
    });

    expect(result.current.hasErrors).toBe(true);
    expect(result.current.validationErrors.name).toBe("Name is required");
    expect(result.current.validationErrors.age).toBe("Must be at least 18");
  });

  it("should clear errors", () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    act(() => {
      result.current.validate({ name: "", age: 16 });
    });

    expect(result.current.hasErrors).toBe(true);

    act(() => {
      result.current.clearErrors();
    });

    expect(result.current.hasErrors).toBe(false);
    expect(result.current.validationErrors).toEqual({});
  });

  it("should set custom error", () => {
    const { result } = renderHook(() => useFormValidation(testSchema));

    act(() => {
      result.current.setError("name", "Custom error");
    });

    expect(result.current.validationErrors.name).toBe("Custom error");
    expect(result.current.hasErrors).toBe(true);
  });
});
