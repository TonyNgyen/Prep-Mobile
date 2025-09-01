import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ProgressRing from './progressRing';
import { fetchUserDailyNutritionalHistory } from '~/lib/nutrition';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserNutritionalGoals } from '~/lib/goals';
import { flattenNutritionFacts, sumDailyNutrition } from '~/lib/helpers';
import { NutritionFacts } from '~/types';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';
import { useRouter } from 'expo-router';

type NutritionRing = {
  label: string;
  color?: string;
  target: number;
  value: number;
  unit: string;
};

export default function HomeNutritionRings() {
  const today = new Date().toLocaleDateString('en-CA');
  const [ringData, setRingData] = useState<NutritionRing[]>([]);
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => {
      const nutritionGoals = await fetchUserNutritionalGoals(user?.id);
      let dailyNutrition = await fetchUserDailyNutritionalHistory(today, user?.id);

      const isDailyMeals =
        dailyNutrition &&
        typeof dailyNutrition === 'object' &&
        !Array.isArray(dailyNutrition) &&
        Object.values(dailyNutrition).every(
          (val) => typeof val === 'object' && val !== null && 'calories' in val
        );

      if (isDailyMeals) {
        dailyNutrition = sumDailyNutrition(dailyNutrition as Record<string, NutritionFacts>);
        dailyNutrition = flattenNutritionFacts(dailyNutrition);
      }

      let ringInformation = [];

      for (const key of Object.keys(nutritionGoals)) {
        const typedKey = key as keyof typeof NUTRITIONAL_KEYS;
        const goalValue = nutritionGoals[key as keyof typeof nutritionGoals]['goal'];
        const colorValue = nutritionGoals[key as keyof typeof nutritionGoals]['color'];
        const actualValue = dailyNutrition?.[key] ?? 0;
        ringInformation.push({
          label: NUTRITIONAL_KEYS[typedKey] ? NUTRITIONAL_KEYS[typedKey] : typedKey,
          target: goalValue,
          value: actualValue,
          unit: NUTRITIONAL_UNITS[typedKey],
          color: colorValue,
        });
      }
      setRingData(ringInformation);
    };
    fetch();
  }, []);

  return (
    <Pressable
      onPress={() => {
        router.push('/account/goals');
      }}>
      <View className="rounded-md bg-white py-5">
        <Text className="mb-4 px-6 text-xl font-bold text-gray-900">Daily Goal Progress</Text>
        {ringData.length === 0 ? (
          <View className="items-center justify-center gap-4 py-10">
            <Text className="text-center text-xl text-gray-400">There are no goals to show.</Text>
            <Pressable
              className="rounded-md bg-gray-800 px-4 py-2"
              onPress={() => {
                router.push('/account/goals');
              }}>
              <Text className="text-lg text-white">Add Goal</Text>
            </Pressable>
          </View>
        ) : ringData.length <= 3 ? (
          <View className="flex-row items-center justify-center">
            {ringData.map((ring, index) => (
              <TouchableOpacity
                key={index}
                className="w-[110px] items-center shadow-sm"
                activeOpacity={0.6}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  elevation: 4,
                }}>
                <ProgressRing
                  value={ring.value}
                  progress={ring.value / ring.target}
                  label={ring.label}
                  size={92}
                  color={ring.color}
                />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: 24,
              paddingRight: 12,
            }}>
            {ringData.map((ring, index) => (
              <TouchableOpacity
                key={index}
                className="w-[110px] items-center shadow-sm"
                activeOpacity={0.6}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  elevation: 4,
                }}>
                <ProgressRing
                  value={ring.value}
                  progress={ring.value / ring.target}
                  label={ring.label}
                  size={92}
                  color={ring.color}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </Pressable>
  );
}
