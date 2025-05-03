import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable, TextInput } from 'react-native';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';
import { Recipe, UserInventory } from '~/types';
import Feather from '@expo/vector-icons/Feather';
import { addRecipeToInventory } from '~/lib/inventory';

type Props = {
  recipe: Recipe;
  add: (
    id: string,
    name: string,
    servings: number,
    servingSize: number,
    totalAmount: number,
    unit: string
  ) => void;
  inventory: UserInventory;
};

export default function RecipeAddToInventoryItem({ recipe, add, inventory }: Props) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addType, setAddType] = useState<string>('numberOfRecipes');
  const [numberOfRecipes, setNumberOfRecipes] = useState<string>('');
  const [numberOfServings, setNumberOfServings] = useState<string>('');

  const handleAddRecipes = () => {
    if (!numberOfRecipes || !recipe.servingSize) {
      alert('Please fill in all fields!');
      return;
    }
    const addToInventoryStatus = addRecipeToInventory(
      inventory,
      recipe,
      {
        id: recipe.id,
        name: recipe.name,
        numberOfServings: parseFloat(numberOfRecipes) * recipe.numberOfServings,
        servingSize: recipe.servingSize,
        totalAmount: parseFloat(numberOfRecipes) * recipe.numberOfServings * recipe.servingSize,
        unit: recipe.servingUnit,
        type: 'recipe',
      },
      true,
      true
    );
    if (addToInventoryStatus[0]) {
      add(
        recipe.id,
        recipe.name,
        parseFloat(numberOfRecipes) * recipe.numberOfServings,
        recipe.servingSize,
        parseFloat(numberOfRecipes) * recipe.numberOfServings * recipe.servingSize,
        recipe.servingUnit
      );
    } else {
      // Implement later
      alert(addToInventoryStatus[1]);
    }
  };

  const handleAddServings = () => {
    if (!numberOfServings) {
      alert('Please fill in all fields!');
      return;
    }
    const addToInventoryStatus = addRecipeToInventory(
      inventory,
      recipe,
      {
        id: recipe.id,
        name: recipe.name,
        numberOfServings: parseFloat(numberOfServings),
        servingSize: recipe.servingSize,
        totalAmount: parseFloat(numberOfServings) * recipe.servingSize,
        unit: recipe.servingUnit,
        type: 'recipe',
      },
      true,
      true
    );
    if (addToInventoryStatus[0]) {
      add(
        recipe.id,
        recipe.name,
        parseFloat(numberOfServings),
        recipe.servingSize,
        parseFloat(numberOfServings) * recipe.servingSize,
        recipe.servingUnit
      );
    } else {
      alert(addToInventoryStatus[1]);
    }
  };

  const handleAdd = () => {
    if (addType == 'numberOfRecipes') {
      handleAddRecipes();
    } else {
      handleAddServings();
    }
  };

  const renderHeading = () => {
    if (adding) {
      return (
        <View
          className={`flex-row items-center justify-between rounded-b-none bg-gray-800 px-4 py-3`}>
          <View className="flex-row gap-2">
            <View className="flex-col items-start gap-1">
              <Text className="text-xl font-semibold text-white">{recipe.name}</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          className={`flex-row items-center justify-between bg-gray-800 px-4 py-3 ${
            open ? 'rounded-b-none' : 'rounded-md'
          }`}
          onPress={() => setOpen(!open)}>
          <View className="flex-row gap-2">
            <Pressable
              className="flex items-center justify-center rounded bg-white px-4"
              onPress={() => setAdding(true)}>
              <Text className="font-bold text-gray-800">Add</Text>
            </Pressable>
            <View className="flex-col items-start gap-1">
              <Text className="text-xl font-semibold text-white">{recipe.name}</Text>
            </View>
          </View>

          {open ? (
            <Feather name="chevron-up" size={24} color="white" />
          ) : (
            <Feather name="chevron-down" size={24} color="white" />
          )}
        </TouchableOpacity>
      );
    }
  };

  const renderInputs = () => {
    if (addType == 'numberOfRecipes') {
      return (
        <View>
          <Text>Number of Recipes</Text>
          <TextInput
            placeholder="Number of Recipes"
            value={numberOfRecipes}
            onChangeText={(v) => setNumberOfRecipes(v)}
            className="h-[40px] flex-1 rounded border border-gray-300 p-2 placeholder:text-gray-300"
          />
        </View>
      );
    } else {
      return (
        <View>
          <Text>Number of Servings</Text>
          <TextInput
            placeholder="Number of Servings"
            value={numberOfServings}
            onChangeText={(v) => setNumberOfServings(v)}
            className="h-[40px] flex-1 rounded border border-gray-300 p-2 placeholder:text-gray-300"
          />
        </View>
      );
    }
  };

  const renderBody = () => {
    if (adding) {
      return (
        <View className="gap-4 rounded-b-md border-[3px] border-t-0 border-gray-800 bg-white p-4">
          <View className="flex-row gap-2">
            <Pressable
              className={`flex-1 rounded border-2 border-gray-800 bg-gray-800 p-2 ${addType != 'numberOfRecipes' && 'opacity-50'}`}
              onPress={() => {
                setAddType('numberOfRecipes');
              }}>
              <Text className="text-center text-lg font-semibold text-white">Recipes</Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded border-2 border-gray-800 bg-gray-800 p-2 ${addType != 'servings' && 'opacity-50'}`}
              onPress={() => {
                setAddType('servings');
              }}>
              <Text className="text-center text-lg font-semibold text-white">Servings</Text>
            </Pressable>
          </View>
          {renderInputs()}
          <View className="flex-row gap-2">
            <Pressable
              className="flex-1 rounded border-2 border-gray-800 p-2"
              onPress={() => {
                setAdding(false);
              }}>
              <Text className="text-center text-lg font-semibold">Cancel</Text>
            </Pressable>
            <Pressable
              className="flex-1 rounded border-2 border-gray-800 bg-gray-800 p-2"
              onPress={() => handleAdd()}>
              <Text className="text-center text-lg font-semibold text-white">Add Food</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    if (open) {
      return (
        <View className="rounded-b-md border-[3px] border-t-0 border-gray-800 bg-white p-4">
          <View className="mb-2 border-b-8 border-gray-800 pb-2">
            <Text className="text-base">{recipe.numberOfServings} Servings Per Recipe</Text>
          </View>

          <View className="gap-1">
            {(Object.keys(NUTRITIONAL_KEYS) as Array<keyof Recipe>).map((key) => {
              const value = recipe[key];
              if (value === null || value === undefined) return null;

              const unit = NUTRITIONAL_UNITS[key];

              return (
                <View key={key} className="flex-row justify-between">
                  <Text className="text-base">{NUTRITIONAL_KEYS[key]}</Text>
                  <Text className="text-base">
                    {value}
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
                    {val.value}
                    {unit}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      );
    }
  };

  return (
    <View className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      {renderHeading()}
      {renderBody()}
    </View>
  );
}
