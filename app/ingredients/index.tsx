import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserIngredients } from '~/lib/ingredient';
import { useHeaderHeight } from '@react-navigation/elements';
import AddIngredientModal from '~/components/AddIngredientModal';
import { Ingredient } from '~/types';
import IngredientListItem from '~/components/IngredientItem/IngredientListItem';

export default function Ingredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();
  const height = useHeaderHeight();

  useEffect(() => {
    const fetch = async () => {
      const ingredientsFetched = await fetchUserIngredients(user?.id);
      setIngredients(ingredientsFetched);
    };
    fetch();
  }, []);

  const handleAddIngredient = (newIngredient: Ingredient) => {
    setIngredients((prev) => [...prev, newIngredient]);
  };

  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: 'Ingredients',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />
      <FlatList
        data={ingredients}
        renderItem={({ item }) => <IngredientListItem ingredient={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 120 }}
      />

      <Pressable
        onPress={() => setModalVisible(true)}
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center border-t-2 border-gray-300 bg-white p-5 pb-10">
        <Text className="text-xl font-semibold text-gray-800">Add an Ingredient</Text>
      </Pressable>

      <AddIngredientModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleAddIngredient}
        headerHeight={height}
      />
    </View>
  );
}
