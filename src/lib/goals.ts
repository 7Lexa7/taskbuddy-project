const GOALS_API_URL = 'https://functions.poehali.dev/3f03e5f8-24ed-4ceb-8910-272d2edf248d';

export interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'X-Auth-Token': token || '',
  };
};

export const getGoals = async (): Promise<Goal[]> => {
  const response = await fetch(GOALS_API_URL, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Ошибка загрузки целей');
  }

  const data = await response.json();
  return data.goals;
};

export const createGoal = async (goal: Partial<Goal>): Promise<Goal> => {
  const response = await fetch(GOALS_API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(goal),
  });

  if (!response.ok) {
    throw new Error('Ошибка создания цели');
  }

  const data = await response.json();
  return data.goal;
};

export const updateGoal = async (goal: Partial<Goal>): Promise<Goal> => {
  const response = await fetch(GOALS_API_URL, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(goal),
  });

  if (!response.ok) {
    throw new Error('Ошибка обновления цели');
  }

  const data = await response.json();
  return data.goal;
};

export const deleteGoal = async (id: number): Promise<void> => {
  const response = await fetch(`${GOALS_API_URL}?id=${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Ошибка удаления цели');
  }
};
