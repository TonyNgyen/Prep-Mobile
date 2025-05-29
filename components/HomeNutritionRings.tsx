import React from 'react';
import { ScrollView, View } from 'react-native';
import ProgressRing from './progressRing';

export default function HomeNutritionRings() {
  const rings = [
    { label: 'Calories', progress: 0.72 },
    { label: 'Protein', progress: 0.65 },
    { label: 'Carbs', progress: 0.83 },
    { label: 'Fat', progress: 0.48 },
    { label: 'Fiber', progress: 0.9 },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 0,
        backgroundColor: 'white',
      }}>
      {rings.map((ring, index) => (
        <View key={index}>
          <ProgressRing label={ring.label} progress={ring.progress} />
        </View>
      ))}
    </ScrollView>
  );
}
