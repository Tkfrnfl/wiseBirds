import React, { useState, useCallback } from 'react';
import { useUserListStore } from '../../store/userListStore';
import { isErrorType } from '../../util/errorCheck';
import { useErrorStore } from '../../store/useErrorStore';

interface UserUpdateDialogProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string) => void;
}

const UserUpdateDialog: React.FC<UserUpdateDialogProps> = ({
  id,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { data, userUpdate } = useUserListStore();
  const [formData, setFormData] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const { setError } = useErrorStore();

  const validateNameForm = useCallback(() => {
    if (!formData.trim()) {
      setNameError('이름을 입력하세요');
      return false;
    }
    if (!/^[가-힣a-zA-Z]{1,16}$/.test(formData)) {
      setNameError('이름을 올바르게 입력하세요. (숫자,특수문자,공백 입력불가)');
      return false;
    }

    setNameError(null);
    return true;
  }, [formData]);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(value);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const validName = validateNameForm();
      if (validName) {
        onSubmit(formData);
        const fetchUserUpdate = async () => {
          const result = await userUpdate(id, formData);

          if (isErrorType(result)) {
            setError(result);
          }
        };
        fetchUserUpdate();

        setFormData('');
        onClose();
      }
      setIsSubmitting(false);
    },
    [formData, onSubmit, onClose]
  );
  const handleClose = useCallback(() => {
    setFormData('');

    setNameError(null);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">사용자 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="id" className="block font-medium">
              아이디
            </label>
            <div>{id}</div>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="block font-medium">
              이름
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData}
                onChange={handleNameChange}
                className="w-full border p-2 rounded pr-10"
              />
            </div>
          </div>
          {nameError !== null && (
            <div className="rounded shadow-md text-red-500">{nameError}</div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {isSubmitting ? '처리 중...' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateDialog;
