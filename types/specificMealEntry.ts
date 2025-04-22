import { IngredientMeal } from "./ingredientMeal";
import { NutritionFacts } from "./nutritionFacts";
import { RecipeMeal } from "./recipeMeal";

export type SpecificMealEntry = {
  food: Record<string, IngredientMeal | RecipeMeal>;
  meal: "breakfast" | "lunch" | "dinner" | "snack" | "miscellaneous";
  nutrition: NutritionFacts;
};
