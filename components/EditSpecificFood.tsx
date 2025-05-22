import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { IngredientMeal, RecipeMeal } from '~/types';
import { deleteMealFromMealHistory, deleteMealFromNutritionalHistory } from '~/lib/data';
import { Feather } from '@expo/vector-icons';

type EditSpecificFoodProps = {
  food: IngredientMeal | RecipeMeal;
  meal: string;
  date: string;
};

export default function EditSpecificFood({ food, meal, date }: EditSpecificFoodProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(food.totalAmount.toString());

  const unitLabel =
    food.unit === 'x' ? (parseFloat(amount) > 1 ? 'Servings' : 'Serving') : food.unit;

  const handleEdit = () => {
    setIsEditing(true);
    setDropdownVisible(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you might want to trigger an update function
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
                    deleteMealFromMealHistory(date, meal, food.id);
                    deleteMealFromNutritionalHistory(date, meal, food);
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
