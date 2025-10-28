const AUTH_API_URL = 'https://functions.poehali.dev/6714bf23-2b98-4086-b7cf-7f34787b13b1';

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${AUTH_API_URL}?action=login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка входа');
  }

  return response.json();
};

export const register = async (email: string, password: string, username: string): Promise<AuthResponse> => {
  const response = await fetch(`${AUTH_API_URL}?action=register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, username }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка регистрации');
  }

  return response.json();
};

export const saveAuthData = (user: User, token: string) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
};

export const getAuthData = (): { user: User | null; token: string | null } => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  return {
    user: userStr ? JSON.parse(userStr) : null,
    token,
  };
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  const { token } = getAuthData();
  return !!token;
};
