import React from 'react';
import { View, Text } from 'react-native';

type NutritionalGoalDisplayProps = {
  nutritionalValue: string;
  goal: number;
  current: number;
};

export default function NutritionalGoalDisplay({ nutritionalValue, goal, current }: NutritionalGoalDisplayProps) {
  const remaining = goal - current;

  return (
    <View className="bg-white p-4 dark:bg-gray-900 rounded-b-md">
      {/* <Text className="mb-3 text-center text-base font-semibold text-gray-600 dark:text-gray-300">
        {nutritionalValue}
      </Text> */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">{goal}</Text>
          <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">Goal</Text>
        </View>

        <Text className="text-3xl text-gray-700 dark:text-gray-300">−</Text>

        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">{current}</Text>
          <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">Food</Text>
        </View>

        <Text className="text-3xl text-gray-700 dark:text-gray-300">=</Text>

        <View className="flex-1 items-center">
          <Text
            className={`text-2xl font-bold ${
              remaining >= 0 ? 'text-emerald-600' : 'text-red-500'
            }`}>
            {remaining}
          </Text>
          <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">Remaining</Text>
        </View>
      </View>
    </View>
  );
}
