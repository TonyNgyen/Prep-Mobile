import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ProgressRing from './progressRing';

export default function HomeNutritionRings() {
  const rings = [
    { label: 'Calories', color: '#FF6B6B', target: 2000, value: 1440, unit: 'kcal' },
    { label: 'Protein', color: '#4ECDC4', target: 150, value: 98, unit: 'g' },
    { label: 'Carbs', color: '#45AFF2', target: 250, value: 207, unit: 'g' },
    { label: 'Fat', color: '#FFD166', target: 70, value: 34, unit: 'g' },
    { label: 'Fiber', color: '#7DCEA0', target: 30, value: 27, unit: 'g' },
  ];

  return (
    <View className="bg-white py-5 rounded-md">
      <Text className="mb-4 px-6 text-xl font-bold text-gray-900">Today's Nutrition</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 24,
          paddingRight: 12,
        }}>
        {rings.map((ring, index) => (
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
              value={`${ring.value}`}
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
