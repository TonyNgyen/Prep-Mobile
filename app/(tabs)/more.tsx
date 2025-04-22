import { Link, Stack } from 'expo-router';
import { Button, StyleSheet, Text, View, Pressable } from 'react-native';

export default function More() {
  const links = [
    { href: '/inventory', label: 'Inventory' },
    { href: '/recipes', label: 'Recipes' },
    { href: '/ingredients', label: 'Ingredients' },
    { href: '/account/goals', label: 'Goals' },
    { href: '/weight', label: 'Weight' },
    { href: '/settings', label: 'Settings' },
  ] as const;
  return (
    <>
      <Stack.Screen options={{ title: 'More' }} />
      <View className='gap-5 p-5'>
        {links.map((item) => (
          <Link href={item.href} key={item.href} asChild>
            <Pressable>
              <Text className='text-4xl font-bold'>{item.label}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </>
  );
}
