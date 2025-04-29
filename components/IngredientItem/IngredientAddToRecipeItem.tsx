import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Ingredient } from '~/types';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';

type Props = {
  ingredient: Ingredient;
  addIngredient: (index: number, numberOfservings: number, servingSize: number | null) => void;
  setSearching: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
};

function roundToTwoDecimals(num: number) {
  return Math.round(num * 100) / 100;
}

export default function IngredientAddToRecipeItem({
  ingredient,
  addIngredient,
  setSearching,
  index,
}: Props) {
  const [open, setOpen] = useState(false);
  const [servingSize, setServingSize] = useState(String(ingredient.servingSize));
  const [numberOfServings, setNumberOfServings] = useState('1');

  const parsedServingSize = parseFloat(servingSize) || 0;
  const parsedNumberOfServings = parseFloat(numberOfServings) || 0;
  const originalServingSize = ingredient.servingSize || 1;

  return (
    <View className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      <TouchableOpacity
        className={`flex-row items-center justify-between bg-gray-800 px-4 py-3 ${
          open ? 'rounded-b-none' : 'rounded-md'
        }`}
        onPress={() => setOpen(!open)}>
        <View className="flex-row gap-2">
          {open && (
            <Pressable
              className="flex items-center justify-center rounded bg-white px-4"
              onPress={() => {
                addIngredient(index, parsedNumberOfServings, parsedServingSize);
                setSearching(false);
              }}>
              <Text className="font-bold text-gray-800">Add</Text>
            </Pressable>
          )}
          <View className="flex-col items-start gap-1">
            <Text className="text-xl font-semibold text-white">{ingredient.name}</Text>
            {ingredient.brand && <Text className="text-m text-gray-200">{ingredient.brand}</Text>}
          </View>
        </View>

        <Text className="text-xl text-white">{open ? '^' : 'v'}</Text>
      </TouchableOpacity>

      {open && (
        <View className="rounded-b-md border-[3px] border-t-0 border-gray-800 bg-white p-4">
          <View className="mb-2 flex-row items-center gap-2">
            <TextInput
              placeholder="Servings"
              value={numberOfServings}
              keyboardType="numeric"
              onChangeText={(v) => setNumberOfServings(v)}
              className="w-12 rounded border border-gray-300 p-2 text-center placeholder:text-gray-300"
            />
            <Text className="text-base font-medium">Servings</Text>
          </View>

          <View className="mb-2 flex-row items-center justify-between border-b-8 border-gray-800 pb-2">
            <Text className="text-base font-semibold">Serving Size</Text>
            <View className="flex-row items-center gap-1">
              <TextInput
                placeholder="Serving Size"
                value={servingSize}
                keyboardType="numeric"
                onChangeText={(v) => setServingSize(v)}
                className="w-12 rounded border border-gray-300 p-2 text-center placeholder:text-gray-300"
              />
              <Text className="text-base">{ingredient.servingUnit ?? 'g'}</Text>
            </View>
          </View>

          {/* === Add the MATH here === */}
          <View className="gap-1">
            {(Object.keys(NUTRITIONAL_KEYS) as Array<keyof Ingredient>).map((key) => {
              const baseValue = ingredient[key];
              if (baseValue == null) return null;

              const value =
                baseValue * parsedNumberOfServings * (parsedServingSize / originalServingSize);

              const roundedValue = roundToTwoDecimals(value);

              if (isNaN(roundedValue)) return null;

              return (
                <View key={key} className="flex-row justify-between">
                  <Text className="text-base">{NUTRITIONAL_KEYS[key]}</Text>
                  <Text className="text-base">
                    {roundedValue}
                    {NUTRITIONAL_UNITS[key]}
                  </Text>
                </View>
              );
            })}

            {Object.entries(ingredient.extraNutrition ?? {}).map(([key, val]) => {
              if (val.value == null) return null;

              const value =
                val.value * parsedNumberOfServings * (parsedServingSize / originalServingSize);

              const roundedValue = roundToTwoDecimals(value);

              if (isNaN(roundedValue)) return null;

              const unit = val.unit === 'percent' ? '%' : val.unit;

              return (
                <View key={key} className="flex-row justify-between">
                  <Text className="text-base">{val.label}</Text>
                  <Text className="text-base">
                    {roundedValue}
                    {unit}
                  </Text>
                </View>
              );
            })}
          </View>
          {/* === End math section === */}
        </View>
      )}
    </View>
  );
}
