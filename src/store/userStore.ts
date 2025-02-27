import { create } from 'zustand';

/*
    유저 정보 저장하는 스토어
*/

type Company = {
  id: number;
  name: string;
};

interface User {
  user: { name: string; id: number; email: string; company: Company } | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<User>((set) => ({
  user: null,
  loading: true,
  error: null,
  fetchUser: async () => {
    try {
      // const response = await fetch('/api/user/me');
      const response = await fetch('/userData.json');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      set({ user: data, loading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      });
    }
  },
}));
