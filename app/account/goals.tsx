import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Pressable,
  Text,
  TextInput,
  Modal,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NutritionFacts } from '~/types';
import { format } from 'date-fns';
import { fetchUserNutritionalGoals, updateUserNutritionalGoals } from '~/lib/goals';
import { useAuth } from '~/contexts/AuthProvider';
import GoalCard from '~/components/GoalCard';
import Feather from '@expo/vector-icons/Feather';
import { fetchUserDailyNutritionalHistory } from '~/lib/nutrition';
import { flattenNutritionFacts, sumDailyNutrition } from '~/lib/helpers';
import { runOnJS } from 'react-native-reanimated';
import ColorPicker, { HueSlider, Panel1 } from 'reanimated-color-picker';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { Dropdown } from 'react-native-element-dropdown';

const getUnsetGoalKeys = (
  allKeys: Record<string, string>,
  userGoals: Record<string, any>
): string[] => {
  return Object.values(allKeys).filter((key) => !(key in userGoals));
};

const DEFAULT_GOAL_COLOR = '#1E293B';

export default function Goals() {
  const { user } = useAuth();
  const [nutritionalGoals, setNutritionalGoals] = useState<Record<string, Object>>({});
  const [originalGoals, setOriginalGoals] = useState<Record<string, Object>>({});
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
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalValue, setNewGoalValue] = useState('');
  const [newGoalColor, setNewGoalColor] = useState(DEFAULT_GOAL_COLOR);
  const [barPreviewColor, setBarPreviewColor] = useState(DEFAULT_GOAL_COLOR);
  let dropdownOptions;

  useEffect(() => {
    const fetch = async () => {
      const fetchGoals = await fetchUserNutritionalGoals(user?.id);
      let dailyNutrition = await fetchUserDailyNutritionalHistory(today, user?.id);
      const isDailyMeals =
        dailyNutrition &&
        typeof dailyNutrition === 'object' &&
        !Array.isArray(dailyNutrition) &&
        Object.values(dailyNutrition).every(
          (val) => typeof val === 'object' && val !== null && 'calories' in val
        );

      if (isDailyMeals) {
        dailyNutrition = sumDailyNutrition(dailyNutrition as Record<string, NutritionFacts>);
        dailyNutrition = flattenNutritionFacts(dailyNutrition);
      }
      setNutritionalGoals(fetchGoals);
      setOriginalGoals(fetchGoals);
      setNutritionalHistory(dailyNutrition);
    };
    fetch();
  }, [user?.id]);

  if (Object.keys(nutritionalGoals).length != 0) {
    const availableKeys = getUnsetGoalKeys(NUTRITIONAL_KEYS, nutritionalGoals);
    dropdownOptions = availableKeys.map((key) => ({
      label: key,
      value: key,
    }));
  }

  const handleGoalChange = (nutrition: string, newValue: number, barColor: string) => {
    setNutritionalGoals((prev) => ({
      ...prev,
      [nutrition]: { goal: newValue, color: barColor },
    }));
  };

  const handleSaveGoal = async (nutrition: string, newValue: number, barColor: string) => {
    const updatedGoals = {
      ...nutritionalGoals,
      [nutrition]: { goal: newValue, color: barColor },
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

  const handleAddGoal = async () => {
    const name = newGoalName.trim();
    const value = parseFloat(newGoalValue);

    if (!name) {
      Alert.alert('Missing Field', 'Please enter a nutrition name.');
      return;
    }

    if (isNaN(value)) {
      Alert.alert('Invalid Value', 'Please enter a numeric goal.');
      return;
    }

    if (nutritionalGoals[name]) {
      Alert.alert('Duplicate Goal', 'A goal with this name already exists.');
      return;
    }

    const updatedGoals = {
      ...nutritionalGoals,
      [name]: { goal: value, color: barPreviewColor },
    };

    const success = await updateUserNutritionalGoals(updatedGoals, user?.id);
    if (success) {
      setNutritionalGoals(updatedGoals);
      setOriginalGoals(updatedGoals);
      setModalVisible(false);
      setNewGoalName('');
      setNewGoalValue('');
    }
  };

  const onSelectColor = ({ hex }) => {
    'worklet';
    runOnJS(setBarPreviewColor)(hex);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 p-4">
        <Stack.Screen
          options={{
            title: 'Goals',
            headerBackButtonDisplayMode: 'minimal',
            headerTintColor: 'black',
          }}
        />
        <FlatList
          data={Object.entries(nutritionalGoals)}
          keyExtractor={(item) => item[0]}
          contentContainerStyle={{ gap: 10, paddingBottom: 120 }}
          renderItem={({ item }) => {
            const nutrition = item[0];
            const color = item[1]['color'];
            const goal = item[1]['goal'];
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
                color={color}
              />
            );
          }}
        />

        <Pressable
          onPress={() => setModalVisible(true)}
          className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center border-t-2 border-gray-300 bg-white p-5 pb-10">
          <Text className="text-xl font-semibold text-gray-800">Add Goal</Text>
        </Pressable>

        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setModalVisible(false)}>
          <Pressable
            className="flex-1 justify-end bg-black/40"
            onPress={() => setModalVisible(false)}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="w-full">
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="rounded-t-2xl bg-white p-8" onStartShouldSetResponder={() => true}>
                  {/* <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-gray-300" /> */}
                  <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-lg font-semibold">Add Goal</Text>
                    <Pressable onPress={() => setModalVisible(false)}>
                      <Text className="text-base text-gray-500">Cancel</Text>
                    </Pressable>
                  </View>

                  <View className="mb-4">
                    <Text className="mb-1 text-sm text-gray-600">Nutrition Name</Text>
                    {dropdownOptions && (
                      <Dropdown
                        style={{
                          borderWidth: 1,
                          borderColor: '#D1D5DB',
                          borderRadius: 8,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                        }}
                        placeholderStyle={{ color: '#9CA3AF' }}
                        selectedTextStyle={{ color: '#111827' }}
                        data={dropdownOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select nutrition"
                        value={newGoalName}
                        onChange={(item) => setNewGoalName(item.value)}
                      />
                    )}
                  </View>

                  <View className="mb-6">
                    <Text className="mb-1 text-sm text-gray-600">Daily Goal (g)</Text>
                    <TextInput
                      placeholder="e.g. 150"
                      keyboardType="numeric"
                      value={newGoalValue}
                      onChangeText={setNewGoalValue}
                      returnKeyType="done"
                      className="rounded-lg border border-gray-300 px-4 py-3"
                    />
                  </View>

                  <View className="mb-6">
                    <View className="mb-4">
                      <Text className="mb-1 text-sm text-gray-600">Color</Text>
                      <View className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#1E293B]/5">
                        <View
                          className="h-full rounded-full"
                          style={{ width: `75%`, backgroundColor: barPreviewColor }}
                        />
                      </View>
                    </View>

                    <View className="flex items-center gap-4">
                      <ColorPicker
                        style={{ width: '70%' }}
                        value={DEFAULT_GOAL_COLOR}
                        onComplete={onSelectColor}>
                        {/* <Preview /> */}
                        <Panel1 />
                        <View className="mb-2"></View>
                        <HueSlider />
                        {/* <OpacitySlider /> */}
                        {/* <Swatches /> */}
                      </ColorPicker>
                    </View>
                  </View>

                  <Pressable
                    onPress={handleAddGoal}
                    className="items-center rounded-xl bg-gray-800 p-4">
                    <Text className="font-semibold text-white">Save</Text>
                  </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Pressable>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}
