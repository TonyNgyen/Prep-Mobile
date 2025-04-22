export type NutritionFacts = {
  calories: number;
  protein: number;
  totalFat: number;
  saturatedFat: number;
  polyunsaturatedFat: number;
  monounsaturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  potassium: number;
  totalCarbohydrates: number;
  dietaryFiber: number;
  totalSugars: number;
  addedSugars: number;
  sugarAlcohols: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  calcium: number;
  iron: number;
  extraNutrition: Record<
    string,
    { key: string; label: string | null; unit: string | null; value: number }
  >;
};
