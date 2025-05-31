import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ProgressRing from './progressRing';
import { fetchUserDailyNutritionalHistory } from '~/lib/nutrition';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserNutritionalGoals } from '~/lib/goals';
import { flattenNutritionFacts, sumDailyNutrition } from '~/lib/helpers';
import { NutritionFacts } from '~/types';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';

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
        const goalValue = nutritionGoals[key as keyof typeof nutritionGoals];
        const actualValue = dailyNutrition?.[key] ?? 0;
        if (key in NUTRITIONAL_KEYS) {
          ringInformation.push({
            label: NUTRITIONAL_KEYS[typedKey],
            target: goalValue,
            value: actualValue,
            unit: NUTRITIONAL_UNITS[typedKey],
          });
        }
      }
      setRingData(ringInformation);
    };
    fetch();
  }, []);

  // const rings = [
  //   { label: 'Calories', color: '#FF6B6B', target: 2000, value: 1440, unit: 'kcal' },
  //   { label: 'Protein', color: '#4ECDC4', target: 150, value: 98, unit: 'g' },
  //   { label: 'Carbs', color: '#45AFF2', target: 250, value: 207, unit: 'g' },
  //   { label: 'Fat', color: '#FFD166', target: 70, value: 34, unit: 'g' },
  //   { label: 'Fiber', target: 30, value: 27, unit: 'g' },
  // ];

  return (
    <View className="rounded-md bg-white py-5">
      <Text className="mb-4 px-6 text-xl font-bold text-gray-900">Today's Nutrition</Text>
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
            {/* Optional target text */}
            {/* <Text className="text-xs text-gray-500 mt-2 font-medium text-center leading-[14px]">
              {Math.round((ring.value / ring.target) * 100)}% of {ring.target}
              {ring.unit}
            </Text> */}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
