import { supabase } from '~/utils/supabase';

const setUserWeightHistory = async (date: string, weight: number, userId: string | undefined) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('weightHistory')
      .eq('uid', userId)
      .single();

    if (error) {
      console.error('Error fetching weightHistory:', error);
      return null;
    }

    const currentHistory = data?.weightHistory || {};
    const updatedHistory = { ...currentHistory, [date]: weight };

    const { error: updateError } = await supabase
      .from('users')
      .update({ weightHistory: updatedHistory })
      .eq('uid', userId);

    if (updateError) {
      console.error('Error updating weightHistory:', updateError);
      return null;
    }

    return updatedHistory;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

const fetchUserWeightHistory = async (userId: string | undefined) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('weightHistory')
      .eq('uid', userId)
      .single();
    if (!data) {
      return {};
    }
    if (error) console.log(error);
    return data['weightHistory'];
  } catch (error) {
    console.log(error);
  }
};

export { setUserWeightHistory, fetchUserWeightHistory };
