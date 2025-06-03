import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

function SelfUserProfilePicture() {
  const { profile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.profilePictureUrl) downloadImage(profile.profilePictureUrl);
  }, [profile?.profilePictureUrl]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('profile-pictures').download(path);

      if (error) throw error;

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => setAvatarUrl(fr.result as string);
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message);
      }
    }
  }

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        accessibilityLabel="Avatar"
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
    );
  }

  return <MaterialIcons name="account-circle" size={40} color="#1f2937" />;
}

export default SelfUserProfilePicture;
