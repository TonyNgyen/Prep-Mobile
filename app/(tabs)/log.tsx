import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { format, addDays, isToday, isYesterday, isTomorrow } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserDailyMealHistory } from '~/lib/meals';
import { Dropdown } from 'react-native-element-dropdown';

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
  const [selected, setSelected] = useState('calories');
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const fetchDailyMealInformation = async () => {
      const data = await fetchUserDailyMealHistory(
        user?.id,
        selectedDate.toLocaleDateString('en-CA')
      );
      setDailyMealInformation(data);
    };
    fetchDailyMealInformation();
  });

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
    <View>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: '#6c5ce7' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={nutritionOptions}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={selected}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setSelected(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
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
