import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { Ingredient, InventoryIngredient, InventoryRecipe, NutritionFacts } from '~/types';

const isInventoryIngredient = (
  item: InventoryIngredient | InventoryRecipe
): item is InventoryIngredient => {
  return 'containers' in item && 'numberOfServings' in item && 'totalAmount' in item;
};

const isInventoryRecipe = (
  item: InventoryIngredient | InventoryRecipe
): item is InventoryRecipe => {
  return !isInventoryIngredient(item);
};

const addNutrition = (nutrition1: NutritionFacts, nutrition2: NutritionFacts) => {
  Object.keys(NUTRITIONAL_KEYS).map((nutritionalKey) => {
    const key = nutritionalKey as keyof NutritionFacts;

    if (key === 'extraNutrition') return;

    const nutritionalValue = (nutrition2[key] as number | null) ?? 0;

    nutrition1[key] += nutritionalValue;
  });
  Object.keys(nutrition2.extraNutrition).map((key) => {
    const extraNutrition = nutrition2.extraNutrition[key];

    if (!nutrition1.extraNutrition[key]) {
      nutrition1.extraNutrition[key] = { ...extraNutrition, value: 0 };
    }
    nutrition1.extraNutrition[key].value += extraNutrition.value;
  });
  return nutrition1;
};

const subtractNutrition = (
  nutrition1: NutritionFacts,
  nutrition2: NutritionFacts
): NutritionFacts => {
  Object.keys(NUTRITIONAL_KEYS).forEach((nutritionalKey) => {
    const key = nutritionalKey as keyof NutritionFacts;

    if (key === 'extraNutrition') return;

    const valueToSubtract = (nutrition2[key] as number | null) ?? 0;
    const currentValue = (nutrition1[key] as number | null) ?? 0;

    nutrition1[key] = Math.max(currentValue - valueToSubtract, 0) as any;
  });

  Object.keys(nutrition2.extraNutrition).forEach((key) => {
    const extra = nutrition2.extraNutrition[key];

    if (!nutrition1.extraNutrition[key]) {
      nutrition1.extraNutrition[key] = { ...extra, value: 0 };
    }

    const current = nutrition1.extraNutrition[key].value ?? 0;
    nutrition1.extraNutrition[key].value = Math.max(current - extra.value, 0);
  });
  return nutrition1;
};

const flattenNutritionFacts = (nutritionFacts: NutritionFacts): Record<string, number> => {
  const { extraNutrition, ...baseFacts } = nutritionFacts;

  const extraFacts = Object.fromEntries(
    Object.entries(extraNutrition).map(([key, value]) => [key, value.value])
  );

  return {
    ...baseFacts,
    ...extraFacts,
  };
};

const multiplyNutrition = (
  nutrition: NutritionFacts,
  servings: number,
  type: string
): NutritionFacts => {
  const multiplied: NutritionFacts = {
    calories: nutrition.calories * servings,
    protein: nutrition.protein * servings,
    totalFat: nutrition.totalFat * servings,
    saturatedFat: nutrition.saturatedFat * servings,
    polyunsaturatedFat: nutrition.polyunsaturatedFat * servings,
    monounsaturatedFat: nutrition.monounsaturatedFat * servings,
    transFat: nutrition.transFat * servings,
    cholesterol: nutrition.cholesterol * servings,
    sodium: nutrition.sodium * servings,
    potassium: nutrition.potassium * servings,
    totalCarbohydrates: nutrition.totalCarbohydrates * servings,
    dietaryFiber: nutrition.dietaryFiber * servings,
    totalSugars: nutrition.totalSugars * servings,
    addedSugars: nutrition.addedSugars * servings,
    sugarAlcohols: nutrition.sugarAlcohols * servings,
    vitaminA: nutrition.vitaminA * servings,
    vitaminC: nutrition.vitaminC * servings,
    vitaminD: nutrition.vitaminD * servings,
    calcium: nutrition.calcium * servings,
    iron: nutrition.iron * servings,
    extraNutrition: {},
  };

  for (const key in nutrition.extraNutrition) {
    const item = nutrition.extraNutrition[key];
    multiplied.extraNutrition[key] = {
      ...item,
      value: item.value * servings,
    };
  }

  return multiplied;
};

const extractNutritionFacts = (ingredient: Ingredient): NutritionFacts => {
  return {
    calories: ingredient.calories ?? 0,
    protein: ingredient.protein ?? 0,
    totalFat: ingredient.totalFat ?? 0,
    saturatedFat: ingredient.saturatedFat ?? 0,
    polyunsaturatedFat: ingredient.polyunsaturatedFat ?? 0,
    monounsaturatedFat: ingredient.monounsaturatedFat ?? 0,
    transFat: ingredient.transFat ?? 0,
    cholesterol: ingredient.cholesterol ?? 0,
    sodium: ingredient.sodium ?? 0,
    potassium: ingredient.potassium ?? 0,
    totalCarbohydrates: ingredient.totalCarbohydrates ?? 0,
    dietaryFiber: ingredient.dietaryFiber ?? 0,
    totalSugars: ingredient.totalSugars ?? 0,
    addedSugars: ingredient.addedSugars ?? 0,
    sugarAlcohols: ingredient.sugarAlcohols ?? 0,
    vitaminA: ingredient.vitaminA ?? 0,
    vitaminC: ingredient.vitaminC ?? 0,
    vitaminD: ingredient.vitaminD ?? 0,
    calcium: ingredient.calcium ?? 0,
    iron: ingredient.iron ?? 0,
    extraNutrition: ingredient.extraNutrition ?? {},
  };
};

const sumDailyNutrition = (dailyEntry: Record<string, NutritionFacts>): NutritionFacts => {
  const NUTRITIONAL_KEYS = [
    'calories',
    'protein',
    'totalFat',
    'saturatedFat',
    'polyunsaturatedFat',
    'monounsaturatedFat',
    'transFat',
    'cholesterol',
    'sodium',
    'potassium',
    'totalCarbohydrates',
    'dietaryFiber',
    'totalSugars',
    'addedSugars',
    'sugarAlcohols',
    'vitaminA',
    'vitaminC',
    'vitaminD',
    'calcium',
    'iron',
  ] as const;

  type NumericNutritionKey = (typeof NUTRITIONAL_KEYS)[number];

  const total: NutritionFacts = {
    calories: 0,
    protein: 0,
    totalFat: 0,
    saturatedFat: 0,
    polyunsaturatedFat: 0,
    monounsaturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    potassium: 0,
    totalCarbohydrates: 0,
    dietaryFiber: 0,
    totalSugars: 0,
    addedSugars: 0,
    sugarAlcohols: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    calcium: 0,
    iron: 0,
    extraNutrition: {},
  };

  for (const mealNutrition of Object.values(dailyEntry)) {
    NUTRITIONAL_KEYS.forEach((key: NumericNutritionKey) => {
      const value = mealNutrition[key] ?? 0;
      total[key] += value;
    });

    Object.entries(mealNutrition.extraNutrition).forEach(([key, extra]) => {
      if (!total.extraNutrition[key]) {
        total.extraNutrition[key] = { ...extra, value: 0 };
      }
      total.extraNutrition[key].value += extra.value;
    });
  }

  return total;
};

export {
  addNutrition,
  subtractNutrition,
  flattenNutritionFacts,
  multiplyNutrition,
  extractNutritionFacts,
  sumDailyNutrition,
  isInventoryIngredient,
  isInventoryRecipe,
};
