import { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, Modal } from 'react-native';
import { Ingredient } from '~/types';
import { NUTRITIONAL_KEYS } from '~/constants/NUTRITIONAL_KEYS';
import { NUTRITIONAL_UNITS } from '~/constants/NUTRITIONAL_UNITS';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '~/contexts/AuthProvider';
import { deleteUserIngredient } from '~/lib/ingredient';

type Props = {
  ingredient: Ingredient;
};

export default function IngredientListItem({ ingredient }: Props) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <View className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
        <TouchableOpacity
          className={`flex-row items-center justify-between bg-gray-800 px-4 py-3 ${open ? 'rounded-b-none' : 'rounded-md'}`}
          onPress={() => setOpen(!open)}>
          <View className="flex-1 flex-col items-start gap-1">
            <Text className="text-xl font-semibold text-white">{ingredient.name}</Text>
            {ingredient.brand && <Text className="text-m text-gray-200">{ingredient.brand}</Text>}
          </View>

          <Feather name={open ? 'chevron-up' : 'chevron-down'} size={24} color="white" />
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

                return (
                  <View key={key} className="flex-row justify-between">
                    <Text className="text-base">{NUTRITIONAL_KEYS[key]}</Text>
                    <Text className="text-base">
                      {value || 0}
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

            <View className="flex-row justify-between">
              <View></View>
              <View className="mt-2 flex-row gap-4">
                {/* <Pressable className="min-w-24 rounded-md bg-gray-800 py-2">
                  <Text className="text-center font-semibold text-white">Edit</Text>
                </Pressable> */}
                <Pressable
                  onPress={() => setShowModal(true)}
                  className="min-w-24 rounded-md bg-red-800 py-2">
                  <Text className="text-center font-semibold text-white">Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-80 rounded-lg bg-white p-6 shadow-lg">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Confirm Deletion</Text>
            <Text className="mb-6 text-base text-gray-600">
              Are you sure you want to delete this ingredient?
            </Text>

            <View className="flex-row justify-end gap-4">
              <Pressable
                onPress={() => setShowModal(false)}
                className="rounded-md bg-gray-200 px-4 py-2">
                <Text className="font-semibold text-gray-800">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowModal(false);
                  deleteUserIngredient(user?.id, ingredient.id);
                }}
                className="rounded-md bg-red-600 px-4 py-2">
                <Text className="font-semibold text-white">Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
