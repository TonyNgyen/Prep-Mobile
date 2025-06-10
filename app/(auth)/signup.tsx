import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { supabase } from '~/utils/supabase';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignUp = async () => {
    const { email, password, confirmPassword, username, firstName, lastName } = form;

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match.');
      return;
    }

    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    if (session && session.user) {
      const { error: insertError } = await supabase.from('users').insert([
        {
          uid: session.user.id,
          email,
          username,
          firstName,
          lastName,
        },
      ]);

      if (insertError) {
        console.error('Insert error:', insertError.message);
      }
    }

    Alert.alert('Check your email for verification!');
    setLoading(false);
  };

  const isFormValid =
    form.username &&
    form.firstName &&
    form.lastName &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword;

  return (
    <ScrollView className="flex-1 p-10 pt-20">
      <Stack.Screen
        options={{
          title: 'Create Account',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />
      <View className="flex items-center justify-center">
        <Text className="text-3xl font-bold text-gray-900">Create Your Account</Text>
        <Text className="mt-1  text-gray-600">Join us and start tracking today</Text>
      </View>
      {[
        { label: 'Username', field: 'username' },
        { label: 'First Name', field: 'firstName' },
        { label: 'Last Name', field: 'lastName' },
        { label: 'Email', field: 'email', keyboardType: 'email-address' },
      ].map(({ label, field, keyboardType }) => (
        <View key={field} className="mb-4">
          <Text className="mb-1  font-medium text-gray-700">{label}</Text>
          <TextInput
            className="rounded-lg border border-gray-300 bg-white p-3 "
            autoCapitalize="none"
            keyboardType={keyboardType || 'default'}
            value={form[field as keyof typeof form]}
            onChangeText={(value) => handleChange(field as keyof typeof form, value)}
          />
        </View>
      ))}

      {['password', 'confirmPassword'].map((field, i) => (
        <View key={field} className="mb-4">
          <Text className="mb-1  font-medium text-gray-700">
            {i === 0 ? 'Password' : 'Confirm Password'}
          </Text>
          <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-3">
            <TextInput
              className="flex-1 py-3 "
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={form[field as keyof typeof form]}
              onChangeText={(value) => handleChange(field as keyof typeof form, value)}
            />
            <Pressable onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="gray" />
            </Pressable>
          </View>
        </View>
      ))}

      <Pressable
        onPress={handleSignUp}
        disabled={!isFormValid || loading}
        className={`mt-6 rounded-lg p-4 ${isFormValid ? 'bg-gray-800' : 'bg-gray-300'}`}>
        <Text className="text-center text-lg font-semibold text-white">
          {loading ? 'Signing up...' : 'Sign Up'}
        </Text>
      </Pressable>
      <View className="mt-6 flex-row justify-center">
        <Text className=" text-gray-600">Already have an account? </Text>
        <Pressable onPress={() => router.push('/login')}>
          <Text className=" font-semibold text-gray-800">Sign in</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
