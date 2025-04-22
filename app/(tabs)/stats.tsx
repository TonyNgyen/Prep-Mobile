import { Stack } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import { supabase } from '~/utils/supabase';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Stats' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/stats.tsx" title="Stats" />
        <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
