import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ingredient, InventoryIngredient, InventoryRecipe, NutritionFacts } from '~/types';
import { Feather } from '@expo/vector-icons';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';

type ItemsToAdd = Record<string, InventoryIngredient | InventoryRecipe>;

type InventoryIngredientInfoProps = {
  ingredient: Ingredient;
  add: (
    id: string,
    name: string,
    containers: number,
    servingSize: number,
    numberOfServings: number,
    totalNumber: number,
    unit: string
  ) => void;
  inventory: ItemsToAdd;
  setInventory: React.Dispatch<React.SetStateAction<ItemsToAdd>>;
  setNutrition: React.Dispatch<React.SetStateAction<NutritionFacts>>;
  nutrition: NutritionFacts;
};

function LogIngredientInfo({
  ingredient,
  add,
  inventory,
  setInventory,
  setNutrition,
  nutrition,
}: InventoryIngredientInfoProps) {
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addType, setAddType] = useState<'containers' | 'servings'>('containers');
  const [numberOfContainers, setNumberOfContainers] = useState<string>('1');
  const [servingSize, setServingSize] = useState<string>('1');
  const [numberOfServings, setNumberOfServings] = useState<string>('1');
  const [checkInventory, setCheckInventory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validation effects would go here...

  const handleAdd = () => {
    // Implementation would go here...
  };

  const addNutrition = () => {
    // Implementation would go here...
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
          <Text className="text-lg font-semibold text-white">{ingredient.name}</Text>
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
            <Text className="text-gray-600">
              {ingredient.servingsPerContainer} Servings Per Container
            </Text>
            <View className="mt-1 flex-row items-center justify-between">
              <Text className="font-bold text-gray-800">Serving Size</Text>
              <Text className="font-bold text-gray-800">
                {ingredient.servingSize}
                {ingredient.servingUnit || 'g'}
              </Text>
            </View>
          </View>

          <ScrollView>
            {Object.keys(NUTRITIONAL_KEYS).map((key) => {
              const value = ingredient[key as keyof typeof ingredient];
              if (value === null || value === undefined) return null;

              const unit = NUTRITIONAL_UNITS[key as keyof typeof NUTRITIONAL_UNITS];
              return (
                <View key={key} className="flex-row justify-between py-2">
                  <Text className="text-gray-700">
                    {NUTRITIONAL_KEYS[key as keyof typeof NUTRITIONAL_KEYS]}
                  </Text>
                  <Text className="text-gray-800">
                    {value}
                    {unit}
                  </Text>
                </View>
              );
            })}

            {Object.keys(ingredient.extraNutrition || {}).map((key) => {
              const extra = ingredient.extraNutrition?.[key];
              if (!extra) return null;

              const unit = extra.unit === 'percent' ? '%' : extra.unit;
              return (
                <View key={key} className="flex-row justify-between py-2">
                  <Text className="text-gray-700">{extra.label}</Text>
                  <Text className="text-gray-800">
                    {extra.value}
                    {unit}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Add Form */}
      {adding && (
        <View className="p-4">
          {/* Toggle between containers/servings */}
          <View className="mb-4 flex-row rounded-lg bg-gray-100 p-1">
            <TouchableOpacity
              className={`flex-1 rounded-md py-2 ${addType === 'containers' ? 'bg-gray-800' : ''}`}
              onPress={() => setAddType('containers')}>
              <Text
                className={`text-center font-medium ${addType === 'containers' ? 'text-white' : 'text-gray-800'}`}>
                Containers
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
            {addType === 'containers' ? (
              <View>
                <Text className="mb-1 font-medium text-gray-700">Number of Containers</Text>
                <TextInput
                  keyboardType="numeric"
                  value={numberOfContainers}
                  onChangeText={setNumberOfContainers}
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

export default LogIngredientInfo;
