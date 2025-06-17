import { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';
import { Recipe } from '~/types';
import Feather from '@expo/vector-icons/Feather';
import { fetchRecipeIngredients } from '~/lib/recipe';

type Props = {
  recipe: Recipe;
};

function formatNumber(value: number) {
  return value % 1 === 0 ? value : value.toFixed(2);
}

export default function RecipeListItem({ recipe }: Props) {
  const [open, setOpen] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [ingredientList, setIngredientList] = useState();
  const [showPerServing, setShowPerServing] = useState(true);

  const fetchIngredientList = async () => {
    const fetchData = await fetchRecipeIngredients(recipe.ingredientList);
    setIngredientList(fetchData);
  };

  return (
    <View className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className={`flex-row items-center justify-between bg-gray-800 px-4 py-3 ${
          open ? 'rounded-b-none' : 'rounded-md'
        }`}>
        <Text className="text-xl font-semibold text-white">{recipe.name}</Text>
        {open ? (
          <Feather name="chevron-up" size={24} color="white" />
        ) : (
          <Feather name="chevron-down" size={24} color="white" />
        )}
      </TouchableOpacity>

      {open && (
        <View className="rounded-b-md border-[3px] border-t-0 border-gray-800 bg-white p-4">
          <View className="mb-2 border-b-8 border-gray-800 pb-2">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-base text-gray-800">
                  {recipe.numberOfServings} Servings Per Recipe
                </Text>
              </View>

              {/* <Pressable onPress={() => setShowRecipe(!showRecipe)}>
                {showRecipe ? <Text>View Nutrients</Text> : <Text>View Recipe</Text>}
              </Pressable> */}
              {showRecipe ? (
                <Pressable
                  onPress={() => setShowRecipe(false)}
                  className="min-w-[8.5rem] rounded-md bg-gray-800 px-2 py-1">
                  <Text className="text-center font-semibold text-white">View Nutrients</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => {
                    setShowRecipe(true);
                    fetchIngredientList();
                  }}
                  className="min-w-[8.5rem] rounded-md bg-gray-800 px-2 py-1">
                  <Text className="text-center font-semibold text-white">View Recipe</Text>
                </Pressable>
              )}
            </View>
          </View>
          {showRecipe ? (
            ingredientList &&
            Object.entries(ingredientList).map((key) => {
              return (
                <View
                  key={key[0]}
                  className="mb-3 flex-row items-center justify-between rounded-lg bg-gray-200 px-3 py-2">
                  <Text className="text-md font-semibold text-gray-800">{key[1].name}</Text>
                  {recipe.ingredientList[key[0]]?.servingSize &&
                    recipe.ingredientList[key[0]]?.numberOfServings && (
                      <Text className="text-md font-medium text-gray-800">
                        {recipe.ingredientList[key[0]].servingSize *
                          recipe.ingredientList[key[0]].numberOfServings}
                        {`${key[1].servingUnit}`}
                      </Text>
                    )}
                </View>
              );
            })
          ) : (
            <View>
              <View className="mb-2 flex-row items-center gap-2">
                <Pressable
                  onPress={() => setShowPerServing(true)}
                  className={`rounded-md px-3 py-1 ${
                    showPerServing ? 'bg-gray-800' : 'bg-gray-300'
                  }`}>
                  <Text
                    className={`min-w-20 text-center text-sm font-semibold ${showPerServing ? 'text-white' : 'text-gray-800'}`}>
                    Per Serving
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowPerServing(false)}
                  className={`rounded-md px-3 py-1 ${
                    !showPerServing ? 'bg-gray-800' : 'bg-gray-300'
                  }`}>
                  <Text
                    className={`min-w-20 text-center text-sm font-semibold ${!showPerServing ? 'text-white' : 'text-gray-800'}`}>
                    Per Recipe
                  </Text>
                </Pressable>
              </View>
              <View className="gap-1">
                {(Object.keys(NUTRITIONAL_KEYS) as Array<keyof Recipe>).map((key) => {
                  const value = recipe[key];
                  if (value === null || value === undefined || typeof value !== 'number')
                    return null;

                  const unit = NUTRITIONAL_UNITS[key];

                  return (
                    <View key={key} className="flex-row justify-between">
                      <Text className="text-base">{NUTRITIONAL_KEYS[key]}</Text>
                      <Text className="text-base">
                        {showPerServing
                          ? formatNumber(value / recipe.numberOfServings)
                          : formatNumber(value)}
                        {unit}
                      </Text>
                    </View>
                  );
                })}

                {Object.entries(recipe.extraNutrition ?? {}).map(([key, val]) => {
                  if (val.value == null) return null;

                  const unit = val.unit === 'percent' ? '%' : val.unit;

                  return (
                    <View key={key} className="flex-row justify-between">
                      <Text className="text-base">{val.label}</Text>
                      <Text className="text-base">
                        {showPerServing
                          ? formatNumber(val.value / recipe.numberOfServings)
                          : formatNumber(val.value)}
                        {unit}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
