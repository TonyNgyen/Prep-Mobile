import { NutritionFacts } from '~/types';
import { supabase } from '~/utils/supabase';
import { addNutrition } from './helpers';

const addToUserNutritionalHistory = async (
  date: string,
  nutrition: NutritionFacts,
  meal: string,
  userId: string | undefined
) => {
  const { data, error } = await supabase
    .from('users')
    .select('nutritionalHistory')
    .eq('uid', userId)
    .single();

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  const nutritionalHistory = data?.nutritionalHistory || {};
  const mealsForDay: Record<string, NutritionFacts> = nutritionalHistory[date] || {};

  let updatedMealNutrition: NutritionFacts;

  if (mealsForDay[meal]) {
    updatedMealNutrition = addNutrition({ ...mealsForDay[meal] }, nutrition);
  } else {
    updatedMealNutrition = nutrition;
  }

  const updatedHistory = {
    ...nutritionalHistory,
    [date]: {
      ...mealsForDay,
      [meal]: updatedMealNutrition,
    },
  };

  const { error: updateError } = await supabase
    .from('users')
    .update({ nutritionalHistory: updatedHistory })
    .eq('uid', userId);

  if (updateError) {
    console.error('Error updating nutritional history:', updateError);
  } else {
    console.log('Nutritional history updated successfully!');
  }
};

async function fetchUserDailyNutritionalHistory(date: string, userId: string | undefined) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('nutritionalHistory')
      .eq('uid', userId)
      .single();
    if (!data) {
      return {};
    }
    if (error) console.log(error);
    return data['nutritionalHistory'][date]
      ? data['nutritionalHistory'][date]
      : {
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
  } catch (error) {
    console.log(error);
  }
}

export { addToUserNutritionalHistory, fetchUserDailyNutritionalHistory };
