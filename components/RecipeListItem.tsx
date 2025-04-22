import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';
import { Recipe } from '~/types';

type Props = {
  recipe: Recipe;
};

export default function RecipeListItem({ recipe }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className={`flex-row items-center justify-between bg-gray-800 px-4 py-3 ${
          open ? 'rounded-b-none' : 'rounded-md'
        }`}>
        <Text className="text-xl font-semibold text-white">{recipe.name}</Text>
        <Text className="text-xl text-white">{open ? '^' : 'v'}</Text>
      </TouchableOpacity>

      {open && (
        <View className="rounded-b-md border-[3px] border-t-0 border-gray-800 bg-white p-4">
          <View className="mb-2 border-b-8 border-gray-800 pb-2">
            <Text className="text-base">{recipe.numberOfServings} Servings Per Recipe</Text>
          </View>

          <View className="gap-1">
            {(Object.keys(NUTRITIONAL_KEYS) as Array<keyof Recipe>).map((key) => {
              const value = recipe[key];
              if (value === null || value === undefined) return null;

              const unit = NUTRITIONAL_UNITS[key];

              return (
                <View key={key} className="flex-row justify-between">
                  <Text className="text-base">{NUTRITIONAL_KEYS[key]}</Text>
                  <Text className="text-base">
                    {value}
                    {unit}
                  </Text>
                </View>
              );
            })}

            {Object.entries(recipe.extraNutrition ?? {}).map(([key, val]) => {
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
