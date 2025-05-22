import { supabase } from '~/utils/supabase';

async function fetchUserNutritionalGoals(userId: string | undefined) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('nutritionalGoals')
      .eq('uid', userId)
      .single();
    if (!data) {
      return {};
    }
    if (error) console.log(error);
    return data['nutritionalGoals'];
  } catch (error) {
    console.log(error);
  }
}

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

async function updateUserNutritionalGoals(
  newGoal: Record<string, any>,
  userId: string | undefined
) {
  try {
    const { data: existingData, error: fetchError } = await supabase
      .from('users')
      .select('nutritionalGoals')
      .eq('uid', userId)
      .single();

    if (fetchError) {
      console.log('Error fetching existing goals:', fetchError);
      return false;
    }

    const updatedGoals = {
      ...(existingData?.nutritionalGoals || {}),
      ...newGoal,
    };

    const { error: updateError } = await supabase
      .from('users')
      .update({ nutritionalGoals: updatedGoals })
      .eq('uid', userId);

    if (updateError) {
      console.log('Error updating nutritional goals:', updateError);
      return false;
    }

    console.log('Nutritional goals updated successfully:', updatedGoals);
    return true;
  } catch (error) {
    console.log('Error:', error);
    return false;
  }
}

export { fetchUserNutritionalGoals, fetchUserDailyNutritionalHistory, updateUserNutritionalGoals };
