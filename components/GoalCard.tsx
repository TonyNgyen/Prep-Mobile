import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from 'reanimated-color-picker';
import { runOnJS } from 'react-native-reanimated';

type GoalCardProps = {
  nutrition: string;
  goal: number;
  current: number;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (nutrition: string, newValue: number, barColor: string) => void;
  onSave: (nutrition: string, newValue: number, barColor: string) => void;
  onCancel: () => void;
  color: string;
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
  color,
}: GoalCardProps) {
  const nutritionLabel = nutrition === 'totalCarbohydrates' ? 'Carbs' : nutrition;
  const formattedLabel = nutritionLabel.charAt(0).toUpperCase() + nutritionLabel.slice(1);

  const [localGoal, setLocalGoal] = useState(goal);
  const [barColor, setBarColor] = useState(color); // Default gray-800
  const [barPreviewColor, setBarPreviewColor] = useState(color);
  // const selectedColor = useSharedValue(barColor);

  const onSelectColor = ({ hex }) => {
    'worklet';
    // do something with the selected color.
    runOnJS(setBarPreviewColor)(hex);
  };

  useEffect(() => {
    if (isEditing) {
      setLocalGoal(goal);
    }
  }, [isEditing, goal]);

  const handleInputChange = (text: string) => {
    const numeric = parseFloat(text);
    if (!isNaN(numeric)) {
      setLocalGoal(numeric);
      onChange(nutrition, numeric, barPreviewColor);
    }
  };

  const progress = Math.min((current ? current : 0 / (goal || 1)) * 100, 100);

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

      {/* Progress bar */}
      {/* <View className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#1E293B]/5">
        <View
          className="h-full rounded-full"
          style={{ width: `${progress}%`, backgroundColor: barColor }}
        />
      </View> */}

      {isEditing ? (
        <View className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#1E293B]/5">
          <View
            className="h-full rounded-full"
            style={{ width: `75%`, backgroundColor: barPreviewColor }}
          />
        </View>
      ) : (
        <View className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#1E293B]/5">
          <View
            className="h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: barColor }}
          />
        </View>
      )}

      {isEditing && (
        <View className="mt-4">
          <Text className="mb-4 text-sm text-gray-500">Progress Bar Color:</Text>
          <View className="flex items-center">
            <ColorPicker style={{ width: '70%' }} value={color} onComplete={onSelectColor}>
              {/* <Preview /> */}
              <Panel1 />
              <View className='mb-2'></View>
              <HueSlider />
              {/* <OpacitySlider /> */}
              {/* <Swatches /> */}
            </ColorPicker>
          </View>
        </View>
      )}

      {isEditing && (
        <View className="mt-3 flex-row gap-2">
          <Pressable onPress={onCancel} className="flex-1 items-center rounded-lg bg-gray-200 py-3">
            <Feather name="x" size={20} color="#374151" />
          </Pressable>
          <Pressable
            onPress={() => {
              onSave(nutrition, localGoal, barPreviewColor);
              setBarColor(barPreviewColor);
            }}
            className="flex-1 items-center rounded-lg bg-green-600 py-3">
            <Feather name="check" size={20} color="#fff" />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}
