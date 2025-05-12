import { Link, Stack } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

export default function Settings() {
  const links = [
    { href: '/settings/account', label: 'Account' },
    { href: '/settings/units', label: 'Measurement Units' },
    { href: '/settings/appearance', label: 'Appearance' },
    { href: '/settings/notifications', label: 'Notifications' },
    { href: '/settings/privacy', label: 'Privacy' },
    { href: '/settings/about', label: 'About' },
  ] as const;
  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          title: 'Settings',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />
      <View className="gap-5">
        {links.map((item) => (
          <Link href={item.href} key={item.href} asChild>
            <Pressable>
              <Text className="text-4xl font-bold">{item.label}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
}
