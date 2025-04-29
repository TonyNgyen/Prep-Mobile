import { NutritionFacts } from '~/types';
import { supabase } from '~/utils/supabase';

const fetchUserRecipes = async (userId: string | undefined) => {
  try {
    const { data: fetchUserData, error: fetchUserError } = await supabase
      .from('users')
      .select()
      .eq('uid', userId);

    if (fetchUserError || !fetchUserData || fetchUserData.length === 0) {
      console.error('Error fetching user data:', fetchUserError);
      return;
    }

    const ingredientIdList = fetchUserData[0].recipes;

    const { data: fetchIngredientData, error: fetchIngredientError } = await supabase
      .from('recipes')
      .select()
      .in('id', ingredientIdList);

    if (fetchIngredientError || !fetchIngredientData) {
      console.error('Error fetching recipes:', fetchIngredientError);
      return;
    }

    return fetchIngredientData;
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

const addRecipe = async (
  name: string,
  recipeNutrition: NutritionFacts,
  ingredientList: Object,
  numberOfServings: number,
  servingSize: number,
  servingUnit: string
) => {
  const { data, error } = await supabase
    .from('recipes')
    .insert({
      ...recipeNutrition,
      ...{
        name: name,
        ingredientList: ingredientList,
        servingSize: servingSize,
        servingUnit: servingUnit,
        timesUsed: 0,
        numberOfServings: numberOfServings,
        pricePerServing: 1,
      },
    })
    .select();

  if (error) {
    console.error('Error inserting data:', error.message);
    return false;
  }

  try {
    const recipeid = data?.[0]?.id;
    const { data: userData, error: userError } = await supabase.auth.getUser();

    const userId = userData?.user?.id;
    console.log(userId);

    const { data: insertData } = await supabase.rpc('append_recipe_user', {
      userid: userId,
      recipeid: recipeid,
    });
  } catch (error) {
    console.error('Error adding recipe to user:', error);
  }
  return true;
};

export { fetchUserRecipes, addRecipe };
