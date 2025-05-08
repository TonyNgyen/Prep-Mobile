import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { NutritionFacts } from '~/types';
import { format } from 'date-fns';
import {
  fetchUserDayNutritionalHistory,
  fetchUserNutritionalGoals,
  updateUserNutritionalGoals,
} from '~/lib/goals';
import { useAuth } from '~/contexts/AuthProvider';
import GoalCard from '~/components/GoalCard';

export default function Goals() {
  const { user } = useAuth();
  const [nutritionalGoals, setNutritionalGoals] = useState<Record<string, number>>({});
  const [originalGoals, setOriginalGoals] = useState<Record<string, number>>({});
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [nutritionalHistory, setNutritionalHistory] = useState<NutritionFacts>({
    calories: 0,
    protein: 0,
    totalFat: 0,
    saturatedFat: 0,
    polyunsaturatedFat: 0,
    monounsaturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    potassium: 0,
    totalCarbohydrates: 0,
    dietaryFiber: 0,
    totalSugars: 0,
    addedSugars: 0,
    sugarAlcohols: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    calcium: 0,
    iron: 0,
    extraNutrition: {},
  });

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const fetch = async () => {
      const fetchGoals = await fetchUserNutritionalGoals(user?.id);
      const fetchHistory = await fetchUserDayNutritionalHistory(today, user?.id);
      setNutritionalGoals(fetchGoals);
      setOriginalGoals(fetchGoals);
      setNutritionalHistory(fetchHistory);
    };
    fetch();
  }, []);

  const handleGoalChange = (nutrition: string, newValue: number) => {
    setNutritionalGoals((prev) => ({
      ...prev,
      [nutrition]: newValue,
    }));
  };

  const handleSaveGoal = async (nutrition: string, newValue: number) => {
    const updatedGoals = {
      ...nutritionalGoals,
      [nutrition]: newValue,
    };
    const success = await updateUserNutritionalGoals(updatedGoals, user?.id);
    if (success) {
      setNutritionalGoals(updatedGoals);
      setOriginalGoals(updatedGoals);
      setEditingGoal(null);
    }
  };

  const handleCancelEdit = () => {
    setNutritionalGoals(originalGoals);
    setEditingGoal(null);
  };

  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: 'Goals' }} />
      <FlatList
        data={Object.entries(nutritionalGoals)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => {
          const [nutrition, goal] = item;
          const current = nutritionalHistory[nutrition as keyof NutritionFacts] as number;
          return (
            <GoalCard
              nutrition={nutrition}
              goal={goal}
              current={current}
              isEditing={editingGoal === nutrition}
              onEdit={() => setEditingGoal(nutrition)}
              onChange={handleGoalChange}
              onSave={handleSaveGoal}
              onCancel={handleCancelEdit}
            />
          );
        }}
      />
    </View>
  );
}
