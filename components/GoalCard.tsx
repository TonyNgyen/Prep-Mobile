import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

type GoalCardProps = {
  nutrition: string;
  goal: number;
  current: number;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (nutrition: string, newValue: number) => void;
  onSave: (nutrition: string, newValue: number) => void;
  onCancel: () => void;
};

export default function GoalCard({
  nutrition,
  goal,
  current,
  isEditing,
  onEdit,
  onChange,
  onSave,
  onCancel,
}: GoalCardProps) {
  const nutritionLabel = nutrition === 'totalCarbohydrates' ? 'Carbs' : nutrition;
  const formattedLabel = nutritionLabel.charAt(0).toUpperCase() + nutritionLabel.slice(1);
  const [localGoal, setLocalGoal] = useState(goal);

  const handleInputChange = (text: string) => {
    const numeric = parseFloat(text);
    if (!isNaN(numeric)) {
      setLocalGoal(numeric);
      onChange(nutrition, numeric);
    }
  };

  return (
    <Pressable
      className="mb-3 rounded-2xl bg-white px-4 py-3"
      onPress={!isEditing ? onEdit : undefined}>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-base font-semibold text-gray-900">{formattedLabel}</Text>
          <Text className="mt-1 text-xs text-gray-500">Today: {current ?? 0}</Text>
        </View>
        {isEditing ? (
          <TextInput
            className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-right text-xl font-bold text-gray-900"
            value={String(localGoal)}
            onChangeText={handleInputChange}
            keyboardType="numeric"
          />
        ) : (
          <View className="flex-row items-center space-x-1">
            <Text className="text-xl font-bold text-gray-900">{goal}</Text>
            {/* <Pencil size={16} color="#9ca3af" /> */}
            <Feather name="edit-2" size={16} color="#9ca3af" />
          </View>
        )}
      </View>

      {isEditing && (
        <View className="mt-3 flex-row justify-end space-x-3">
          <Pressable onPress={onCancel} className="rounded-lg bg-gray-200 px-3 py-2">
            {/* <X size={16} color="#374151" /> */}
            <Feather name="x" size={16} color="#374151" />
          </Pressable>
          <Pressable
            onPress={() => onSave(nutrition, localGoal)}
            className="rounded-lg bg-green-600 px-3 py-2">
            {/* <Check size={16} color="#fff" /> */}
            <Feather name="check" size={16} color="#fff" />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}
