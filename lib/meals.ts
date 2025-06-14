import { IngredientMeal, InventoryIngredient, InventoryRecipe, Recipe, RecipeMeal } from '~/types';
import { supabase } from '~/utils/supabase';
import { searchIngredientById } from './ingredient';
import { searchRecipeById } from './recipe';
import {
  extractNutritionFacts,
  isInventoryIngredient,
  isInventoryRecipe,
  subtractNutrition,
} from './helpers';

type DailyMealEntry = {
  food: {
    [foodId: string]: InventoryIngredient | InventoryRecipe;
  };
  meal: string;
};

type ItemsToAdd = Record<string, InventoryIngredient | InventoryRecipe>;

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
  userId: string | undefined
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
  userId: string | undefined
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
  userId: string | undefined
) => {
  try {
    let foodInformation;

    if (food.type === 'ingredient') {
      foodInformation = await searchIngredientById(food.id);
    } else if (food.type === 'recipe') {
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

const addToUserMealHistory = async (
  meal: string,
  information: {
    food: ItemsToAdd;
  },
  date: string,
  userId: string | undefined
) => {
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
  const mealsForDay = mealHistory[date];

  if (!mealsForDay) {
    updateUserMealHistory(date, meal, { ...information, meal: meal }, userId);
    return;
  }

  const existingMealEntry: DailyMealEntry | undefined = mealHistory[date][meal];
  if (existingMealEntry) {
    Object.keys(information.food).forEach((id) => {
      const foodItem = information.food[id];

      if (id in existingMealEntry.food) {
        const existingItem = existingMealEntry.food[id];

        if (isInventoryIngredient(existingItem) && isInventoryIngredient(foodItem)) {
          existingItem.containers += foodItem.containers;
          existingItem.numberOfServings += foodItem.numberOfServings;
          existingItem.totalAmount += foodItem.totalAmount;
        } else if (isInventoryRecipe(existingItem) && isInventoryRecipe(foodItem)) {
          existingItem.numberOfServings += foodItem.numberOfServings;
          existingItem.totalAmount += foodItem.totalAmount;
        }
      } else {
        existingMealEntry.food[id] = foodItem;
      }
    });

    updateUserMealHistory(date, meal, existingMealEntry, userId);
    return;
  } else {
    updateUserMealHistory(date, meal, { ...information, meal: meal }, userId);
    return;
  }
};

export {
  fetchUserDailyMealHistory,
  deleteUserMealFromMealHistory,
  deleteUserMealFromNutritionalHistory,
  addToUserMealHistory,
};
