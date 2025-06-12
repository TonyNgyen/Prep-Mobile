import { Stack } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { supabase } from '~/utils/supabase';
import { useRouter } from 'expo-router';

export default function AccountSettings() {
  const router = useRouter();
  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: 'Account Settings',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />
      <Pressable
        onPress={async () => {
          await supabase.auth.signOut();
          router.replace('/(auth)/login');
        }}>
        <Text className="text-4xl font-bold">Sign Out</Text>
      </Pressable>
    </View>
  );
}
