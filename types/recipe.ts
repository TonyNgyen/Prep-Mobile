export type Recipe = {
  id: string;
  name: string;
  ingredientList: Record<
    string,
    { servingSize: number; numberOfServings: number }
  >;
  pricePerServing: number | null;
  numberOfServings: number;
  servingSize: number;
  servingUnit: string;
  calories: number | null;
  protein: number | null;
  totalFat: number | null;
  saturatedFat: number | null;
  polyunsaturatedFat: number | null;
  monounsaturatedFat: number | null;
  transFat: number | null;
  cholesterol: number | null;
  sodium: number | null;
  potassium: number | null;
  totalCarbohydrates: number | null;
  dietaryFiber: number | null;
  totalSugars: number | null;
  addedSugars: number | null;
  sugarAlcohols: number | null;
  vitaminA: number | null;
  vitaminC: number | null;
  vitaminD: number | null;
  calcium: number | null;
  iron: number | null;
  extraNutrition: Record<
    string,
    { key: string; label: string | null; unit: string | null; value: number }
  >;
};
