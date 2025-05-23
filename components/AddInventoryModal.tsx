import { useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
  Text,
  View,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { fetchIngredientsByName } from '~/lib/ingredient';
import { fetchRecipesByName } from '~/lib/recipe';
import { fetchUserInventory, updateUserInventory } from '~/lib/inventory';
import { Ingredient, InventoryIngredient, InventoryRecipe, Recipe, UserInventory } from '~/types';
import IngredientAddToInventoryItem from './IngredientItem/IngredientAddToInventoryItem';
import RecipeAddToInventoryItem from './RecipeItem/RecipeAddToInventoryItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  userId: string | undefined;
  visible: boolean;
  onClose: () => void;
  onConfirm: (newInventory: UserInventory) => void;
  currentInventory?: UserInventory | null;
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
  onConfirm,
  currentInventory,
}: Props) {
  // Local state for inventory, initialize with currentInventory if available
  const [localInventory, setLocalInventory] = useState<UserInventory | null>(
    currentInventory ?? null
  );
  const [loadingInventory, setLoadingInventory] = useState(false);
  const insets = useSafeAreaInsets();
  const nativeHeaderHeight = (Platform.OS === 'ios' ? 44 : 56) + insets.top;

  const [page, setPage] = useState('first');
  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchResultType>({
    recipes: [],
    ingredients: [],
  });
  const [foodToAdd, setFoodToAdd] = useState<ItemsToAdd>({});

  // Fetch inventory if missing and modal just became visible
  useEffect(() => {
    if (!visible) return; // only fetch on modal open
    if (localInventory !== null) return; // already have it

    if (!userId) {
      alert('User ID missing, cannot load inventory');
      return;
    }

    const fetchInventory = async () => {
      setLoadingInventory(true);
      const fetched = await fetchUserInventory(userId);
      setLocalInventory(fetched);
      setLoadingInventory(false);
    };

    fetchInventory();
  }, [visible, localInventory, userId]);

  const reset = () => {
    setPage('first');
    setSearch('');
    setSearchResult({ recipes: [], ingredients: [] });
    setFoodToAdd({});
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert('Error: Please Contact Tony');
      return;
    }

    if (!localInventory) {
      alert('Inventory not loaded yet');
      return;
    }

    // Update inventory by merging new items to add
    const updatedInventory: UserInventory = {
      ...localInventory,
      ...foodToAdd, // or merge logic depending on your data shape
    };

    const success = await updateUserInventory(updatedInventory, userId);
    if (success) {
      onConfirm(updatedInventory);
      reset();
      onClose();
      setLocalInventory(null); // clear local inventory on close, optionally
    } else {
      alert('Failed to update inventory');
    }
  };

  // Render loading spinner if inventory loading
  if (loadingInventory) {
    return (
      <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" />
          <Text>Loading inventory...</Text>
        </View>
      </Modal>
    );
  }

  // Then your renderHeader(), addIngredient, addRecipe, renderPage remain mostly unchanged,
  // just replace currentInventory references with localInventory.

  const renderHeader = () => {
    if (page == 'first') {
      return (
        <>
          <Pressable
            onPress={() => {
              onClose();
              reset();
              setLocalInventory(null);
            }}
            className="px-4 pb-3">
            <Feather name="x" size={24} color="black" />
          </Pressable>
          <Text className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-3 text-lg font-semibold">
            Add to Inventory
          </Text>
          <Pressable onPress={() => setPage('review')} className="px-4 pb-3">
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
          <Pressable onPress={handleSubmit} className="px-4 pb-3">
            <Feather name="check" size={24} color="black" />
          </Pressable>
        </>
      );
    }
  };

  const handleSearch = async () => {
    const ingredientData = (await fetchIngredientsByName(search)) ?? [];
    const recipeData = (await fetchRecipesByName(search)) ?? [];

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
    setSearchResult({ recipes: [], ingredients: [] });
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
    setSearchResult({ recipes: [], ingredients: [] });
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
                inventory={localInventory ?? {}}
              />
            )}
          />
          <FlatList
            data={searchResult.recipes}
            renderItem={({ item }) => (
              <RecipeAddToInventoryItem
                recipe={item}
                add={addRecipe}
                inventory={localInventory ?? {}}
              />
            )}
          />
        </View>
      );
    } else {
      return (
        <View className="p-4">
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
            style={{
              paddingTop: insets.top,
              height: nativeHeaderHeight,
            }}>
            {renderHeader()}
          </View>
          {renderPage()}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
