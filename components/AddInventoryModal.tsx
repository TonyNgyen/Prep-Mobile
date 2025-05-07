import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import {
  Keyboard,
  Modal,
  Text,
  View,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  FlatList,
} from 'react-native';
import { fetchIngredientsByName } from '~/lib/ingredient';
import { fetchRecipesByName } from '~/lib/recipe';
import { Ingredient, InventoryIngredient, InventoryRecipe, Recipe, UserInventory } from '~/types';
import IngredientAddToInventoryItem from './IngredientItem/IngredientAddToInventoryItem';
import RecipeAddToInventoryItem from './RecipeItem/RecipeAddToInventoryItem';
import { updateUserInventory } from '~/lib/inventory';

type Props = {
  userId: string | undefined;
  visible: boolean;
  onClose: () => void;
  headerHeight: number;
  onConfirm: (newInventory: UserInventory) => void;
  currentInventory: UserInventory;
};

type SearchResultType = {
  recipes: Recipe[];
  ingredients: Ingredient[];
};

type ItemsToAdd = Record<string, InventoryIngredient | InventoryRecipe>;

export default function AddInventoryModal({
  userId,
  visible,
  onClose,
  headerHeight,
  onConfirm,
  currentInventory,
}: Props) {
  const [page, setPage] = useState('first');
  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchResultType>({
    recipes: [],
    ingredients: [],
  });
  const [foodToAdd, setFoodToAdd] = useState<ItemsToAdd>({});

  const handleAlert = () => {
    return true;
  };

  const reset = () => {
    setPage('first');
    setSearch('');
    setSearchResult({ recipes: [], ingredients: [] });
    setFoodToAdd({});
  };

  const handleSubmit = async () => {
    if (userId == undefined) {
      alert('Error: Please Contact Tony');
      return;
    }
    if (await updateUserInventory(currentInventory, userId)) {
      onConfirm(currentInventory);
    }
    reset();
    onClose();
  };

  const renderHeader = () => {
    if (page == 'first') {
      return (
        <>
          <Pressable
            onPress={() => {
              onClose();
              setFoodToAdd({});
              setSearch('');
              setSearchResult({
                recipes: [],
                ingredients: [],
              });
              setPage('first');
            }}
            className="px-4 pb-3">
            <Feather name="x" size={24} color="black" />
          </Pressable>
          <Text className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-3 text-lg font-semibold">
            Add to Inventory
          </Text>
          <Pressable
            onPress={() => {
              handleAlert() && setPage('review');
            }}
            className="px-4 pb-3">
            <Feather name="chevron-right" size={24} color="black" />
          </Pressable>
        </>
      );
    } else {
      return (
        <>
          <Pressable onPress={() => setPage('first')} className="px-4 pb-3">
            <Feather name="chevron-left" size={24} color="black" />
          </Pressable>
          <Text className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-3 text-lg font-semibold">
            Add to Inventory
          </Text>
          <Pressable onPress={() => handleSubmit()} className="px-4 pb-3">
            <Feather name="check" size={24} color="black" />
          </Pressable>
        </>
      );
    }
  };

  const handleSearch = async () => {
    let ingredientData: Ingredient[] = [];
    let recipeData: Recipe[] = [];

    ingredientData = (await fetchIngredientsByName(search)) ?? [];
    recipeData = (await fetchRecipesByName(search)) ?? [];

    setSearchResult({
      recipes: recipeData,
      ingredients: ingredientData,
    });
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
    setFoodToAdd((prev) => ({
      ...prev,
      [id]: {
        id,
        name,
        containers,
        servingSize,
        numberOfServings,
        totalAmount,
        unit,
        type: 'ingredient',
      },
    }));
    setSearch('');
    setSearchResult({
      recipes: [],
      ingredients: [],
    });
  };

  const addRecipe = (
    id: string,
    name: string,
    numberOfServings: number,
    servingSize: number,
    totalAmount: number,
    unit: string
  ) => {
    setFoodToAdd((prev) => ({
      ...prev,
      [id]: {
        id,
        name,
        numberOfServings,
        servingSize,
        totalAmount,
        unit,
        type: 'recipe',
      },
    }));
    setSearch('');
    setSearchResult({
      recipes: [],
      ingredients: [],
    });
  };

  const renderPage = () => {
    if (page == 'first') {
      return (
        <View className="p-4">
          <Text className="mb-1 text-lg">Food Name</Text>
          <View className="flex-row">
            <TextInput
              placeholder="Ingredient Name"
              value={search}
              onChangeText={(v) => setSearch(v)}
              className="mb-2 h-[40px] flex-1 rounded border border-gray-300 p-2 placeholder:text-gray-300"
            />
            <Pressable
              className="flex h-[40px] items-center justify-center rounded-r bg-gray-800 px-5"
              onPress={handleSearch}>
              <Text className="text-xl font-semibold text-white">Search</Text>
            </Pressable>
          </View>
          <FlatList
            data={searchResult.ingredients}
            renderItem={({ item }) => (
              <IngredientAddToInventoryItem
                ingredient={item}
                add={addIngredient}
                inventory={currentInventory}
              />
            )}
          />
          <FlatList
            data={searchResult.recipes}
            renderItem={({ item }) => (
              <RecipeAddToInventoryItem
                recipe={item}
                add={addRecipe}
                inventory={currentInventory}
              />
            )}
          />
        </View>
      );
    } else {
      return (
        <View className="p-4">
          <Pressable onPress={() => console.log(currentInventory)}>
            <Text className="bg-red-200 p-5">Test</Text>
          </Pressable>
          <FlatList
            data={Object.values(foodToAdd)}
            renderItem={({ item }) => (
              <View className="flex-row justify-between rounded bg-gray-800 p-4">
                <Text className="text-lg font-bold text-white">{item.name}</Text>
                <Text className="text-lg font-bold text-white">
                  {item.totalAmount} {item.unit}
                </Text>
              </View>
            )}
          />
        </View>
      );
    }
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-white">
          <View
            className="relative flex w-full flex-row items-end justify-between border-b border-gray-200"
            style={{ height: headerHeight }}>
            {renderHeader()}
          </View>
          {renderPage()}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
