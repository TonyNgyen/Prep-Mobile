import { useAuth } from '~/contexts/AuthProvider';

const getUserId = async () => {
  const { user } = useAuth();
  return user?.id;
};

export { getUserId };
