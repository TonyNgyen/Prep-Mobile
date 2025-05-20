import { supabase } from '~/utils/supabase';

const fetchUserDailyMealHistory = async (userId: string | undefined, date: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('mealHistory')
      .eq('uid', userId)
      .single();
    if (!data) {
      return {};
    }
    if (error) console.log(error);
    return data['mealHistory'][date];
  } catch (error) {
    console.log(error);
  }
};

export { fetchUserDailyMealHistory };
