import { Stack } from "expo-router";
import { View, Text } from 'react-native';

export default function Weight() {
  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: 'Weight',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />
      <Text>Weight Page</Text>
    </View>
  );
}
