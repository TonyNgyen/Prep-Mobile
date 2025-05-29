import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { fetchUserDailyMealHistory } from '~/lib/meals'; // Adjust path as needed
import SpecificMeal from './SpecificMeal';

type MealHistoryProps = {
  userId: string | undefined;
  date: Date;
};

const meals = ['breakfast', 'lunch', 'dinner', 'snack', 'miscellaneous'];

export default function MealHistory({ userId, date }: MealHistoryProps) {
  const [currentDailyMeal, setCurrentDailyMeal] = useState<Record<string, any>>();

  useEffect(() => {
    const fetch = async () => {
      const fetchHistory = await fetchUserDailyMealHistory(userId, date.toLocaleDateString('en-CA'));
      setCurrentDailyMeal(fetchHistory);
    };
    fetch();
  }, [date]);

  return (
    <View style={styles.container}>
      {meals.map((meal) => (
        <SpecificMeal
          key={meal}
          meal={meal}
          mealInformation={currentDailyMeal ? currentDailyMeal[meal] : null}
          date={date.toLocaleDateString('en-CA')}
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
