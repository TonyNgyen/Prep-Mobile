import { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, TextInput } from 'react-native';
import { Ingredient, UserInventory } from '~/types';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';
import Feather from '@expo/vector-icons/Feather';
import { addIngredientToInventory } from '~/lib/inventory';

type Props = {
  ingredient: Ingredient;
  add: (
    id: string,
    name: string,
    containers: number,
    servingSize: number,
    numberOfServings: number,
    totalNumber: number,
    unit: string
  ) => void;
  inventory: UserInventory;
};

export default function IngredientAddToInventoryItem({ ingredient, add, inventory }: Props) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addType, setAddType] = useState<string>('servings');
  const [numberOfContainers, setNumberOfContainers] = useState<string>('1');
  const [servingSize, setServingSize] = useState<string>('1');
  const [numberOfServings, setNumberOfServings] = useState<string>('1');

  const handleAddServings = () => {
    if (!servingSize || !numberOfServings) {
      alert('Please fill in all fields!');
      return;
    }
    add(
      ingredient.id,
      ingredient.name,
      1,
      parseFloat(servingSize),
      parseFloat(numberOfServings),
      parseFloat(servingSize) * parseFloat(numberOfServings),
      ingredient.servingUnit
    );
    addIngredientToInventory(inventory, {
      id: ingredient.id,
      name: ingredient.name,
      containers: 1,
      servingSize: parseFloat(servingSize),
      numberOfServings: parseFloat(numberOfServings),
      totalAmount: parseFloat(servingSize) * parseFloat(numberOfServings),
      unit: ingredient.servingUnit,
      type: 'ingredient',
    });
  };

  const handleAddContainers = () => {
    if (!numberOfContainers) {
      return;
    }
    add(
      ingredient.id,
      ingredient.name,
      parseFloat(numberOfContainers),
      ingredient.servingSize,
      ingredient.servingsPerContainer,
      ingredient.servingSize * ingredient.servingsPerContainer * parseFloat(numberOfContainers),
      ingredient.servingUnit
    );
    addIngredientToInventory(inventory, {
      id: ingredient.id,
      name: ingredient.name,
      containers: parseFloat(numberOfContainers),
      servingSize: ingredient.servingSize,
      numberOfServings: ingredient.servingsPerContainer,
      totalAmount:
        ingredient.servingSize * ingredient.servingsPerContainer * parseFloat(numberOfContainers),
      unit: ingredient.servingUnit,
      type: 'ingredient',
    });
  };

  const handleAdd = () => {
    if (addType == 'containers') {
      handleAddContainers();
    } else {
      handleAddServings();
    }
  };

  const renderHeading = () => {
    if (adding) {
      return (
        <View
          className={`flex-row items-center justify-between rounded-b-none bg-gray-800 px-4 py-3`}>
          <View className="flex-row gap-2">
            <View className="flex-col items-start gap-1">
              <Text className="text-xl font-semibold text-white">{ingredient.name}</Text>
              {ingredient.brand && <Text className="text-m text-gray-200">{ingredient.brand}</Text>}
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          className={`flex-row items-center justify-between bg-gray-800 px-4 py-3 ${
            open ? 'rounded-b-none' : 'rounded-md'
          }`}
          onPress={() => setOpen(!open)}>
          <View className="flex-row gap-2">
            <Pressable
              className="flex items-center justify-center rounded bg-white px-4"
              onPress={() => setAdding(true)}>
              <Text className="font-bold text-gray-800">Add</Text>
            </Pressable>
            <View className="flex-col items-start gap-1">
              <Text className="text-xl font-semibold text-white">{ingredient.name}</Text>
              {ingredient.brand && <Text className="text-m text-gray-200">{ingredient.brand}</Text>}
            </View>
          </View>

          {open ? (
            <Feather name="chevron-up" size={24} color="white" />
          ) : (
            <Feather name="chevron-down" size={24} color="white" />
          )}
        </TouchableOpacity>
      );
    }
  };

  const renderInputs = () => {
    if (addType == 'servings') {
      return (
        <View className="gap-2">
          <View>
            <Text className="mb-1">Serving Size</Text>
            <TextInput
              placeholder="Serving Size"
              value={servingSize}
              onChangeText={(v) => setServingSize(v)}
              className="h-[40px] flex-1 rounded border border-gray-300 p-2 placeholder:text-gray-300"
            />
          </View>
          <View>
            <Text className="mb-1">Number of Servings</Text>
            <TextInput
              placeholder="Number of Servings"
              value={numberOfServings}
              onChangeText={(v) => setNumberOfServings(v)}
              className="h-[40px] flex-1 rounded border border-gray-300 p-2 placeholder:text-gray-300"
            />
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Text>Number of Containers</Text>
          <TextInput
            placeholder="Number of Containers"
            value={numberOfContainers}
            onChangeText={(v) => setNumberOfContainers(v)}
            className="h-[40px] flex-1 rounded border border-gray-300 p-2 placeholder:text-gray-300"
          />
        </View>
      );
    }
  };

  const renderBody = () => {
    if (adding) {
      return (
        <View className="gap-4 rounded-b-md border-[3px] border-t-0 border-gray-800 bg-white p-4">
          <View className="flex-row gap-2">
            <Pressable
              className={`flex-1 rounded border-2 border-gray-800 bg-gray-800 p-2 ${addType != 'servings' && 'opacity-50'}`}
              onPress={() => {
                setAddType('servings');
              }}>
              <Text className="text-center text-lg font-semibold text-white">Servings</Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded border-2 border-gray-800 bg-gray-800 p-2 ${addType != 'containers' && 'opacity-50'}`}
              onPress={() => {
                setAddType('containers');
              }}>
              <Text className="text-center text-lg font-semibold text-white">Containers</Text>
            </Pressable>
          </View>
          {renderInputs()}
          <View className="flex-row gap-2">
            <Pressable
              className="flex-1 rounded border-2 border-gray-800 p-2"
              onPress={() => {
                setAdding(false);
              }}>
              <Text className="text-center text-lg font-semibold">Cancel</Text>
            </Pressable>
            <Pressable
              className="flex-1 rounded border-2 border-gray-800 bg-gray-800 p-2"
              onPress={() => handleAdd()}>
              <Text className="text-center text-lg font-semibold text-white">Add Food</Text>
            </Pressable>
          </View>
        </View>
      );
    }
    if (open) {
      return (
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
      );
    }
  };

  return (
    <View className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      {renderHeading()}
      {renderBody()}
    </View>
  );
}
