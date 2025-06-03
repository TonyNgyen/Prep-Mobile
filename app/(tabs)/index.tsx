import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import LogFoodForm from '~/components/AddLogModal/container';
import { useAuth } from '~/contexts/AuthProvider';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HomeNutritionRings from '~/components/HomeNutritionRings';
import { WeightChart } from '~/components/WeightChart';
import SelfUserProfilePicture from '~/components/SelfUserProfilePicture';

export default function Home() {
  const [logModalVisible, setLogModalVisible] = useState(false);
  const { profile } = useAuth();
  const router = useRouter();
  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: 'Home' }} />

      <View className="mb-6 flex-row items-center justify-between"> 
        <Text className="text-4xl font-bold">Hello {profile?.firstName}</Text>
        <Pressable onPress={() => router.push('/account')}>
          <SelfUserProfilePicture />
        </Pressable>
      </View>
      <View className="flex gap-4">
        <Pressable onPress={() => setLogModalVisible(true)} className="rounded-md bg-gray-800 p-5">
          <Text className="text-2xl font-bold text-white">Log Food</Text>
        </Pressable>
        <HomeNutritionRings />
        <WeightChart />
      </View>

      <LogFoodForm
        visible={logModalVisible}
        onClose={() => setLogModalVisible(false)}
        onConfirm={() => {
          setLogModalVisible(false);
        }}
        dateInput={new Date()}
        mealInput={undefined}
      />
    </View>
  );
}
