import React from 'react';
import { View, Text } from 'react-native';
import { IngredientMeal, RecipeMeal } from '~/types';

type SpecificFoodProps = {
  food: IngredientMeal | RecipeMeal;
};

export default function SpecificFood({ food }: SpecificFoodProps) {
  const isCustomServing = food.unit === 'x';
  const unitLabel = isCustomServing
    ? food.totalAmount > 1
      ? ' Servings'
      : ' Serving'
    : ` ${food.unit}`;

  return (
    <View className="flex flex-col">
      <Text className="text-base font-medium">{food.name}</Text>
      <Text className="text-sm text-gray-600">
        {food.totalAmount}
        {unitLabel}
      </Text>
    </View>
  );
}
