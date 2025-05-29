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

export { addToUserNutritionalHistory };
