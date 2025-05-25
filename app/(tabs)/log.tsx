import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { format, addDays, isToday, isYesterday, isTomorrow } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserDailyMealHistory } from '~/lib/meals';
import { Dropdown } from 'react-native-element-dropdown';
import { fetchUserDailyNutritionalHistory, fetchUserNutritionalGoals } from '~/lib/goals';
import NutritionalGoalDisplay from '~/components/NutritionalGoalDisplay';
import MealHistory from '~/components/MealHistory';
import AddLogModal from '~/components/AddLogModal';

const nutritionFields = [
  'calories',
  'protein',
  'totalFat',
  'saturatedFat',
  'polyunsaturatedFat',
  'monounsaturatedFat',
  'transFat',
  'cholesterol',
  'sodium',
  'potassium',
  'totalCarbohydrates',
  'dietaryFiber',
  'totalSugars',
  'addedSugars',
  'sugarAlcohols',
  'vitaminA',
  'vitaminC',
  'vitaminD',
  'calcium',
  'iron',
];

// Optional: map to friendlier labels
const nutritionOptions = nutritionFields.map((key) => ({
  label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()), // e.g., totalFat → Total Fat
  value: key,
}));

export default function Log() {
  return <AddLogModal isModal={false} />;
}
