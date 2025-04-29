import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ingredient } from '~/types';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';
import Feather from '@expo/vector-icons/Feather';

type Props = {
  ingredient: Ingredient;
  numberOfServings: number | null;
  servingSize: number | null;
};

function roundToTwoDecimals(num: number) {
  return Math.round(num * 100) / 100;
}

export default function IngredientAddedToRecipeItem({
  ingredient,
  numberOfServings,
  servingSize,
}: Props) {
  const [open, setOpen] = useState(false);

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

        {open ? (
          <Feather name="chevron-up" size={24} color="white" />
        ) : (
          <Feather name="chevron-down" size={24} color="white" />
        )}
      </TouchableOpacity>

      {open && (
        <View className="rounded-b-md border-[3px] border-t-0 border-gray-800 bg-white p-4">
          <Text className="mb-2 text-base font-medium">{numberOfServings} Servings</Text>
          <View className="mb-2 flex-row justify-between border-b-8 border-gray-800 pb-2">
            <Text className="text-base font-semibold">Serving Size</Text>
            <Text className="text-base">
              {servingSize ?? ingredient.servingSize}
              {ingredient.servingUnit ?? 'g'}
            </Text>
          </View>

          <View className="gap-1">
            {/* Nutritional Keys */}
            {(Object.keys(NUTRITIONAL_KEYS) as Array<keyof Ingredient>).map((key) => {
              const rawValue = ingredient[key];
              if (rawValue == null) return null;

              const value =
                (Number(rawValue) || 0) *
                (numberOfServings ?? 1) *
                ((servingSize ?? 1) / (ingredient.servingSize || 1));

              const roundedValue = roundToTwoDecimals(value);

              if (isNaN(roundedValue)) return null;

              const unit = NUTRITIONAL_UNITS[key];

              return (
                <View key={key} className="flex-row justify-between">
                  <Text className="text-base">{NUTRITIONAL_KEYS[key]}</Text>
                  <Text className="text-base">
                    {roundedValue}
                    {unit}
                  </Text>
                </View>
              );
            })}

            {/* Extra Nutrition */}
            {Object.entries(ingredient.extraNutrition ?? {}).map(([key, val]) => {
              if (val.value == null) return null;

              const value =
                (val.value ?? 0) *
                (numberOfServings ?? 1) *
                ((servingSize ?? 1) / (ingredient.servingSize || 1));

              const roundedValue = roundToTwoDecimals(value);

              if (isNaN(roundedValue)) return null;

              let unit = val.unit === 'percent' ? '%' : val.unit;

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
        </View>
      )}
    </View>
  );
}
