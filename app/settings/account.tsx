import { Stack } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { supabase } from '~/utils/supabase';

export default function AccountSettings() {
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
        onPress={() => {
          supabase.auth.signOut();
          console.log('Signing out');
        }}
        className="">
        <Text className="text-4xl font-bold">Sign Out</Text>
      </Pressable>
    </View>
  );
}
