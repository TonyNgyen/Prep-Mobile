import { useEffect, useState } from 'react';
import { Modal, Text, View, Pressable } from 'react-native';
import { Ingredient, NutritionFacts, Recipe } from '~/types';

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
  const [ingredientIdList, setIngredientIdList] = useState<Object>({});
  const [name, setName] = useState<string>('');
  const [numberOfServings, setNumberOfServings] = useState<number>(0);
  const [servingSize, setServingSize] = useState<number>(0);
  const [servingUnit, setServingUnit] = useState<string>('g');
  const [page, setPage] = useState('first');
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

  const renderHeader = () => {
    if (page == 'first') {
      return (
        <>
          <Pressable onPress={onClose}>
            <Text className="text-base text-blue-500">X</Text>
          </Pressable>
          <Text className="text-lg font-semibold">Add Recipe</Text>
          <Pressable onPress={() => setPage('ingredients')}>
            <Text className="text-base text-blue-500">{'>'}</Text>
          </Pressable>
        </>
      );
    } else if (page == 'ingredients') {
      return (
        <>
          <Pressable onPress={() => setPage('first')}>
            <Text className="text-base text-blue-500">{'<'}</Text>
          </Pressable>
          <Text className="text-lg font-semibold">Add Recipe</Text>
          <Pressable onPress={() => setPage('review')}>
            <Text className="text-base text-blue-500">{'>'}</Text>
          </Pressable>
        </>
      );
    } else {
      return (
        <>
          <Pressable onPress={() => setPage('ingredients')} className="justify-self-start">
            <Text className="bg-purple-200 text-base text-blue-500">{'<'}</Text>
          </Pressable>
          <Text className="justify-self-center bg-green-200 text-lg font-semibold">Add Recipe</Text>
          <Pressable onPress={() => handleSubmit()} className="justify-self-end">
            <Text className="bg-blue-200 text-base text-blue-500">{'Submit'}</Text>
          </Pressable>
        </>
      );
    }
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

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <View
        className="flex w-full flex-row items-end border-b border-gray-200 bg-red-200 px-4 pb-3"
        style={{ height: headerHeight }}>
        {/* <Pressable onPress={onClose}>
          <Text className="text-base text-blue-500">X</Text>
        </Pressable>
        <Text className="text-lg font-semibold">Add Recipe</Text>
        <Pressable onPress={() => console.log('Implement later')}>
          <Text className="text-base text-blue-500">Submit</Text>
        </Pressable> */}
        {renderHeader()}
      </View>
    </Modal>
  );
}
