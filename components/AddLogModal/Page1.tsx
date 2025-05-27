import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { searchIngredientByName } from '~/lib/ingredient';
import { searchRecipeByName } from '~/lib/recipe';
import { Ingredient, InventoryIngredient, InventoryRecipe, NutritionFacts, Recipe } from '~/types';

type ItemsToAdd = Record<string, InventoryIngredient | InventoryRecipe>;

type SearchResultType = {
  recipes: Recipe[];
  ingredients: Ingredient[];
};

type PageProps = {
  addLogIngredient: (
    id: string,
    name: string,
    containers: number,
    servingSize: number,
    numberOfServings: number,
    totalAmount: number,
    unit: string,
    type: string
  ) => void;
  addLogRecipe: (
    id: string,
    name: string,
    servings: number,
    servingSize: number,
    totalAmount: number,
    unit: string,
    type: string
  ) => void;
  nutrition: NutritionFacts;
  setNutrition: React.Dispatch<React.SetStateAction<NutritionFacts>>;
  inventory: ItemsToAdd;
  setInventory: React.Dispatch<React.SetStateAction<ItemsToAdd>>;
  meal: string;
  setMeal: React.Dispatch<React.SetStateAction<string>>;
};

const mealOptions = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
];

export default function Page1({
  addLogIngredient,
  addLogRecipe,
  nutrition,
  setNutrition,
  inventory,
  setInventory,
  meal,
  setMeal,
}: PageProps) {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResultType>({
    recipes: [],
    ingredients: [],
  });

  const searchItem = async () => {
    const ingredients = (await searchIngredientByName(search)) ?? [];
    const recipes = (await searchRecipeByName(search)) ?? [];

    setSearchResult({ ingredients, recipes });
  };

  const addIngredient = (
    id: string,
    name: string,
    containers: number,
    servingSize: number,
    numberOfServings: number,
    totalAmount: number,
    unit: string
  ) => {
    addLogIngredient(
      id,
      name,
      containers,
      servingSize,
      numberOfServings,
      totalAmount,
      unit,
      'ingredient'
    );
    setSearch('');
    setSearchResult({ recipes: [], ingredients: [] });
  };

  const addRecipe = (
    id: string,
    name: string,
    servings: number,
    servingSize: number,
    totalAmount: number,
    unit: string
  ) => {
    addLogRecipe(id, name, servings, servingSize, totalAmount, unit, 'recipe');
    setSearch('');
    setSearchResult({ recipes: [], ingredients: [] });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white p-4">
      <View className="mb-4">
        <Text className="mb-2 text-xl font-semibold text-gray-800">Meal</Text>
        <Dropdown
          data={mealOptions}
          value={meal}
          onChange={(item) => setMeal(item.value)}
          labelField="label"
          valueField="value"
          placeholder="Select a meal"
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2 text-xl font-semibold text-gray-800">Food Name</Text>
        <View className="flex-row space-x-2">
          <TextInput
            placeholder="e.g. Chicken Salad"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={searchItem}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-base"
          />
          <TouchableOpacity
            onPress={searchItem}
            className="justify-center rounded-md bg-gray-800 px-4">
            <Text className="font-semibold text-white">Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <FlatList
        data={[...searchResult.ingredients, ...searchResult.recipes]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          'ingredientList' in item ? (
            <LogRecipeInfo
              recipe={item}
              add={addRecipe}
              inventory={inventory}
              setInventory={setInventory}
              setNutrition={setNutrition}
              nutrition={nutrition}
            />
          ) : (
            <LogIngredientInfo
              ingredient={item}
              add={addIngredient}
              inventory={inventory}
              setInventory={setInventory}
              setNutrition={setNutrition}
              nutrition={nutrition}
            />
          )
        }
        ItemSeparatorComponent={() => <View className="h-2" />}
      /> */}
    </KeyboardAvoidingView>
  );
}
