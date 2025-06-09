import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { searchIngredientByName } from '~/lib/ingredient';
import { searchRecipeByName } from '~/lib/recipe';
import { Ingredient, InventoryIngredient, InventoryRecipe, NutritionFacts, Recipe } from '~/types';
import LogRecipeInfo from '../LogRecipeInfo';
import LogIngredientInfo from '../LogIngredientInfo';
import DateTimePicker from '@react-native-community/datetimepicker';

type ItemsToAdd = Record<string, InventoryIngredient | InventoryRecipe>;

type SearchResultType = {
  recipes: Recipe[];
  ingredients: Ingredient[];
};

type PageProps = {
  addLogIngredient: (
    id: string,
    name: string,
    containers: number,
    servingSize: number,
    numberOfServings: number,
    totalAmount: number,
    unit: string,
    type: string
  ) => void;
  addLogRecipe: (
    id: string,
    name: string,
    servings: number,
    servingSize: number,
    totalAmount: number,
    unit: string,
    type: string
  ) => void;
  nutrition: NutritionFacts;
  setNutrition: React.Dispatch<React.SetStateAction<NutritionFacts>>;
  inventory: ItemsToAdd;
  setInventory: React.Dispatch<React.SetStateAction<ItemsToAdd>>;
  meal: string | undefined;
  setMeal: React.Dispatch<React.SetStateAction<string | undefined>>;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

const mealOptions = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
];

export default function Page1({
  addLogIngredient,
  addLogRecipe,
  nutrition,
  setNutrition,
  inventory,
  setInventory,
  meal,
  setMeal,
  date,
  setDate,
}: PageProps) {
  const [search, setSearch] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [searchResult, setSearchResult] = useState<SearchResultType>({
    recipes: [],
    ingredients: [],
  });

  const searchItem = async () => {
    const ingredients = (await searchIngredientByName(search)) ?? [];
    const recipes = (await searchRecipeByName(search)) ?? [];

    setSearchResult({ ingredients, recipes });
  };

  const addIngredient = (
    id: string,
    name: string,
    containers: number,
    servingSize: number,
    numberOfServings: number,
    totalAmount: number,
    unit: string
  ) => {
    addLogIngredient(
      id,
      name,
      containers,
      servingSize,
      numberOfServings,
      totalAmount,
      unit,
      'ingredient'
    );
    setSearch('');
    setSearchResult({ recipes: [], ingredients: [] });
  };

  const addRecipe = (
    id: string,
    name: string,
    servings: number,
    servingSize: number,
    totalAmount: number,
    unit: string
  ) => {
    addLogRecipe(id, name, servings, servingSize, totalAmount, unit, 'recipe');
    setSearch('');
    setSearchResult({ recipes: [], ingredients: [] });
  };

  return (
    <View className="flex-1 p-4">
      <View className="mb-4">
        <Text className="mb-2 text-xl font-semibold text-gray-900">Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="rounded-md border border-gray-300 bg-white px-4 py-3">
          <Text className="text-base text-gray-800" style={{ fontSize: 16 }}>
            {date?.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }) ?? 'Pick a date'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <Modal transparent animationType="fade" visible={showDatePicker}>
            <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
              <View className="flex-1 justify-center bg-black/40 px-6">
                <TouchableWithoutFeedback>
                  <View className="overflow-hidden rounded-md bg-white">
                    <View className="p-4">
                      <DateTimePicker
                        value={date ?? new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(_, selectedDate) => {
                          if (Platform.OS !== 'ios') {
                            setShowDatePicker(false);
                          }
                          if (selectedDate) {
                            setDate(selectedDate);
                          }
                        }}
                        minimumDate={new Date(2023, 0, 1)}
                        maximumDate={new Date()}
                        textColor={Platform.OS === 'ios' ? 'black' : undefined}
                      />
                      {Platform.OS === 'ios' && (
                        <TouchableOpacity
                          className="mt-4 rounded-md bg-gray-800 py-2"
                          onPress={() => setShowDatePicker(false)}>
                          <Text className="text-center font-semibold text-white">Done</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
      <View className="mb-4">
        <Text className="mb-2 text-xl font-semibold text-gray-800">Meal</Text>
        <Dropdown
          data={mealOptions}
          value={meal}
          onChange={(item) => setMeal(item.value)}
          labelField="label"
          valueField="value"
          placeholder="Select a meal"
          style={{ backgroundColor: '#1F2937', padding: 16, borderRadius: 6 }}
          placeholderStyle={{ color: 'white' }}
          selectedTextStyle={{ color: 'white' }}
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2 text-xl font-semibold text-gray-800">Food Name</Text>
        <View className="flex-row space-x-2">
          <TextInput
            placeholder="e.g. Chicken"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={searchItem}
            className="flex-1 rounded-l-md border border-gray-300 bg-white p-3 placeholder:text-gray-300"
            style={{ fontSize: 16 }}
          />
          <TouchableOpacity
            onPress={searchItem}
            className="justify-center rounded-r-md bg-gray-800 px-4">
            <Text className="font-semibold text-white">Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={[...searchResult.ingredients, ...searchResult.recipes]}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) =>
          'ingredientList' in item ? (
            <LogRecipeInfo
              recipe={item}
              add={addRecipe}
              inventory={inventory}
              setInventory={setInventory}
              setNutrition={setNutrition}
              nutrition={nutrition}
            />
          ) : (
            <LogIngredientInfo
              ingredient={item}
              add={addIngredient}
              inventory={inventory}
              setInventory={setInventory}
              setNutrition={setNutrition}
              nutrition={nutrition}
            />
          )
        }
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </View>
  );
}
