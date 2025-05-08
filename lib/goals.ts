import { supabase } from '~/utils/supabase';

async function updateGoals(newGoal: Record<string, any>, userId: string) {
  const { data: existingData, error: fetchError } = await supabase
    .from('users')
    .select('nutritionalGoals')
    .eq('uid', userId)
    .single();

  if (fetchError) {
    console.error('Error fetching existing goals:', fetchError);
    return null;
  }

  const updatedGoals = { ...existingData.nutritionalGoals, ...newGoal };

  const { data, error: updateError } = await supabase
    .from('users')
    .update({ nutritionalGoals: updatedGoals })
    .eq('uid', userId)
    .select();

  if (updateError) {
    console.error('Error updating JSONB column:', updateError);
    return null;
  }

  console.log('Successfully updated goals');
  return data;
}
