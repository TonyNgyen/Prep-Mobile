import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import LogFoodForm from '~/components/AddLogModal/container';
import { useAuth } from '~/contexts/AuthProvider';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ProgressRingExample from '~/components/progressRing';
import ProgressRing from '~/components/progressRing';
import HomeNutritionRings from '~/components/HomeNutritionRings';

export default function Home() {
  const [logModalVisible, setLogModalVisible] = useState(false);
  const { user, profile } = useAuth();
  console.log(profile);
  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: 'Home' }} />
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-4xl font-bold">Hello {profile?.firstName}</Text>
        <MaterialIcons name="account-circle" size={40} color="#1f2937" className="" />
      </View>
      <View className="flex gap-4">
        <Pressable onPress={() => setLogModalVisible(true)} className="rounded-md bg-gray-800 p-5">
          <Text className="text-2xl font-bold text-white">Log Food</Text>
        </Pressable>
        <View>
          <HomeNutritionRings />
        </View>
      </View>

      <LogFoodForm
        visible={logModalVisible}
        onClose={() => setLogModalVisible(false)}
        onConfirm={() => {
          setLogModalVisible(false);
        }}
        date={new Date().toLocaleDateString('en-CA')}
      />
    </View>
  );
}
