import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Platform,
} from 'react-native';
import { InventoryIngredient, InventoryRecipe, NutritionFacts } from '~/types';
import Page1 from './Page1';
import Page2 from './Page2';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addToUserNutritionalHistory } from '~/lib/nutrition';
import { addToUserMealHistory } from '~/lib/meals';
import { useAuth } from '~/contexts/AuthProvider';
import { updateUserInventoryItems } from '~/lib/inventory';

type ItemsToAdd = Record<string, InventoryIngredient | InventoryRecipe>;

type LogFoodFormProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dateInput: Date;
  mealInput: string | undefined;
};

export default function LogFoodForm({
  visible,
  onClose,
  onConfirm,
  dateInput,
  mealInput,
}: LogFoodFormProps) {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [meal, setMeal] = useState(mealInput);
  const insets = useSafeAreaInsets();
  const [date, setDate] = useState<Date | undefined>(dateInput);
  useEffect(() => {
    setDate(dateInput);
  }, [dateInput]);
  const nativeHeaderHeight = (Platform.OS === 'ios' ? 44 : 56) + insets.top;
  const [nutrition, setNutrition] = useState<NutritionFacts>({
    calories: 0,
    protein: 0,
    totalFat: 0,
    saturatedFat: 0,
    polyunsaturatedFat: 0,
    monounsaturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    potassium: 0,
    totalCarbohydrates: 0,
    dietaryFiber: 0,
    totalSugars: 0,
    addedSugars: 0,
    sugarAlcohols: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    calcium: 0,
    iron: 0,
    extraNutrition: {},
  });
  const [inventory, setInventory] = useState<ItemsToAdd>({});
  const [logFood, setLogFood] = useState<ItemsToAdd>({});

  const addLogIngredient = (
    id: string,
    name: string,
    containers: number,
    servingSize: number,
    numberOfServings: number,
    totalAmount: number,
    unit: string,
    type: string
  ) => {
    setLogFood((prev) => ({
      ...prev,
      [id]: {
        id,
        name,
        containers,
        servingSize,
        numberOfServings,
        totalAmount,
        unit,
        type,
      },
    }));
  };

  const addLogRecipe = (
    id: string,
    name: string,
    servings: number,
    servingSize: number,
    totalAmount: number,
    unit: string,
    type: string
  ) => {
    setLogFood((prev) => {
      if (prev[id]) {
        return {
          ...prev,
          [id]: {
            ...prev[id],
            totalAmount: prev[id].totalAmount + totalAmount,
          },
        };
      }
      return {
        ...prev,
        [id]: {
          id,
          name,
          servings,
          servingSize,
          totalAmount,
          unit,
          type,
        },
      };
    });
  };

  const handleAlert = () => {
    if (page == 1) {
      // if (name == '' || servingSize == '' || numberOfServings == '') {
      //   alert('Please fill in all fields!');
      //   return false;
      // }
      return true;
    }

    if (page == 2) {
      // if (Object.entries(ingredientInformation).length == 0) {
      //   alert('Please add an ingredient!');
      //   return false;
      // }
      return true;
    }
  };

  const handleLog = () => {
    console.log('Final log:', {
      meal,
      inventory,
      nutrition,
    });
    // TODO: Submit to Supabase or backend
  };

  const renderHeader = () => {
    if (page == 1) {
      return (
        <>
          <Pressable
            onPress={() => {
              onClose();
              // reset();
            }}
            className="px-4 pb-3">
            <Feather name="x" size={24} color="black" />
          </Pressable>
          <Text className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-3 text-lg font-semibold">
            Log Food
          </Text>
          <Pressable
            onPress={() => {
              handleAlert() && setPage(2);
            }}
            className="px-4 pb-3">
            <Feather name="chevron-right" size={24} color="black" />
          </Pressable>
        </>
      );
    } else if (page == 2) {
      return (
        <>
          <Pressable onPress={() => setPage(1)} className="px-4 pb-3">
            <Feather name="chevron-left" size={24} color="black" />
          </Pressable>
          <Text className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-3 text-lg font-semibold">
            Log Food
          </Text>
          <Pressable
            onPress={async () => {
              try {
                if (!meal || !date) {
                  return;
                }
                await addToUserNutritionalHistory(date, nutrition, meal, user?.id);
                await addToUserMealHistory(
                  meal,
                  {
                    food: logFood,
                  },
                  date,
                  user?.id
                );
                await updateUserInventoryItems(logFood, user?.id);
                onConfirm();
              } catch (error) {
                console.error('Failed to log food:', error);
              }
            }}
            className="rounded-md bg-gray-800 px-4 py-2">
            <Text className="text-center font-semibold text-white">Log Food</Text>
          </Pressable>
        </>
      );
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <View
            className="relative flex w-full flex-row items-end justify-between border-b border-gray-200"
            style={{
              paddingTop: insets.top,
              height: nativeHeaderHeight,
            }}>
            {renderHeader()}
          </View>
          <View className="flex-1 bg-[#f2f2f2]">
            {page === 1 ? (
              <Page1
                addLogIngredient={addLogIngredient}
                addLogRecipe={addLogRecipe}
                nutrition={nutrition}
                setNutrition={setNutrition}
                inventory={inventory}
                setInventory={setInventory}
                meal={meal}
                setMeal={setMeal}
                date={date}
                setDate={setDate}
              />
            ) : (
              <Page2 nutrition={nutrition} logFood={logFood} inventory={inventory} />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
