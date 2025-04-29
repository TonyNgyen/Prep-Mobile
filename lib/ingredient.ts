import { supabase } from '~/utils/supabase';

const fetchUserIngredients = async (userId: string | undefined) => {
  try {
    const { data: fetchUserData, error: fetchUserError } = await supabase
      .from('users')
      .select()
      .eq('uid', userId);

    if (fetchUserError || !fetchUserData || fetchUserData.length === 0) {
      console.error('Error fetching user data:', fetchUserError);
      return;
    }

    const ingredientIdList = fetchUserData[0].ingredients;

    const { data: fetchIngredientData, error: fetchIngredientError } = await supabase
      .from('ingredients')
      .select()
      .in('id', ingredientIdList);

    if (fetchIngredientError || !fetchIngredientData) {
      console.error('Error fetching ingredients:', fetchIngredientError);
      return;
    }

    return fetchIngredientData;
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

const fetchIngredientsByName = async (name: string) => {
  try {
    const { data, error } = await supabase.from('ingredients').select().eq('name', name);
    if (error) {
      console.error('Error fetching ingredient by name: ', error);
    }
    console.log(data);
    return data;
  } catch (error) {
    console.error('Unexpected error: ', error);
  }
};

export { fetchUserIngredients, fetchIngredientsByName };
