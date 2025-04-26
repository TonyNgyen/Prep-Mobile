import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ingredient } from '~/types';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';

type Props = {
  ingredient: Ingredient;
};

export default function IngredientListItem({ ingredient }: Props) {
  const [open, setOpen] = useState(false);
  console.log(ingredient);

  return (
    <View className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      <TouchableOpacity
        className={`flex-row items-center justify-between bg-gray-800 px-4 py-3 ${
          open ? 'rounded-b-none' : 'rounded-md'
        }`}
        onPress={() => setOpen(!open)}>
        <View className="flex-col items-start gap-1">
          <Text className="text-xl font-semibold text-white">{ingredient.name}</Text>
          {ingredient.brand && <Text className="text-m text-gray-200">{ingredient.brand}</Text>}
        </View>

        <Text className="text-xl text-white">{open ? '^' : 'v'}</Text>
      </TouchableOpacity>

      {open && (
        <View className="rounded-b-md border-[3px] border-t-0 border-gray-800 bg-white p-4">
          <Text className="mb-2 text-base font-medium">
            {ingredient.servingsPerContainer} Servings Per Container
          </Text>
          <View className="mb-2 flex-row justify-between border-b-8 border-gray-800 pb-2">
            <Text className="text-base font-semibold">Serving Size</Text>
            <Text className="text-base">
              {ingredient.servingSize}
              {ingredient.servingUnit ?? 'g'}
            </Text>
          </View>

          <View className="gap-1">
            {(Object.keys(NUTRITIONAL_KEYS) as Array<keyof Ingredient>).map((key) => {
              const value = ingredient[key];
              if (!value) return null;

              return (
                <View key={key} className="flex-row justify-between">
                  <Text className="text-base">{NUTRITIONAL_KEYS[key]}</Text>
                  <Text className="text-base">
                    {value}
                    {NUTRITIONAL_UNITS[key]}
                  </Text>
                </View>
              );
            })}

            {Object.entries(ingredient.extraNutrition ?? {}).map(([key, val]) => {
              if (val.value == null) return null;
              const unit = val.unit === 'percent' ? '%' : val.unit;

              return (
                <View key={key} className="flex-row justify-between">
                  <Text className="text-base">{val.label}</Text>
                  <Text className="text-base">
                    {val.value}
                    {unit}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}
