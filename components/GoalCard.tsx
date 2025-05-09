import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (isEditing) {
      setLocalGoal(goal); // Reset localGoal when editing starts
    }
  }, [isEditing, goal]);

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
          <Text className="text-base font-semibold text-gray-800">{formattedLabel}</Text>
          <Text className="mt-1 text-xs text-gray-500">Today: {current ?? 0}</Text>
        </View>
        {isEditing ? (
          <TextInput
            className="w-20 rounded-lg border border-gray-300 p-2 text-right text-gray-800"
            style={{ fontSize: 16, fontWeight: 'bold' }}
            value={String(localGoal)}
            onChangeText={handleInputChange}
            keyboardType="numeric"
          />
        ) : (
          <View className="flex-row items-center gap-3">
            <Text className="text-xl font-bold text-gray-800">{goal}</Text>
            <Feather name="edit-2" size={16} color="#9ca3af" />
          </View>
        )}
      </View>

      {isEditing && (
        <View className="mt-3 flex-row gap-2">
          <Pressable onPress={onCancel} className="flex-1 rounded-lg bg-gray-200 py-3">
            <Feather name="x" size={20} color="#374151" className="text-center" />
          </Pressable>
          <Pressable
            onPress={() => onSave(nutrition, localGoal)}
            className="flex-1 rounded-lg bg-green-600 py-3">
            <Feather name="check" size={20} color="#fff" className="text-center" />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}
