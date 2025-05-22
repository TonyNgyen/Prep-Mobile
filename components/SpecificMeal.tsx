import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SpecificMealEntry } from '~/types';

import LogFoodForm from '~/components/dataForms/logFoodForm/LogFoodForm';
import SpecificFood from './specificFood/SpecificFood';
import EditSpecificFood from './editSpecificFood/EditSpecificFood';

type SpecificMealProps = {
  meal: string;
  mealInformation: SpecificMealEntry | null;
  date: string;
};

export default function SpecificMeal({ meal, mealInformation, date }: SpecificMealProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const capitalizedMeal = meal.charAt(0).toUpperCase() + meal.slice(1);
  const hasFood = mealInformation && Object.keys(mealInformation.food).length !== 0;

  if (showAddForm) {
    return (
      <LogFoodForm
        dateInput={date}
        mealInput={meal}
        isForm={true}
        setShowAddForm={setShowAddForm}
      />
    );
  }

  return (
    <View className="mb-3 overflow-hidden rounded-xl shadow-sm">
      {/* Header */}
      <View className="flex-row items-center justify-between rounded-t-xl bg-gray-300 px-3 py-2">
        <Text className="text-xl font-semibold">{capitalizedMeal}</Text>
        {!editing && (
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Feather name="edit-3" size={20} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      {/* Body */}
      <View className="bg-gray-300/50">
        {hasFood && (
          <View className="space-y-3 px-3 py-2">
            {Object.values(mealInformation!.food).map((food, idx) =>
              !editing ? (
                <SpecificFood key={idx} food={food} />
              ) : (
                <EditSpecificFood key={idx} food={food} meal={meal} date={date} />
              )
            )}
          </View>
        )}

        {!editing ? (
          <TouchableOpacity
            onPress={() => setShowAddForm(true)}
            className={`text-md px-3 py-2 font-semibold ${
              hasFood ? 'border-t border-gray-300' : ''
            }`}>
            <Text className="text-base font-semibold">Add Food</Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row justify-center gap-2 px-4 py-2">
            <TouchableOpacity
              className="flex-1 items-center rounded-md bg-red-500 py-1"
              onPress={() => setEditing(false)}>
              <Text className="font-semibold text-white">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center rounded-md bg-green-500 py-1">
              <Text className="font-semibold text-white">Confirm</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
