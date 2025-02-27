import { create } from 'zustand';
import { ErrorType } from '../util/errorCheck';

/*
    에러 상태를 저장하는 스토어
*/

interface ErrorState {
  isErr: boolean;
  errorMessage: string | null;
  setError: (error: ErrorType | null) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  isErr: false,
  errorMessage: null,

  // 에러 설정
  setError: (error) =>
    set({
      isErr: !!error,
      errorMessage: error
        ? error.error instanceof Error
          ? error.error.message
          : String(error.error)
        : null,
    }),

  clearError: () => set({ isErr: false, errorMessage: null }),
}));
