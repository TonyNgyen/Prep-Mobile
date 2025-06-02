import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';

type NutritionalGoalDisplayProps = {
  nutritionalValue: string;
  goal: number;
  current: number;
};

export default function NutritionalGoalDisplay({
  nutritionalValue,
  goal,
  current,
}: NutritionalGoalDisplayProps) {
  const remaining = goal - current;
  const router = useRouter();
  if (!goal) {
    return (
      <View className="rounded-b-md bg-white p-4 dark:bg-gray-900">
        <Text className="text-center text-lg text-gray-400">
          No goal set for {NUTRITIONAL_KEYS[nutritionalValue]}
        </Text>
        <View className=" mt-2 items-center">
          <Pressable
            className="rounded-md bg-gray-800 px-5 py-2"
            onPress={() => {
              router.push('/account/goals');
            }}>
            <Text className="text-lg text-white">Add Goal</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <View className="rounded-b-md bg-white p-4 dark:bg-gray-900">
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
