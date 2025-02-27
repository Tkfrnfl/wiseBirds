import { create } from 'zustand';
import { UserForm } from '../component/dialog/UserAddDialog';
// 유저 리스트 정보 저장하는 스토어
type Content = {
  name: string;
  id: number;
  email: string;
  last_login_at: string;
};

interface UserList {
  data: {
    content: Content[];
    size: number;
    total_elements: number;
    total_pages: number;
  } | null;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  userAdd: (userForm: UserForm) => Promise<void>;
  userUpdate: (id: number, name: string) => Promise<void>;
}

export const useUserListStore = create<UserList>((set) => ({
  data: null,
  loading: true,
  error: null,
  fetchData: async () => {
    try {
      const response = await fetch('/userListData.json');
      if (!response.ok) {
        throw new Error('Failed to fetch userList data');
      }
      const data = await response.json();
      set({ data: data, loading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      });
    }
  },
  userAdd: async (userForm: UserForm) => {
    set({ loading: true, error: null });

    try {
      const currentData = useUserListStore.getState().data;
      if (!currentData) {
        throw new Error('No user list data');
      }

      // 새 유저 데이터 생성
      const newUser: Content = {
        name: userForm.username,
        id:
          currentData.content.length > 0
            ? currentData.content[currentData.content.length - 1].id + 1
            : 1, // 마지막 ID + 1
        email: userForm.email,
        last_login_at: new Date().toISOString(),
      };

      // 스토어 업데이트
      const updatedData = {
        ...currentData,
        content: [...currentData.content, newUser],
        size: currentData.size + 1,
        total_elements: currentData.total_elements + 1,
      };

      set({
        data: updatedData,
        loading: false,
      });

      // 서버에 POST 요청 보내기
      //   const response = await fetch('/api/users', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ name, email, password, repeat_password }),
      //   });

      //   if (!response.ok) {
      //     throw new Error('Failed to add user on server');
      //   }

      //   const serverResponse = await response.json();
      //   console.log(serverResponse);
      const response = {
        result: true,
        id: newUser.id,
      };
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      });
    }
  },
  userUpdate: async (id: number, name: string) => {
    set({ loading: true, error: null });

    try {
      const currentData = useUserListStore.getState().data;
      if (!currentData) {
        throw new Error('No user list data');
      }

      // 유저 여부 확인
      const userIndex = currentData.content.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // 스토어 업데이트
      const updatedContent = [...currentData.content];
      updatedContent[userIndex] = {
        ...updatedContent[userIndex],
        name,
      };

      const updatedData = {
        ...currentData,
        content: updatedContent,
      };

      set({
        data: updatedData,
        loading: false,
      });

      // 서버에 PATCH 요청 보내기
      //   const response = await fetch(`/api/users/${id}`, {
      //     method: 'PATCH',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ name }),
      //   });

      //   if (!response.ok) {
      //     throw new Error('Failed to update user on server');
      //   }

      //   const serverResponse = await response.json();
      //   console.log(serverResponse);
      const response = { result: true, id: id };
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      });
    }
  },
}));
