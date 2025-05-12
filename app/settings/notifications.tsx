import { Stack } from "expo-router";
import { Text, View } from 'react-native';

export default function NotificationsSettings() {
  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: 'Notifications Settings',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />
      <Text>Hi</Text>
    </View>
  );
}
