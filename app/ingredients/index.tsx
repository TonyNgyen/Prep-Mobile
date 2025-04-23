import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import IngredientListItem from '~/components/IngredientListItem';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserIngredients } from '~/lib/ingredient';

export default function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetch = async () => {
      const ingredientsFetched = await fetchUserIngredients(user?.id);
      setIngredients(ingredientsFetched);
    };
    fetch();
  }, []);
  return (
    <View className="p-4">
      <Stack.Screen options={{ title: 'Ingredients' }} />
      <FlatList
        className=""
        data={ingredients}
        renderItem={({ item }) => <IngredientListItem ingredient={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
}
