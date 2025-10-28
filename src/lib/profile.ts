const PROFILE_API_URL = 'https://functions.poehali.dev/73db2568-4852-43e9-8d48-f0043157119d';

export interface Profile {
  id: number;
  email: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  telegramChatId?: number;
  createdAt: string;
  stats?: {
    totalGoals: number;
    completedGoals: number;
  };
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'X-Auth-Token': token || '',
  };
};

export const getProfile = async (): Promise<Profile> => {
  const response = await fetch(PROFILE_API_URL, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Ошибка загрузки профиля');
  }

  const data = await response.json();
  return data.profile;
};

export const updateProfile = async (updates: Partial<Profile>): Promise<Profile> => {
  const response = await fetch(PROFILE_API_URL, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Ошибка обновления профиля');
  }

  const data = await response.json();
  return data.profile;
};
