import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { format, addDays } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserDailyMealHistory } from '~/lib/meals';
import { Dropdown } from 'react-native-element-dropdown';

export default function DateHeader() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyMealInformation, setDailyMealInformation] = useState();

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
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#222' }}>
          {format(selectedDate, 'EEEE, MMM d')}
        </Text>
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
      <Text>Log</Text>
    </View>
  );
}
