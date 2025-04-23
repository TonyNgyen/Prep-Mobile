import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import IngredientListItem from '~/components/IngredientListItem';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserIngredients } from '~/lib/ingredient';
import { useHeaderHeight } from '@react-navigation/elements';
import AddIngredientModal from '~/components/AddIngredientModal';

export default function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
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

  const handleAddIngredient = (name: string) => {
    setIngredients((prev) => [...prev, { id: Date.now().toString(), name }]);
  };

  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: 'Ingredients' }} />
      <FlatList
        data={ingredients}
        renderItem={({ item }) => <IngredientListItem ingredient={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
      />

      <Pressable
        onPress={() => setModalVisible(true)}
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center border-t-2 border-gray-300 bg-white p-5 pb-10">
        <Text className="text-xl font-semibold text-blue-600">Add Ingredient</Text>
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
