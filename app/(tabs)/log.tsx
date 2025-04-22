import { Stack } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import { supabase } from '~/utils/supabase';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Log' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/log.tsx" title="Log" />
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
