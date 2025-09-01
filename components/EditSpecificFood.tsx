import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { IngredientMeal, RecipeMeal } from '~/types';
import { Feather } from '@expo/vector-icons';
import { deleteUserMealFromMealHistory, deleteUserMealFromNutritionalHistory } from '~/lib/meals';
import { useAuth } from '~/contexts/AuthProvider';

type EditSpecificFoodProps = {
  food: IngredientMeal | RecipeMeal;
  meal: string;
  date: Date;
};

export default function EditSpecificFood({ food, meal, date }: EditSpecificFoodProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(food.totalAmount.toString());
  const { user } = useAuth();

  const unitLabel =
    food.unit === 'x' ? (parseFloat(amount) > 1 ? 'Servings' : 'Serving') : food.unit;

  const handleEdit = () => {
    setIsEditing(true);
    setDropdownVisible(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Saved amount:', amount);
  };

  return (
    <View className="relative flex-row items-center justify-between rounded-md bg-white p-2">
      <View className="flex-1">
        <Text className="text-base font-medium">{food.name}</Text>
        {isEditing ? (
          <View className="mt-1 flex-row items-center space-x-2">
            <TextInput
              className="w-14 rounded border border-gray-300 px-2 py-1 text-sm text-gray-600"
              value={amount}
              onChangeText={setAmount}
              onBlur={handleSave}
              keyboardType="numeric"
              autoFocus
            />
            <Text className="text-sm text-gray-600">{unitLabel}</Text>
          </View>
        ) : (
          <Text className="mt-1 text-sm text-gray-600">
            {amount} {unitLabel}
          </Text>
        )}
      </View>

      {!isEditing && (
        <>
          <TouchableOpacity onPress={() => setDropdownVisible(true)}>
            <Feather name="more-vertical" size={20} color="#333" />
          </TouchableOpacity>

          <Modal
            transparent
            visible={dropdownVisible}
            animationType="fade"
            onRequestClose={() => setDropdownVisible(false)}>
            <Pressable className="flex-1" onPress={() => setDropdownVisible(false)}>
              <View className="absolute right-4 top-10 z-50 w-36 rounded-md border bg-white shadow-md">
                <TouchableOpacity className="px-4 py-2" onPress={handleEdit}>
                  <Text className="text-gray-800">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="border-t border-gray-200 px-4 py-2"
                  onPress={() => {
                    setDropdownVisible(false);
                    deleteUserMealFromMealHistory(
                      date.toLocaleDateString('en-CA'),
                      meal,
                      food.id,
                      user?.id
                    );
                    deleteUserMealFromNutritionalHistory(
                      date.toLocaleDateString('en-CA'),
                      meal,
                      food,
                      user?.id
                    );
                  }}>
                  <Text className="text-red-500">Delete</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </>
      )}
    </View>
  );
}
