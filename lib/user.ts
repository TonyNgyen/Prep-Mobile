import { supabase } from '~/utils/supabase';

const getUserProfilePicture = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('profilePictureUrl')
      .eq('uid', userId)
      .single();
    if (!data) {
      return {};
    }
    if (error) console.log(error);
    return data['profilePictureUrl'];
  } catch (error) {
    console.log(error);
  }
};

export { getUserProfilePicture };
