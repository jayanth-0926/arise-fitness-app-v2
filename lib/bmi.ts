import type { BMIResult } from "@/types";

/**
 * Calculates BMI from height (cm) and weight (kg).
 * Returns null if either value is missing or invalid — BMI should never
 * be shown for incomplete data.
 */
export function calculateBMI(
  heightCm: number | null | undefined,
  weightKg: number | null | undefined
): BMIResult | null {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null;

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  let category: BMIResult["category"];
  if (rounded < 18.5) category = "Underweight";
  else if (rounded < 25) category = "Normal range";
  else if (rounded < 30) category = "Overweight";
  else category = "Obesity range";

  return { bmi: rounded, category };
}

export const BMI_DISCLAIMER =
  "BMI is a general screening indicator based on height and weight only. It does not account for muscle mass, bone density, body composition, or individual factors — it isn't a diagnosis. Use it as one data point alongside how you feel and perform in training.";
