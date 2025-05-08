import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function Goals() {
  return (
    <View>
      <Stack.Screen options={{ title: 'Goals' }} />
      <Text>Goals Page</Text>
    </View>
  );
}
