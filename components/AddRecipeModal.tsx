import { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  View,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { fetchIngredientsByName } from '~/lib/ingredient';
import { Ingredient, NutritionFacts, Recipe } from '~/types';
import IngredientAddToRecipeItem from './IngredientItem/IngredientAddToRecipeItem';
import IngredientAddedToRecipeItem from './IngredientItem/IngredientAddedToRecipeItem';

type AddRecipeModalProps = {
  visible: boolean;
  onClose: () => void;
  headerHeight: number;
  onConfirm: (recipe: Recipe) => void;
};

export default function AddRecipeModal({
  visible,
  onClose,
  headerHeight,
  onConfirm,
}: AddRecipeModalProps) {
  const SERVING_UNITS = [
    ['g', 'Grams (g)'],
    ['oz', 'Ounces (oz)'],
    ['c', 'Cups (c)'],
    ['x', 'Serving (x)'],
  ];
  const [ingredientList, setIngredientList] = useState<
    Record<
      string,
      {
        ingredient: Ingredient;
        numberOfServings: number;
        servingSize: number | null;
      }
    >
  >({});
  const [ingredientInformation, setIngredientInformation] = useState<Object>({});
  const [name, setName] = useState<string>('');
  const [numberOfServings, setNumberOfServings] = useState<string>('');
  const [servingSize, setServingSize] = useState<string>('');
  const [servingUnit, setServingUnit] = useState<string>('g');
  const [page, setPage] = useState('first');
  const [search, setSearch] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResultList, setSearchResultList] = useState([]);
  const [recipeNutrition, setRecipeNutrition] = useState<NutritionFacts>({
    calories: 0,
    protein: 0,
    totalFat: 0,
    saturatedFat: 0,
    polyunsaturatedFat: 0,
    monounsaturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    potassium: 0,
    totalCarbohydrates: 0,
    dietaryFiber: 0,
    totalSugars: 0,
    addedSugars: 0,
    sugarAlcohols: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    calcium: 0,
    iron: 0,
    extraNutrition: {},
  });

  const addIngredient = (index: number, numberOfServings: number, servingSize: number | null) => {
    if (searchResultList == null) return;
    setIngredientList({
      ...ingredientList,
      [searchResultList[index].id]: {
        ingredient: searchResultList[index],
        numberOfServings: numberOfServings,
        servingSize: servingSize,
      },
    });

    setIngredientInformation({
      ...ingredientInformation,
      [searchResultList[index].id]: {
        numberOfServings: numberOfServings,
        servingSize: servingSize,
      },
    });
  };

  const handleSearch = async () => {
    const ingredients = await fetchIngredientsByName(search);
    setSearchResultList(ingredients);
  };

  const renderHeader = () => {
    if (page == 'first') {
      return (
        <>
          <Pressable onPress={onClose} className="px-4 pb-3">
            <Text className="text-base text-blue-500">X</Text>
          </Pressable>
          <Text className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-3 text-lg font-semibold">
            Add Recipe
          </Text>
          <Pressable onPress={() => setPage('ingredients')} className="px-4 pb-3">
            <Text className="text-base text-blue-500">{'>'}</Text>
          </Pressable>
        </>
      );
    } else if (page == 'ingredients') {
      return (
        <>
          <Pressable onPress={() => setPage('first')} className="px-4 pb-3">
            <Text className="text-base text-blue-500">{'<'}</Text>
          </Pressable>
          <Text className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-3 text-lg font-semibold">
            Add Recipe
          </Text>
          <Pressable onPress={() => setPage('review')} className="px-4 pb-3">
            <Text className="text-base text-blue-500">{'>'}</Text>
          </Pressable>
        </>
      );
    } else {
      return (
        <>
          <Pressable onPress={() => setPage('ingredients')} className="px-4 pb-3">
            <Text className="text-base text-blue-500">{'<'}</Text>
          </Pressable>
          <Text className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-3 text-lg font-semibold">
            Add Recipe
          </Text>
          <Pressable onPress={() => handleSubmit()} className="px-4 pb-3">
            <Text className="text-base text-blue-500">{'Submit'}</Text>
          </Pressable>
        </>
      );
    }
  };

  const renderSearch = () => {
    if (searching) {
      return (
        <View className="mt-4">
          <View className="flex-row">
            <TextInput
              placeholder="Ingredient Name"
              value={search}
              onChangeText={(v) => setSearch(v)}
              className="mb-2 h-[40px] flex-1 rounded border border-gray-300 p-2 placeholder:text-gray-300"
            />
            <Pressable
              className="flex h-[40px] items-center justify-center rounded-r bg-gray-800 px-5"
              onPress={handleSearch}>
              <Text className="text-xl font-semibold text-white">Search</Text>
            </Pressable>
          </View>
          <FlatList
            data={searchResultList}
            renderItem={({ item, index }) => (
              <IngredientAddToRecipeItem
                key={index}
                ingredient={item}
                index={index}
                addIngredient={addIngredient}
                setSearching={setSearching}
              />
            )}
          />
        </View>
      );
    } else {
      return (
        <View className="mt-4">
          <FlatList
            data={Object.entries(ingredientList)}
            renderItem={({ item, index }) => (
              <IngredientAddedToRecipeItem
                ingredient={item[1].ingredient}
                servingSize={item[1].servingSize}
                numberOfServings={item[1].numberOfServings}
                key={index}
              />
            )}
          />
        </View>
      );
    }
  };

  const renderPage = () => {
    if (page == 'first') {
      return (
        <View className="gap-y-2 p-4">
          <View>
            <Text className="mb-1 text-lg">
              Recipe Name <Text className="text-sm"> (Required)</Text>
            </Text>
            <TextInput
              placeholder="Ingredient Name"
              value={name}
              onChangeText={(v) => setName(v)}
              className="mb-2 h-[40px] rounded border border-gray-300 p-2 placeholder:text-gray-300"
            />
          </View>

          <View className="flex-row  justify-between ">
            <Text className="mb-1 text-lg">Servings</Text>
            <TextInput
              placeholder="Ingredient Name"
              value={numberOfServings}
              keyboardType="numeric"
              onChangeText={(v) => setNumberOfServings(v)}
              className="mb-2 h-[40px] w-5/12 rounded border border-gray-300 p-2 placeholder:text-gray-300"
            />
          </View>
          <View className="flex-row  justify-between ">
            <Text className="mb-1 text-lg">Serving Size</Text>
            <TextInput
              placeholder="Ingredient Name"
              value={servingSize}
              onChangeText={(v) => setServingSize(v)}
              keyboardType="numeric"
              className="mb-2 h-[40px] w-5/12 rounded border border-gray-300 p-2 placeholder:text-gray-300"
            />
          </View>
          <View className="flex-row  justify-between ">
            <Text className="mb-1 text-lg">Serving Unit</Text>
            <View className="w-5/12">
              <Dropdown
                style={{
                  height: 35,
                  borderColor: '#d1d5db',
                  borderWidth: 1,
                  borderRadius: 4,
                  paddingHorizontal: 8,
                }}
                placeholderStyle={{ color: 'gray' }}
                selectedTextStyle={{ color: 'black' }}
                data={SERVING_UNITS.map((unit) => ({ label: unit[1], value: unit[0] }))}
                labelField="label"
                valueField="value"
                value={servingUnit}
                placeholder="Unit"
                onChange={(item) => {
                  setServingUnit(item);
                }}
              />
            </View>
          </View>
        </View>
      );
    } else if (page == 'ingredients') {
      return (
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-3xl font-bold">Ingredients</Text>
            <Pressable
              onPress={() => {
                setSearching(!searching);
                setSearch('');
              }}
              className="w-4/12">
              {searching ? (
                <Text className="rounded bg-red-800 px-4 py-3 text-center text-xl font-semibold text-white">
                  Cancel
                </Text>
              ) : (
                <Text className="rounded bg-gray-800 px-4 py-3 text-center text-xl font-semibold text-white">
                  Add
                </Text>
              )}
            </Pressable>
          </View>
          <View>{renderSearch()}</View>
        </View>
      );
    } else {
      return (
        <View className="p-4">
          <Text>Review</Text>
        </View>
      );
    }
  };

  const handleSubmit = async () => {
    //   if (
    //     await addRecipe(
    //       name,
    //       recipeNutrition,
    //       ingredientIdList,
    //       numberOfServings,
    //       servingSize,
    //       servingUnit
    //     )
    //   ) {
    //     router.push('/');
    //   }
    console.log('Implement later');
  };

  useEffect(() => {
    const sumNutrition = () => {
      const total = Object.values(ingredientList).reduce(
        (acc, { ingredient, numberOfServings, servingSize }) => {
          for (const key of Object.keys(acc)) {
            if (key === 'extraNutrition') continue;

            if (key in acc && typeof acc[key as keyof typeof acc] === 'number') {
              const typedKey = key as keyof Omit<typeof acc, 'extraNutrition'>;
              acc[typedKey] +=
                ((ingredient[typedKey] ?? 0) * numberOfServings * (servingSize ?? 0)) /
                (ingredient.servingSize ?? 1);
            }
          }

          for (const [extraKey, extraValue] of Object.entries(ingredient.extraNutrition || {})) {
            if (!acc.extraNutrition[extraKey]) {
              acc.extraNutrition[extraKey] = { ...extraValue, value: 0 };
            }
            acc.extraNutrition[extraKey].value +=
              ((extraValue.value ?? 0) * numberOfServings * (servingSize ?? 0)) /
              (ingredient.servingSize ?? 1);
          }

          return acc;
        },
        {
          calories: 0,
          protein: 0,
          totalFat: 0,
          saturatedFat: 0,
          polyunsaturatedFat: 0,
          monounsaturatedFat: 0,
          transFat: 0,
          cholesterol: 0,
          sodium: 0,
          potassium: 0,
          totalCarbohydrates: 0,
          dietaryFiber: 0,
          totalSugars: 0,
          addedSugars: 0,
          sugarAlcohols: 0,
          vitaminA: 0,
          vitaminC: 0,
          vitaminD: 0,
          calcium: 0,
          iron: 0,
          extraNutrition: {} as Record<
            string,
            {
              key: string;
              label: string | null;
              unit: string | null;
              value: number;
            }
          >,
        }
      );

      setRecipeNutrition(total);
    };

    sumNutrition();
  }, [ingredientList]);

  useEffect(() => {
    setSearchResultList([]);
    setSearch('');
  }, [searching]);

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <View
            className="relative flex w-full flex-row items-end justify-between border-b border-gray-200"
            style={{ height: headerHeight }}>
            {renderHeader()}
          </View>
          {renderPage()}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
