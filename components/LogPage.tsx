import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { format, addDays, isToday, isYesterday, isTomorrow } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserDailyMealHistory } from '~/lib/meals';
import { Dropdown } from 'react-native-element-dropdown';
import { fetchUserNutritionalGoals } from '~/lib/goals';
import NutritionalGoalDisplay from '~/components/NutritionalGoalDisplay';
import MealHistory from '~/components/MealHistory';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserInventory } from '~/types';
import { fetchUserDailyNutritionalHistory } from '~/lib/nutrition';

type LogPageProps = {
  isModal: boolean;
  visible?: boolean;
  onClose?: () => void;
  onConfirm?: (newInventory: UserInventory) => void;
  currentInventory?: UserInventory | null;
};

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

const nutritionOptions = nutritionFields.map((key) => ({
  label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
  value: key,
}));

export default function LogPage({
  isModal,
  visible,
  onClose,
  onConfirm,
  currentInventory,
}: LogPageProps) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const nativeHeaderHeight = (Platform.OS === 'ios' ? 44 : 56) + insets.top;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyMealInformation, setDailyMealInformation] = useState();
  const [selectedNutritionalValue, setSelectedNutritionalValue] = useState('calories');
  const [isFocus, setIsFocus] = useState(false);
  const [currentNutritionalValue, setCurrentNutritionalValue] = useState<number>(0);
  const [nutritionalGoals, setNutritionalGoals] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      const mealData = await fetchUserDailyMealHistory(
        user?.id,
        selectedDate.toLocaleDateString('en-CA')
      );
      setDailyMealInformation(mealData);

      const goals = await fetchUserNutritionalGoals(user?.id);
      setNutritionalGoals(goals);

      const nutritionalValues = await fetchUserDailyNutritionalHistory(
        selectedDate.toLocaleDateString('en-CA'),
        user?.id
      );
      setCurrentNutritionalValue(nutritionalValues[selectedNutritionalValue]);
    };

    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (isModal) return;
    const getTitle = () => {
      if (isToday(selectedDate)) return 'Today';
      if (isYesterday(selectedDate)) return 'Yesterday';
      if (isTomorrow(selectedDate)) return 'Tomorrow';
      return format(selectedDate, 'EEEE, MMM d');
    };

    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={() => setSelectedDate((d) => addDays(d, -1))}
            style={{ paddingHorizontal: 8 }}
            hitSlop={10}>
            <Feather name="chevron-left" size={20} color="#222" />
          </Pressable>

          <Text
            style={{ fontSize: 18, fontWeight: '600', color: '#222' }}
            className="w-52 text-center">
            {getTitle()}
          </Text>

          <Pressable
            onPress={() => setSelectedDate((d) => addDays(d, 1))}
            style={{ paddingHorizontal: 8 }}
            hitSlop={10}>
            <Feather name="chevron-right" size={20} color="#222" />
          </Pressable>
        </View>
      ),
      headerLeft: () => null,
      headerRight: () => null,
    });
  }, [navigation, selectedDate, isModal]);

  const renderHeader = () => {
    const getTitle = () => {
      if (isToday(selectedDate)) return 'Today';
      if (isYesterday(selectedDate)) return 'Yesterday';
      if (isTomorrow(selectedDate)) return 'Tomorrow';
      return format(selectedDate, 'EEEE, MMM d');
    };
    if (!onClose) {
      return;
    }
    return (
      <>
        <Pressable
          onPress={() => {
            onClose();
          }}
          className="px-4 pb-3">
          <Feather name="x" size={24} color="black" />
        </Pressable>
        <View className="absolute bottom-0 left-1/2 -translate-x-1/2 flex-row items-center pb-3 text-lg font-semibold">
          <Pressable
            onPress={() => setSelectedDate((d) => addDays(d, -1))}
            style={{ paddingHorizontal: 8 }}
            hitSlop={10}>
            <Feather name="chevron-left" size={20} color="#222" />
          </Pressable>

          <Text
            style={{ fontSize: 18, fontWeight: '600', color: '#222' }}
            className="w-52 text-center">
            {getTitle()}
          </Text>

          <Pressable
            onPress={() => setSelectedDate((d) => addDays(d, 1))}
            style={{ paddingHorizontal: 8 }}
            hitSlop={10}>
            <Feather name="chevron-right" size={20} color="#222" />
          </Pressable>
        </View>
      </>
    );
  };

  const renderBody = () => {
    return (
      <View className="flex-1 p-4">
        <View className="flex flex-col gap-4">
          <View>
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
              goal={nutritionalGoals?.[selectedNutritionalValue]}
              current={currentNutritionalValue ?? 0}
            />
          </View>

          <MealHistory userId={user?.id} dateInput={selectedDate} />
        </View>
      </View>
    );
  };
  return renderBody();
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
