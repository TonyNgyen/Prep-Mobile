import { useHeaderHeight } from '@react-navigation/elements';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import AddInventoryModal from '~/components/AddInventoryModal';
import IngredientInventoryItem from '~/components/IngredientItem/IngredientInventoryItem';
import RecipeInventoryItem from '~/components/RecipeItem/RecipeInventoryItem';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserInventory } from '~/lib/inventory';
import { InventoryIngredient, InventoryRecipe, UserInventory } from '~/types';

export default function Inventory() {
  const [inventory, setInventory] = useState<UserInventory>({});
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();
  const height = useHeaderHeight();

  const handleAddInventory = (newInventory: UserInventory) => {
    setInventory(newInventory);
  };

  useEffect(() => {
    const fetch = async () => {
      const inventoryFetched = await fetchUserInventory(user?.id);
      setInventory(inventoryFetched);
    };
    fetch();
  }, []);

  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: 'Inventory',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />

      <FlatList
        data={Object.values(inventory)}
        renderItem={({ item }) => {
          if (item.type === 'ingredient') {
            return <IngredientInventoryItem ingredient={item as InventoryIngredient} />;
          } else {
            return <RecipeInventoryItem recipe={item as InventoryRecipe} />;
          }
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 120 }}
      />
      <Pressable
        onPress={() => setModalVisible(true)}
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center border-t-2 border-gray-300 bg-white p-5 pb-10">
        <Text className="text-xl font-semibold text-blue-600">Add to Inventory</Text>
      </Pressable>
      <AddInventoryModal
        userId={user?.id}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleAddInventory}
        headerHeight={height}
        currentInventory={inventory}
      />
    </View>
  );
}
