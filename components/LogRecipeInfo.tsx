import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Recipe, InventoryIngredient, InventoryRecipe, NutritionFacts } from '~/types';
import { Feather } from '@expo/vector-icons';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';

type ItemsToAdd = Record<string, InventoryIngredient | InventoryRecipe>;

type InventoryRecipeInfoProps = {
  recipe: Recipe;
  add: (
    id: string,
    name: string,
    servings: number,
    servingSize: number,
    totalAmount: number,
    unit: string
  ) => void;
  inventory: ItemsToAdd;
  setInventory: React.Dispatch<React.SetStateAction<ItemsToAdd>>;
  setNutrition: React.Dispatch<React.SetStateAction<NutritionFacts>>;
  nutrition: NutritionFacts;
};

function LogRecipeInfo({
  recipe,
  add,
  inventory,
  setInventory,
  setNutrition,
  nutrition,
}: InventoryRecipeInfoProps) {
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addType, setAddType] = useState<'numberOfRecipes' | 'servings'>('numberOfRecipes');
  const [numberOfRecipes, setNumberOfRecipes] = useState<string>('1');
  const [servingSize, setServingSize] = useState<string>('1');
  const [numberOfServings, setNumberOfServings] = useState<string>('1');
  const [checkInventory, setCheckInventory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCombinedNutritionData = (recipe: Recipe) => {
    const regularNutrition = Object.keys(NUTRITIONAL_KEYS)
      .filter(
        (key) =>
          recipe[key as keyof typeof recipe] !== null &&
          recipe[key as keyof typeof recipe] !== undefined
      )
      .map((key) => {
        const value = recipe[key as keyof typeof recipe];
        const unit = NUTRITIONAL_UNITS[key as keyof typeof NUTRITIONAL_UNITS];
        return {
          type: 'regular',
          key,
          label: NUTRITIONAL_KEYS[key as keyof typeof NUTRITIONAL_KEYS],
          value: value as number,
          unit,
        };
      });

    const extraNutrition = Object.keys(recipe.extraNutrition || {})
      .filter((key) => recipe.extraNutrition?.[key])
      .map((key) => {
        const extra = recipe.extraNutrition?.[key]!;
        const unit = extra.unit === 'percent' ? '%' : extra.unit;
        return {
          type: 'extra',
          key,
          label: extra.label,
          value: extra.value,
          unit,
        };
      });
    return [...regularNutrition, ...extraNutrition];
  };

  // Validation and helper functions would go here...

  const checkValidInput = () => {
    if (addType == 'numberOfRecipes') {
      if (!numberOfRecipes) {
        setError('Please fill in the number of recipes');
        return false;
      }
    } else {
      if (!servingSize) {
        setError('Please fill in the serving size');
        return false;
      }
      if (!numberOfServings) {
        setError('Please fill in the number of servings');
        return false;
      }
    }
    setError(null);
    return true;
  };
  const handleAddServings = () => {
    if (!numberOfServings) {
      return;
    }
    add(
      recipe.id,
      recipe.name,
      parseFloat(numberOfServings),
      recipe.servingSize,
      parseFloat(numberOfServings) * recipe.servingSize,
      recipe.servingUnit
    );
  };

  const handleAddRecipes = () => {
    if (!numberOfRecipes || !recipe.servingSize) {
      return;
    }
    add(
      recipe.id,
      recipe.name,
      parseFloat(numberOfRecipes) * recipe.numberOfServings,
      recipe.servingSize,
      parseFloat(numberOfRecipes) * recipe.numberOfServings * recipe.servingSize,
      recipe.servingUnit
    );
  };

  const updateInventoryAmount = (total: number) => {
    setInventory((prevInventory) => ({
      ...prevInventory,
      [recipe.id]: {
        ...prevInventory[recipe.id],
        totalAmount: prevInventory[recipe.id].totalAmount - total,
      },
    }));
  };

  const checkInventoryAmount = () => {
    if (addType == 'numberOfRecipes') {
      if (!numberOfRecipes) {
        setError('Please fill in the number of recipes');
        return false;
      }
      if (!inventory[recipe.id]) {
        setError('Food not in inventory');
        return false;
      }
      const total = parseFloat(numberOfRecipes) * recipe.servingSize * recipe.numberOfServings;
      if (total > inventory[recipe.id].totalAmount) {
        setError('Not enough amount in inventory');
        return false;
      }
    } else {
      if (!servingSize) {
        setError('Please fill in the serving size');
        return false;
      }
      if (!numberOfServings) {
        setError('Please fill in the number of servings');
        return false;
      }
      if (!inventory[recipe.id]) {
        setError('Food not in inventory');
        return false;
      }
      const total = parseFloat(servingSize) * parseFloat(numberOfServings);
      if (total > inventory[recipe.id].totalAmount) {
        setError('Not enough amount in inventory');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleAdd = () => {
    if (addType == 'numberOfRecipes') {
      if (!numberOfRecipes) {
        setError('Please fill in the number of recipes');
        return false;
      }
      if (!checkValidInput()) {
        return;
      }
      if (checkInventory) {
        if (!checkInventoryAmount()) {
          return;
        }
        const total = parseFloat(numberOfRecipes) * recipe.servingSize * recipe.numberOfServings;
        updateInventoryAmount(total);
      }
      handleAddRecipes();
    } else {
      if (!servingSize) {
        setError('Please fill in the serving size');
        return;
      }
      if (!numberOfServings) {
        setError('Please fill in the number of servings');
        return;
      }
      if (checkInventory) {
        if (!checkInventoryAmount()) {
          return;
        }
        const total = parseFloat(servingSize) * parseFloat(numberOfServings);
        updateInventoryAmount(total);
      }
      handleAddServings();
    }
    addNutrition();
  };

  const addNutrition = () => {
    let multiplier;
    if (addType == 'numberOfRecipes') {
      multiplier = parseFloat(numberOfRecipes ?? 0) * recipe.numberOfServings;
    } else {
      multiplier =
        (parseFloat(servingSize ?? 0) * parseFloat(numberOfServings ?? 0)) /
        (recipe.servingSize * recipe.numberOfServings);
    }
    const newNutrition = { ...nutrition };

    Object.keys(NUTRITIONAL_KEYS).map((nutritionalKey) => {
      const key = nutritionalKey as keyof NutritionFacts;

      if (key === 'extraNutrition') return;

      const recipeValue = (recipe[key] as number | null) ?? 0;

      newNutrition[key] += recipeValue * multiplier;
    });
    Object.keys(recipe.extraNutrition).map((key) => {
      const recipeExtra = recipe.extraNutrition[key];

      if (!newNutrition.extraNutrition[key]) {
        newNutrition.extraNutrition[key] = { ...recipeExtra, value: 0 };
      }
      newNutrition.extraNutrition[key].value += recipeExtra.value * multiplier;
    });
    setNutrition(newNutrition);
  };

  return (
    <View className="mb-4 overflow-hidden rounded-xl bg-white shadow-sm shadow-gray-300">
      {/* Header */}
      <TouchableOpacity
        className="flex-row items-center justify-between bg-gray-800 p-4"
        activeOpacity={0.8}
        onPress={() => !adding && setExpanded(!expanded)}>
        <View className="flex-row items-center">
          {!adding && (
            <TouchableOpacity
              className="mr-3 rounded-lg bg-white px-3 py-1"
              onPress={() => setAdding(true)}>
              <Text className="font-semibold text-gray-800">Add</Text>
            </TouchableOpacity>
          )}
          <Text className="text-lg font-semibold text-white">{recipe.name}</Text>
        </View>

        {!adding &&
          (expanded ? (
            <Feather name="chevron-up" size={24} color="white" />
          ) : (
            <Feather name="chevron-down" size={24} color="white" />
          ))}
      </TouchableOpacity>

      {/* Expanded Content */}
      {expanded && !adding && (
        <View className="border-t border-gray-100 p-4">
          <View className="mb-3 border-b border-gray-200 pb-3">
            <Text className="text-gray-600">{recipe.numberOfServings} Servings Per Recipe</Text>
            <View className="mt-1 flex-row items-center justify-between">
              <Text className="font-bold text-gray-800">Serving Size</Text>
              <Text className="font-bold text-gray-800">
                {recipe.servingSize}
                {recipe.servingUnit || 'g'}
              </Text>
            </View>
          </View>

          {getCombinedNutritionData(recipe).map((item) => (
            <View key={`${item.type}-${item.key}`} className="flex-row justify-between py-2">
              <Text className="text-gray-700">{item.label}</Text>
              <Text className="text-gray-800">
                {item.value}
                {item.unit}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Add Form */}
      {adding && (
        <View className="p-4">
          {/* Toggle between recipes/servings */}
          <View className="mb-4 flex-row rounded-lg bg-gray-100 p-1">
            <TouchableOpacity
              className={`flex-1 rounded-md py-2 ${addType === 'numberOfRecipes' ? 'bg-gray-800' : ''}`}
              onPress={() => setAddType('numberOfRecipes')}>
              <Text
                className={`text-center font-medium ${addType === 'numberOfRecipes' ? 'text-white' : 'text-gray-800'}`}>
                Recipes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded-md py-2 ${addType === 'servings' ? 'bg-gray-800' : ''}`}
              onPress={() => setAddType('servings')}>
              <Text
                className={`text-center font-medium ${addType === 'servings' ? 'text-white' : 'text-gray-800'}`}>
                Servings
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View className="mb-4">
            {addType === 'numberOfRecipes' ? (
              <View>
                <Text className="mb-1 font-medium text-gray-700">Number of Recipes</Text>
                <TextInput
                  keyboardType="numeric"
                  value={numberOfRecipes}
                  onChangeText={setNumberOfRecipes}
                  className="rounded-lg border border-gray-300 bg-white p-3"
                  placeholder="1"
                />
              </View>
            ) : (
              <View className="space-y-3">
                <View>
                  <Text className="mb-1 font-medium text-gray-700">Serving Size</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={servingSize}
                    onChangeText={setServingSize}
                    className="rounded-lg border border-gray-300 bg-white p-3"
                    placeholder="1"
                  />
                </View>
                <View>
                  <Text className="mb-1 font-medium text-gray-700">Number of Servings</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={numberOfServings}
                    onChangeText={setNumberOfServings}
                    className="rounded-lg border border-gray-300 bg-white p-3"
                    placeholder="1"
                  />
                </View>
              </View>
            )}

            {/* Inventory Toggle */}
            <TouchableOpacity
              className="mt-4 flex-row items-center"
              onPress={() => setCheckInventory(!checkInventory)}>
              <View
                className={`h-5 w-5 rounded border ${checkInventory ? 'border-gray-800 bg-gray-800' : 'border-gray-400'} mr-2 flex items-center justify-center`}>
                {checkInventory && <Feather name="check" size={16} color="white" />}
              </View>
              <Text className="text-gray-700">Update Inventory</Text>
            </TouchableOpacity>

            {error && (
              <View className="mt-3 rounded-lg bg-red-100 p-3">
                <Text className="text-center text-red-700">{error}</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 rounded-lg border border-gray-300 py-3"
              onPress={() => {
                setAdding(false);
                setExpanded(false);
              }}>
              <Text className="text-center font-medium text-gray-800">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 rounded-lg bg-gray-800 py-3" onPress={handleAdd}>
              <Text className="text-center font-medium text-white">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default LogRecipeInfo;
