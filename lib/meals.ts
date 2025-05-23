import { IngredientMeal, InventoryIngredient, InventoryRecipe, Recipe, RecipeMeal } from '~/types';
import { supabase } from '~/utils/supabase';
import { searchIngredientById } from './ingredient';
import { searchRecipeById } from './recipe';
import { extractNutritionFacts, subtractNutrition } from './helpers';

type DailyMealEntry = {
  food: {
    [foodId: string]: InventoryIngredient | InventoryRecipe;
  };
  meal: string;
};

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

const updateUserMealHistory = async (
  date: string,
  meal: string,
  information: DailyMealEntry,
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('mealHistory')
      .eq('uid', userId)
      .single();

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    const mealHistory = data?.mealHistory || {};
    const { error: updateError } = await supabase
      .from('users')
      .update({
        mealHistory: {
          ...mealHistory,
          [date]: {
            ...mealHistory[date],
            [meal]: information,
          },
        },
      })
      .eq('uid', userId);

    if (updateError) {
      console.error('Error updating nutritional history:', updateError);
    } else {
      console.log('Nutritional history updated successfully!');
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

const deleteUserMealFromMealHistory = async (
  date: string,
  meal: string,
  foodId: string,
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('mealHistory')
      .eq('uid', userId)
      .single();

    if (error) {
      console.error('Error fetching meal history:', error);
      return;
    }

    const mealHistory = data?.mealHistory || {};
    const dailyEntry = mealHistory[date]?.[meal] as DailyMealEntry | undefined;

    if (!dailyEntry || !dailyEntry.food?.[foodId]) {
      console.warn('Food entry not found for given date/meal/foodId.');
      return;
    }

    const updatedFood = { ...dailyEntry.food };
    delete updatedFood[foodId];

    const updatedMealEntry: DailyMealEntry = {
      ...dailyEntry,
      food: updatedFood,
    };

    await updateUserMealHistory(date, meal, updatedMealEntry, userId);
  } catch (err) {
    console.error('Failed to remove food:', err);
  }
};

const deleteUserMealFromNutritionalHistory = async (
  date: string,
  meal: string,
  food: IngredientMeal | RecipeMeal,
  userId: string
) => {
  try {
    let foodInformation;

    if (food.type === 'ingredient') {
      foodInformation = await searchIngredientById(food.id);
    } else if (food.type === 'recipe') {
      // Make sure to handle recipes too if needed
      foodInformation = await searchRecipeById(food.id);
    }

    const foodNutrition = extractNutritionFacts(foodInformation);

    const { data, error } = await supabase
      .from('users')
      .select('nutritionalHistory')
      .eq('uid', userId)
      .single();

    if (error) {
      console.error('Error fetching nutritional history:', error);
      return;
    }

    const nutritionalHistory = data?.nutritionalHistory || {};
    const dailyNutrition = nutritionalHistory[date];
    const mealNutrition = dailyNutrition?.[meal];

    if (!dailyNutrition || !mealNutrition) {
      console.warn('Nutrition entry not found for given date/meal.');
      return;
    }

    const updatedNutrition = subtractNutrition(mealNutrition, foodNutrition);

    // Update the correct meal on the correct date
    const updatedNutritionalHistory = {
      ...nutritionalHistory,
      [date]: {
        ...dailyNutrition,
        [meal]: updatedNutrition,
      },
    };

    const { error: updateError } = await supabase
      .from('users')
      .update({ nutritionalHistory: updatedNutritionalHistory })
      .eq('uid', userId);

    if (updateError) {
      console.error('Error updating nutritional history:', updateError);
    } else {
      console.log('Nutritional history updated successfully!');
    }
  } catch (err) {
    console.error('Failed to remove food:', err);
  }
};

export {
  fetchUserDailyMealHistory,
  deleteUserMealFromMealHistory,
  deleteUserMealFromNutritionalHistory,
};
