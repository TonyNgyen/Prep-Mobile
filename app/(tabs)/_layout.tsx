import React, { useState, useRef, useEffect } from 'react';
import { Link, Redirect, Tabs } from 'expo-router';
import {
  View,
  Pressable,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from 'react-native';
import { HeaderButton } from '../../components/HeaderButton';
import { useAuth } from '~/contexts/AuthProvider';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ingredient, Recipe, UserInventory } from '~/types';
import AddIngredientModal from '~/components/AddIngredientModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddRecipeModal from '~/components/AddRecipeModal';
import AddInventoryModal from '~/components/AddInventoryModal';
import AddLogModal from '~/components/AddLogModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TabLayout() {
  const { isAuthenticated, user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(200)).current;

  const [ingredientModalVisible, setIngredientModalVisible] = useState(false);
  const handleAddIngredient = (newIngredient: Ingredient) => {
    return;
  };

  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [newCounter, setNewCounter] = useState(0);
  const handleAddRecipe = (newRecipe: Recipe) => {
    return;
  };

  const [inventoryModalVisible, setInventoryModalVisible] = useState(false);
  const handleAddInventory = (newInventory: UserInventory) => {
    return;
  };

  const [logModalVisible, setLogModalVisible] = useState(false);
  const handleAddLog = (newInventory: UserInventory) => {
    return;
  };

  const ACTIONS = [
    {
      key: 'log-food',
      label: 'Log Food',
      icon: <MaterialIcons name="book" size={36} color="#1F2937" />,
      onPress: () => setLogModalVisible(true),
    },
    {
      key: 'add-recipe',
      label: 'Add Recipe',
      icon: <MaterialCommunityIcons name="silverware" size={36} color="#1F2937" />,
      onPress: () => setRecipeModalVisible(true),
    },
    {
      key: 'add-ingredient',
      label: 'Add Ingredient',
      icon: <MaterialCommunityIcons name="food-drumstick" size={36} color="#1F2937" />,
      onPress: () => setIngredientModalVisible(true),
    },
    {
      key: 'add-inventory',
      label: 'Add Inventory',
      icon: <MaterialIcons name="inventory" size={36} color="#1F2937" />,
      onPress: () => setInventoryModalVisible(true),
    },
  ];

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 200,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  if (!isAuthenticated) {
    return <Redirect href={'/login'} />;
  }

  const TAB_BAR_HEIGHT = 90;

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#1F2937',
          tabBarInactiveTintColor: '#6B7280',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginBottom: 6,
          },
          tabBarStyle: {
            height: TAB_BAR_HEIGHT,
            paddingTop: 8,
            paddingBottom: 10,
            backgroundColor: 'white',
            borderTopWidth: 1,
            elevation: 5,
          },
          headerShown: true,
          headerTitleAlign: 'center',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={30} color={color} />,
            headerRight: () => (
              <Link href="/modal" asChild>
                <HeaderButton />
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="log"
          options={{
            title: 'Log',
            tabBarIcon: ({ color }) => <MaterialIcons name="book" size={30} color={color} />,
          }}
        />
        <Tabs.Screen
          name="add-placeholder"
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="insert-chart" size={30} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: ({ color }) => <Feather name="more-horizontal" size={30} color={color} />,
          }}
        />
      </Tabs>

      <Pressable
        onPress={() => setModalVisible(true)}
        className="absolute bottom-[30px] left-1/2 z-50 -translate-x-1/2 items-center justify-center rounded-full bg-gray-800 p-3"
        android_ripple={{ color: '#444' }}>
        <Ionicons name="add" size={30} color="white" />
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              justifyContent: 'flex-end',
            }}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  backgroundColor: '#f3f4f6',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  paddingHorizontal: 12,
                  paddingTop: 20,
                  paddingBottom: 40,
                  transform: [{ translateY: slideAnim }],
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#1F2937',
                    marginBottom: 20,
                    textAlign: 'center',
                  }}>
                  Quick Add
                </Text>

                <View className="flex-row flex-wrap justify-between gap-4 px-4">
                  {ACTIONS.map(({ key, label, icon, onPress }) => (
                    <Pressable
                      key={key}
                      onPress={() => {
                        onPress();
                        setModalVisible(false);
                      }}
                      android_ripple={{ color: '#e5e7eb' }}
                      className="w-[48%] items-center rounded-md bg-white py-6">
                      {icon}
                      <Text className="mt-2 text-center text-sm font-semibold text-gray-700">
                        {label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <AddLogModal
        isModal={true}
        visible={logModalVisible}
        onClose={() => setLogModalVisible(false)}
      />
      <AddIngredientModal
        visible={ingredientModalVisible}
        onClose={() => setIngredientModalVisible(false)}
        onConfirm={handleAddIngredient}
      />
      <AddRecipeModal
        visible={recipeModalVisible}
        onClose={() => setRecipeModalVisible(false)}
        onConfirm={handleAddRecipe}
        newCounter={newCounter}
        setNewCounter={setNewCounter}
      />
      <AddInventoryModal
        userId={user?.id}
        visible={inventoryModalVisible}
        onClose={() => setInventoryModalVisible(false)}
        onConfirm={handleAddInventory}
      />
    </View>
  );
}
