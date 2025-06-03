import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';
import Avatar from '~/components/Avatar';
import { Feather } from '@expo/vector-icons';

export default function Account() {
  const { user, profile } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Error signing out', error.message);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: 'Account',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />

      {/* Profile Section */}
      <View className="items-center bg-white px-6 py-8">
        <Avatar
          url={profile?.profilePictureUrl}
          size={120}
          onUpload={async (filePath) => {
            await supabase
              .from('users')
              .update({ profilePictureUrl: filePath })
              .eq('uid', user?.id);
          }}
        />
        <Text className="mt-4 text-xl font-semibold text-gray-800">
          {profile?.firstName || 'User Name'}
        </Text>
        <Text className="text-sm text-gray-500">{user?.email}</Text>
        <TouchableOpacity className="mt-2 rounded-full border border-gray-300 px-4 py-1">
          <Text className="text-sm font-medium text-gray-800">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Overview */}
      <View className="mt-2 px-6">
        <Text className="mb-3 text-base font-semibold text-gray-800">Your Progress</Text>
        <View className="flex-row justify-between space-x-3">
          <ProgressCard title="Logged Days" value="23" />
          <ProgressCard title="Avg Calories" value="2,120" />
          <ProgressCard title="Goals Met" value="85%" />
        </View>
      </View>

      {/* Settings Section */}
      <View className="mt-8 px-6">
        <Text className="mb-3 text-base font-semibold text-gray-800">Settings</Text>
        <SettingItem label="Theme" icon="sun" />
        <SettingItem label="Notifications" icon="bell" />
        <SettingItem label="Language" icon="globe" />
        <SettingItem label="Privacy" icon="lock" />
      </View>

      {/* Support and Feedback */}
      <View className="mt-8 px-6">
        <Text className="mb-3 text-base font-semibold text-gray-800">Support</Text>
        <SettingItem label="Help Center" icon="help-circle" />
        <SettingItem label="Send Feedback" icon="message-square" />
        <SettingItem label="Contact Support" icon="mail" />
      </View>

      {/* Logout Button */}
      <View className="mt-10 px-6 pb-12">
        <TouchableOpacity onPress={handleLogout} className="items-center rounded-lg bg-red-100 p-3">
          <Text className="font-semibold text-red-500">Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function SettingItem({ label, icon }: { label: string; icon: keyof typeof Feather.glyphMap }) {
  return (
    <TouchableOpacity className="flex-row items-center py-3">
      <Feather name={icon} size={18} color="#4B5563" />
      <Text className="ml-3 text-sm font-medium text-gray-800">{label}</Text>
    </TouchableOpacity>
  );
}

function ProgressCard({ title, value }: { title: string; value: string }) {
  return (
    <View className="flex-1 rounded-lg bg-gray-100 px-4 py-5">
      <Text className="text-xs font-medium text-gray-500">{title}</Text>
      <Text className="mt-1 text-lg font-bold text-gray-800">{value}</Text>
    </View>
  );
}
