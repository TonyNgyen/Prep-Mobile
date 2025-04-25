import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import { supabase } from '~/utils/supabase';
import { useRouter } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import { useAuth } from '~/contexts/AuthProvider';

type AddIngredientModalProps = {
  visible: boolean;
  onClose: () => void;
  headerHeight: number;
};

type FormDataType = {
  name: string;
  servingSize: number | null;
  servingUnit: string;
  servingsPerContainer: number | null;
  pricePerContainer: number | null;
  calories: number | null;
  protein: number | null;
  totalFat: number | null;
  saturatedFat: number | null;
  polyunsaturatedFat: number | null;
  monounsaturatedFat: number | null;
  transFat: number | null;
  cholesterol: number | null;
  sodium: number | null;
  potassium: number | null;
  totalCarbohydrates: number | null;
  dietaryFiber: number | null;
  totalSugars: number | null;
  addedSugars: number | null;
  sugarAlcohols: number | null;
  vitaminA: number | null;
  vitaminC: number | null;
  vitaminD: number | null;
  calcium: number | null;
  iron: number | null;
};

const servingUnits = ['g', 'oz', 'c', 'x'];
const extraUnits = ['g', 'mg', '%'];

export default function AddIngredientModal({
  visible,
  onClose,
  headerHeight,
}: AddIngredientModalProps) {
  const router = useRouter();
  const [modalPage, setModalPage] = useState<'form' | 'review'>('form');
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    servingSize: null,
    servingUnit: 'g',
    servingsPerContainer: null,
    pricePerContainer: null,
    calories: null,
    protein: null,
    totalFat: null,
    saturatedFat: null,
    polyunsaturatedFat: null,
    monounsaturatedFat: null,
    transFat: null,
    cholesterol: null,
    sodium: null,
    potassium: null,
    totalCarbohydrates: null,
    dietaryFiber: null,
    totalSugars: null,
    addedSugars: null,
    sugarAlcohols: null,
    vitaminA: null,
    vitaminC: null,
    vitaminD: null,
    calcium: null,
    iron: null,
  });
  const [addingExtra, setAddingExtra] = useState(false);
  const { user } = useAuth();
  const [extraNutrition, setExtraNutrition] = useState<{
    label: string;
    unit: string;
    value: string;
  }>({ label: '', unit: 'g', value: '' });
  const [allExtras, setAllExtras] = useState<Record<string, any>>({});

  const requiredFields = ['servingsPerContainer', 'calories'];

  const handleChange = (name: keyof FormDataType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : Number(value),
    }));
  };

  // const handleSubmit = async () => {
  //   try {
  //     console.log(formData);

  // router.back();
  // onClose();
  //   } catch (error) {
  //     console.error('Submission error:', error);
  //   }
  // };

  const handleSubmit = async () => {
    const submissionData = {
      ...formData,
      extraNutrition: allExtras,
    };
    const { data, error } = await supabase.from('ingredients').insert([submissionData]).select();

    if (error) {
      console.error('Error inserting data:', error.message);
      return;
    }

    try {
      const ingredientId = data?.[0]?.id;
      const userId = user?.id;
      const { data: insertData, error: insertError } = await supabase.rpc(
        'append_ingredient_user',
        {
          userid: userId,
          ingredientid: ingredientId,
        }
      );
      if (insertError) {
        console.error('Error inserting data 2:', insertError.message);
      } else {
        router.back();
        onClose();
      }
    } catch (error) {
      console.error('Error adding ingredient to user:', error);
    }
  };

  const addExtraNutrition = () => {
    if (extraNutrition.label && extraNutrition.value) {
      const key = extraNutrition.label.toLowerCase().replace(/[^a-z0-9]/g, '');
      setAllExtras((prev) => ({
        ...prev,
        [key]: {
          key: key,
          label: extraNutrition.label,
          unit: extraNutrition.unit,
          value: Number(extraNutrition.value),
        },
      }));
      setExtraNutrition({ label: '', unit: 'g', value: '' });
      setAddingExtra(false);
    }
  };

  const renderFormField = (label: string, field: keyof FormDataType, required?: boolean) => (
    <View className="my-2 flex-row justify-between" key={label}>
      <View className="flex flex-1 justify-center">
        <Text className="text-lg"> {label}</Text>
        {required && <Text className="text-sm">(Required)</Text>}
      </View>
      <TextInput
        className="h-[35px] w-1/3 rounded border border-gray-300 p-2 text-right"
        placeholder={required ? 'Required' : 'Optional'}
        keyboardType="numeric"
        value={formData[field]?.toString() || ''}
        onChangeText={(v) => handleChange(field, v)}
      />
    </View>
  );

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-white">
          <View
            className="flex-row items-end justify-between border-b border-gray-200 px-4 pb-3"
            style={{ height: headerHeight }}>
            {modalPage == 'form' ? (
              <Pressable onPress={onClose}>
                <Text className="text-base text-blue-500">X</Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => setModalPage('form')}>
                <Text className="text-base text-blue-500">{'<'}</Text>
              </Pressable>
            )}
            {/* <Pressable onPress={onClose}>
              <Text className="text-base text-blue-500">X</Text>
            </Pressable> */}
            <Text className="text-lg font-semibold">
              {modalPage === 'form' ? 'Add Ingredient' : 'Review'}
            </Text>
            {modalPage == 'form' ? (
              <Pressable onPress={() => setModalPage('review')}>
                <Text className="text-base text-blue-500">{'>'}</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  console.log(formData);
                  console.log(allExtras);
                }}>
                <Text className="text-base text-blue-500">Submit</Text>
              </Pressable>
            )}
            {/* <Pressable
              onPress={() => setModalPage((prev) => (prev === 'form' ? 'review' : 'form'))}>
              <Text className="text-base text-blue-500">
                {modalPage === 'form' ? 'Next' : 'Submit'}
              </Text>
            </Pressable> */}
          </View>

          <ScrollView className="flex-1 p-4">
            {modalPage === 'form' ? (
              <>
                <Text className="mb-1 text-lg">Ingredient Name</Text>
                <TextInput
                  placeholder="Ingredient Name"
                  value={formData.name}
                  onChangeText={(v) => setFormData((prev) => ({ ...prev, name: v }))}
                  className="mb-2 h-[35px] rounded border border-gray-300 p-2"
                />
                <Text className="mb-1 text-lg">Serving Size</Text>
                <View className="mb-2 flex-row">
                  <View className="w-1/2 pr-1">
                    <TextInput
                      placeholder="Serving Size"
                      className="h-[35px] rounded-l border border-gray-300 p-2"
                      keyboardType="numeric"
                      value={formData.servingSize?.toString() || ''}
                      onChangeText={(v) => handleChange('servingSize', v)}
                    />
                  </View>
                  <View className="w-1/2 pl-1">
                    <Dropdown
                      style={{
                        height: 35,
                        borderColor: '#d1d5db',
                        borderWidth: 1,
                        borderRadius: 8,
                        paddingHorizontal: 8,
                      }}
                      placeholderStyle={{ color: 'gray' }}
                      selectedTextStyle={{ color: 'black' }}
                      data={servingUnits.map((unit) => ({ label: unit, value: unit }))}
                      labelField="label"
                      valueField="value"
                      value={formData.servingUnit}
                      placeholder="Unit"
                      onChange={(item) => {
                        setFormData((prev) => ({ ...prev, servingUnit: item.value }));
                      }}
                    />
                  </View>
                </View>

                {[
                  ['Servings Per Container', 'servingsPerContainer', true],
                  ['Price Per Container', 'pricePerContainer'],
                  ['Calories', 'calories', true],
                  ['Total Fat (g)', 'totalFat'],
                  ['Saturated Fat (g)', 'saturatedFat'],
                  ['Polyunsaturated Fat (g)', 'polyunsaturatedFat'],
                  ['Monounsaturated Fat (g)', 'monounsaturatedFat'],
                  ['Trans Fat (g)', 'transFat'],
                  ['Cholesterol (mg)', 'cholesterol'],
                  ['Sodium (mg)', 'sodium'],
                  ['Potassium (mg)', 'potassium'],
                  ['Total Carbohydrates (g)', 'totalCarbohydrates'],
                  ['Dietary Fiber (g)', 'dietaryFiber'],
                  ['Total Sugars (g)', 'totalSugars'],
                  ['Added Sugars (g)', 'addedSugars'],
                  ['Sugar Alcohols (g)', 'sugarAlcohols'],
                  ['Protein (g)', 'protein'],
                  ['Vitamin A (%)', 'vitaminA'],
                  ['Vitamin C (%)', 'vitaminC'],
                  ['Vitamin D (%)', 'vitaminD'],
                  ['Calcium (%)', 'calcium'],
                  ['Iron (%)', 'iron'],
                ].map(([label, field, required]) =>
                  renderFormField(label as string, field as keyof FormDataType, required)
                )}

                {/* <FlatList
                  className=""
                  data={[
                    ['Servings Per Container', 'servingsPerContainer', true],
                    ['Price Per Container', 'pricePerContainer'],
                    ['Calories', 'calories', true],
                    ['Total Fat (g)', 'totalFat'],
                    ['Saturated Fat (g)', 'saturatedFat'],
                    ['Polyunsaturated Fat (g)', 'polyunsaturatedFat'],
                    ['Monounsaturated Fat (g)', 'monounsaturatedFat'],
                    ['Trans Fat (g)', 'transFat'],
                    ['Cholesterol (mg)', 'cholesterol'],
                    ['Sodium (mg)', 'sodium'],
                    ['Potassium (mg)', 'potassium'],
                    ['Total Carbohydrates (g)', 'totalCarbohydrates'],
                    ['Dietary Fiber (g)', 'dietaryFiber'],
                    ['Total Sugars (g)', 'totalSugars'],
                    ['Added Sugars (g)', 'addedSugars'],
                    ['Sugar Alcohols (g)', 'sugarAlcohols'],
                    ['Protein (g)', 'protein'],
                    ['Vitamin A (%)', 'vitaminA'],
                    ['Vitamin C (%)', 'vitaminC'],
                    ['Vitamin D (%)', 'vitaminD'],
                    ['Calcium (%)', 'calcium'],
                    ['Iron (%)', 'iron'],
                  ]}
                  renderItem={({ item }) => <Text>{item[0]}</Text>}
                  contentContainerStyle={{ gap: 10 }}
                /> */}

                {Object.entries(allExtras).map(([key, nutrition]) => (
                  <View className="my-2 flex-row items-center justify-between" key={key}>
                    <Text className="text-md flex-1">
                      {nutrition.label} ({nutrition.unit})
                    </Text>
                    <TextInput
                      className="h-[35px] w-1/3 rounded border border-gray-300 p-2 text-right"
                      placeholder="Optional"
                      keyboardType="numeric"
                      value={nutrition.value?.toString() || ''}
                      onChangeText={(v) => {
                        setAllExtras((prev) => ({
                          ...prev,
                          [key]: {
                            ...prev[key],
                            value: v === '' ? null : Number(v),
                          },
                        }));
                      }}
                    />
                  </View>
                ))}

                {addingExtra && (
                  <View className="my-2 flex-row items-center">
                    <TextInput
                      placeholder="Nutrition Label"
                      className="mr-2 flex-1 rounded border border-gray-300 p-2"
                      value={extraNutrition.label}
                      onChangeText={(v) => setExtraNutrition((prev) => ({ ...prev, label: v }))}
                    />
                    <TextInput
                      placeholder="Value"
                      className="ml-2 w-20 rounded border border-gray-300 p-2"
                      keyboardType="numeric"
                      value={extraNutrition.value}
                      onChangeText={(v) => setExtraNutrition((prev) => ({ ...prev, value: v }))}
                    />
                  </View>
                )}

                <Pressable
                  className="mt-4 mb-14 rounded bg-blue-500 p-3"
                  onPress={addingExtra ? addExtraNutrition : () => setAddingExtra(true)}>
                  <Text className="text-center font-semibold text-white">
                    {addingExtra ? 'Add Nutrition' : 'Add Extra Nutrition'}
                  </Text>
                </Pressable>
              </>
            ) : (
              <View>
                <Text className="mb-4 text-lg font-semibold">Review Ingredient</Text>
                {/* Render review content here */}
              </View>
            )}
          </ScrollView>

          {modalPage === 'review' && (
            <Pressable className="m-4 rounded bg-green-500 p-4" onPress={handleSubmit}>
              <Text className="text-center font-semibold text-white">Confirm</Text>
            </Pressable>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
  },
});
