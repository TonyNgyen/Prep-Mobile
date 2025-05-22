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

export default function DateHeader() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyMealInformation, setDailyMealInformation] = useState();
  const [selectedNutritionalValue, setSelectedNutritionalValue] = useState('calories');
  const [isFocus, setIsFocus] = useState(false);
  const [currentNutritionalValue, setCurrentNutritionalValue] = useState<number>(0);
  const [nutritionalGoals, setNutritionalGoals] = useState<Record<string, number>>({});
  // const [currentAllNutritionalValues, setCurrentAllNutritionalValues] =
  useEffect(() => {
    const fetchDailyMealInformation = async () => {
      const data = await fetchUserDailyMealHistory(
        user?.id,
        selectedDate.toLocaleDateString('en-CA')
      );
      setDailyMealInformation(data);
    };
    const fetchGoals = async () => {
      const fetchGoal = await fetchUserNutritionalGoals(user?.id);
      setNutritionalGoals(fetchGoal);
    };

    const fetchCurrentNutritionalValues = async () => {
      const fetchNutritionalValues = await fetchUserDailyNutritionalHistory(
        selectedDate.toLocaleDateString('en-CA'),
        user?.id
      );
      setCurrentNutritionalValue(fetchNutritionalValues[selectedNutritionalValue]);
    };
    fetchDailyMealInformation();
    fetchGoals();
    fetchCurrentNutritionalValues();
  }, []);

  useLayoutEffect(() => {
    const getTitle = () => {
      if (isToday(selectedDate)) return 'Today';
      if (isYesterday(selectedDate)) return 'Yesterday';
      if (isTomorrow(selectedDate)) return 'Tomorrow';
      return format(selectedDate, 'EEEE, MMM d');
    };

    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#222' }}>{getTitle()}</Text>
      ),
      headerLeft: () => (
        <Pressable
          onPress={() => setSelectedDate((d) => addDays(d, -1))}
          style={{ paddingHorizontal: 16 }}
          hitSlop={10}>
          <Feather name="chevron-left" size={24} color="#222" />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={() => setSelectedDate((d) => addDays(d, 1))}
          style={{ paddingHorizontal: 16 }}
          hitSlop={10}>
          <Feather name="chevron-right" size={24} color="#222" />
        </Pressable>
      ),
    });
  }, [navigation, selectedDate]);

  return (
    <View className="flex-1 p-4">
      <View className="flex flex-col">
        <Dropdown
          style={[styles.dropdown, { backgroundColor: 'white' }]}
          containerStyle={{ backgroundColor: 'white' }}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={nutritionOptions}
          maxHeight={300}
          labelField="label"
          valueField="value"
          value={selectedNutritionalValue}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setSelectedNutritionalValue(item.value);
            setIsFocus(false);
          }}
        />
        <NutritionalGoalDisplay
          nutritionalValue={selectedNutritionalValue}
          goal={nutritionalGoals?.[selectedNutritionalValue] ?? 0}
          current={currentNutritionalValue ?? 0}
        />
        <MealHistory userId={user?.id} date={selectedDate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  placeholderStyle: {
    color: '#999',
    fontSize: 16,
  },
  selectedTextStyle: {
    color: '#333',
    fontSize: 16,
  },
});
