import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { fetchUserDailyMealHistory } from '~/lib/meals'; // Adjust path as needed
import SpecificMeal from './SpecificMeal';

type MealHistoryProps = {
  userId: string | undefined;
  dateInput: Date;
};

const meals = ['breakfast', 'lunch', 'dinner', 'snack', 'miscellaneous'];

export default function MealHistory({ userId, dateInput }: MealHistoryProps) {
  const [currentDailyMeal, setCurrentDailyMeal] = useState<Record<string, any>>();

  useEffect(() => {
    const fetch = async () => {
      const fetchHistory = await fetchUserDailyMealHistory(
        userId,
        dateInput.toLocaleDateString('en-CA')
      );
      setCurrentDailyMeal(fetchHistory);
    };
    fetch();
  }, [userId, dateInput]);

  return (
    <View style={styles.container}>
      {meals.map((meal) => (
        <SpecificMeal
          key={meal}
          meal={meal}
          mealInformation={currentDailyMeal ? currentDailyMeal[meal] : null}
          dateInput={dateInput}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    flexDirection: 'column',
  },
});
