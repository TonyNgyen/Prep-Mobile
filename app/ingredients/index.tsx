import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import IngredientListItem from '~/components/IngredientListItem';
import { useAuth } from '~/contexts/AuthProvider';
import { fetchUserIngredients } from '~/lib/ingredient';
import { useHeaderHeight } from '@react-navigation/elements';

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

  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: 'Ingredients' }} />
      <FlatList
        data={ingredients}
        renderItem={({ item }) => <IngredientListItem ingredient={item} />}
        contentContainerStyle={{ gap: 10 }}
      />

      <Pressable
        onPress={() => setModalVisible(true)}
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center border-t-2 border-gray-300 bg-white p-5 pb-10">
        <Text className="text-xl font-semibold text-blue-600">Add Ingredient</Text>
      </Pressable>

      {/* Full-screen Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-white">
            {/* Custom Stack-style Header */}
            <View
              className="flex-row items-center justify-between border-b border-gray-200 px-4"
              style={{ height: height }}>
              <Text className="text-lg font-semibold">Add Ingredient</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text className="text-base text-blue-500">Close</Text>
              </Pressable>
            </View>

            {/* Modal Content */}
            <View className="flex-1 p-4">
              <TextInput
                placeholder="Ingredient Name"
                className="mb-4 rounded-lg border border-gray-300 p-3"
              />
              {/* Add more inputs here */}
              <Pressable className="mt-4 rounded-lg bg-blue-500 p-4">
                <Text className="text-center font-semibold text-white">Save</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
