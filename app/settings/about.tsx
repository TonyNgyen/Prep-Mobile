import { Stack } from "expo-router";
import { Text, View } from 'react-native';

export default function About() {
  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: 'About',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />
      <Text>Hi</Text>
    </View>
  );
}
