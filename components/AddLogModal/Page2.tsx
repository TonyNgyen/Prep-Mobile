import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';
import { InventoryIngredient, InventoryRecipe, NutritionFacts } from '~/types';

type ItemsToAdd = Record<string, InventoryIngredient | InventoryRecipe>;

type PageProps = {
  nutrition: NutritionFacts;
  logFood: ItemsToAdd;
  inventory: ItemsToAdd;
};

export default function Page2({ nutrition, logFood }: PageProps) {
  const foodArray = Object.values(logFood);

  return (
    <View className="flex-1 bg-white p-4">
      <View className="mb-8">
        <Text className="mb-2 text-xl font-semibold text-gray-800">Food To Log</Text>
        {foodArray.length > 0 ? (
          <FlatList
            data={foodArray}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                className={`rounded-md p-4 ${
                  item.type === 'ingredient' ? 'bg-gray-800' : 'bg-blue-900'
                }`}>
                <Text className="text-base font-semibold text-white">{item.name}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View className="h-2" />}
          />
        ) : (
          <Text className="text-base text-gray-600">Please add food to log</Text>
        )}
      </View>

      <View>
        <Text className="mb-2 text-xl font-semibold text-gray-800">Nutritional Summary</Text>
        <View className="rounded-md border-2 border-gray-800 p-4">
          {Object.keys(NUTRITIONAL_KEYS).map((key) => {
            const value = Number(nutrition[key]?.toFixed(2));
            if (!value) return null;
            return (
              <View key={key} className="flex-row justify-between py-1">
                <Text className="text-base text-gray-700">{NUTRITIONAL_KEYS[key]}</Text>
                <Text className="text-base font-semibold text-gray-800">
                  {value}
                  {NUTRITIONAL_UNITS[key]}
                </Text>
              </View>
            );
          })}

          {Object.entries(nutrition.extraNutrition).map(([key, { value, label, unit }]) => (
            <View key={key} className="flex-row justify-between py-1">
              <Text className="text-base text-gray-700">{label}</Text>
              <Text className="text-base font-semibold text-gray-800">
                {value.toFixed(2)}
                {unit === 'percent' ? '%' : unit}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
