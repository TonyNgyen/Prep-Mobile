import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '~/utils/supabase';
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen options={{ title: 'Log in' }} />
      <View className="p-10 pt-20">
        <View className="mb-4 flex justify-center items-center">
          <Text className="text-3xl font-bold text-gray-900">Welcome Back 👋</Text>
          <Text className="mt-1 text-base text-gray-600">Log in to your account</Text>
        </View>

        <View className="flex-col gap-4">
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="rounded-lg border border-gray-300 p-4 bg-white"
          />

          <View className="relative">
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              className="rounded-lg border border-gray-300 p-4 pr-12 bg-white"
            />
            <TouchableOpacity
              className="absolute right-3 top-3"
              onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="gray" />
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity onPress={() => alert('TODO: Add forgot password flow')}>
            <Text className="text-right text-sm text-blue-600">Forgot password?</Text>
          </TouchableOpacity> */}

          <Pressable
            className="mt-4 items-center justify-center rounded-lg bg-gray-800 py-3"
            onPress={signInWithEmail}
            disabled={loading}>
            <Text className="text-base font-semibold text-white">
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </Pressable>

          <View className="flex-row justify-center pt-6">
            <Text className="text-sm text-gray-500">Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text className="ml-1 text-sm font-medium text-gray-800">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
