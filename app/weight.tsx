import { Stack } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { setUserWeightHistory } from '~/lib/weight';
import { useAuth } from '~/contexts/AuthProvider';

export default function Weight() {
  const { user } = useAuth();
  const userId = user?.id;
  const [formData, setFormData] = useState({
    day: '1',
    month: '1',
    year: String(new Date().getFullYear()),
    weight: '0',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const day = parseInt(formData.day);
    const month = parseInt(formData.month);
    const year = parseInt(formData.year);
    const weight = parseFloat(formData.weight);

    const errors: { [key: string]: string } = {};
    const currentDate = new Date();
    const selectedDate = new Date(year, month - 1, day);

    const daysInMonth = new Date(year, month, 0).getDate();

    if (isNaN(year) || year < 1900 || year > currentDate.getFullYear()) {
      errors.year = 'Enter a valid year';
    }
    if (isNaN(month) || month < 1 || month > 12) {
      errors.month = 'Enter a valid month (1–12)';
    }
    if (isNaN(day) || day < 1 || day > daysInMonth) {
      errors.day = `Enter a valid day (1–${daysInMonth})`;
    }
    if (selectedDate > currentDate) {
      errors.day = 'Date cannot be in the future';
    }
    if (isNaN(weight) || weight <= 0) {
      errors.weight = 'Weight must be greater than 0';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formattedDate = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`;
    const weight = parseFloat(formData.weight);

    try {
      await setUserWeightHistory(formattedDate, weight, userId);
      Alert.alert('Success', 'Weight history updated');
      router.push('/');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update weight history');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <Stack.Screen
        options={{
          title: 'Weight',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />
      <ScrollView className="p-4" keyboardShouldPersistTaps="handled">
        <View className="rounded-2xl bg-white p-6">
          <Text className="mb-4 text-lg font-semibold text-gray-800">Add Weight Entry</Text>

          <Text className="mb-1 text-sm font-medium text-gray-600">Date</Text>
          <View className="mb-2 flex-row gap-3">
            {['day', 'month', 'year'].map((field, idx) => (
              <View key={idx} className="flex-1">
                <Text className="mb-1 text-xs text-gray-500">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Text>
                <TextInput
                  keyboardType="number-pad"
                  value={formData[field as keyof typeof formData]}
                  onChangeText={(text) => handleChange(field, text)}
                  placeholder={field === 'year' ? 'YYYY' : field === 'month' ? 'MM' : 'DD'}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800"
                />
                {errors[field] && (
                  <Text className="mt-1 text-xs text-red-500">{errors[field]}</Text>
                )}
              </View>
            ))}
          </View>

          <Text className="mb-1 mt-2 text-sm font-medium text-gray-600">Weight (kg)</Text>
          <TextInput
            keyboardType="decimal-pad"
            value={formData.weight}
            onChangeText={(text) => handleChange('weight', text)}
            placeholder="e.g. 70.5"
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800"
          />
          {errors.weight && <Text className="mt-1 text-xs text-red-500">{errors.weight}</Text>}

          <TouchableOpacity
            onPress={handleSubmit}
            className="mt-6 items-center rounded-xl bg-gray-800 py-4 shadow-sm">
            <Text className="font-semibold text-white">Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
