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

export { fetchUserNutritionalGoals, updateUserNutritionalGoals };
