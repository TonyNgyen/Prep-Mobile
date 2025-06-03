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
      <Pressable onPress={() => supabase.auth.signOut()}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}
