const NOTIFICATIONS_API_URL = 'https://functions.poehali.dev/867eda63-4bc6-4dc2-be1c-296913159724';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'X-Auth-Token': token || '',
  };
};

export const getNotifications = async (): Promise<{ notifications: Notification[]; unreadCount: number }> => {
  const response = await fetch(NOTIFICATIONS_API_URL, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Ошибка загрузки уведомлений');
  }

  return response.json();
};

export const markAsRead = async (id: number): Promise<void> => {
  const response = await fetch(NOTIFICATIONS_API_URL, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error('Ошибка обновления уведомления');
  }
};
