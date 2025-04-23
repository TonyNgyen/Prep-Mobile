import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import RecipeListItem from '~/components/RecipeListItem';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserRecipes } from '~/lib/recipe';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetch = async () => {
      const recipesFetched = await fetchUserRecipes(user?.id);
      console.log(recipesFetched);
      setRecipes(recipesFetched);
    };
    fetch();
  }, []);
  return (
    <View className="p-4">
      <Stack.Screen options={{ title: 'Recipes' }} />
      <FlatList
        className=""
        data={recipes}
        renderItem={({ item }) => <RecipeListItem recipe={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
}
