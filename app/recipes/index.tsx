import { useHeaderHeight } from '@react-navigation/elements';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import AddRecipeModal from '~/components/AddRecipeModal';
import RecipeListItem from '~/components/RecipeListItem';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserRecipes } from '~/lib/recipe';
import { Recipe } from '~/types';

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const height = useHeaderHeight();
  const [newCounter, setNewCounter] = useState(0);
  useEffect(() => {
    const fetch = async () => {
      const recipesFetched = await fetchUserRecipes(user?.id);
      setRecipes(recipesFetched);
    };
    fetch();
  }, []);

  const handleAddRecipe = (newRecipe: Recipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
  };

  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: 'Recipes' }} />
      <FlatList
        className=""
        data={recipes}
        renderItem={({ item }) => <RecipeListItem recipe={item} />}
        contentContainerStyle={{ gap: 10, paddingBottom: 120 }}
      />
      <Pressable
        onPress={() => setModalVisible(true)}
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center border-t-2 border-gray-300 bg-white p-5 pb-10">
        <Text className="text-xl font-semibold text-blue-600">Add a Recipe</Text>
      </Pressable>
      <AddRecipeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleAddRecipe}
        headerHeight={height}
        newCounter={newCounter}
        setNewCounter={setNewCounter}
      />
    </View>
  );
}
