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
import {
  fetchUserDayNutritionalHistory,
  fetchUserNutritionalGoals,
  updateUserNutritionalGoals,
} from '~/lib/goals';
import { useAuth } from '~/contexts/AuthProvider';
import GoalCard from '~/components/GoalCard';
import Feather from '@expo/vector-icons/Feather';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalValue, setNewGoalValue] = useState('');

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

    const updatedGoals = {
      ...nutritionalGoals,
      [name]: value,
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
                    <TextInput
                      placeholder="e.g. Protein"
                      value={newGoalName}
                      onChangeText={setNewGoalName}
                      returnKeyType="next"
                      className="rounded-lg border border-gray-300 px-4 py-3"
                    />
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

                  <Pressable
                    onPress={handleAddGoal}
                    className="items-center rounded-xl bg-black p-4">
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
