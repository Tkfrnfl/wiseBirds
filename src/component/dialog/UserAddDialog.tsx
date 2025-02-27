import React, { useState, useCallback } from 'react';
import { useUserListStore } from '../../store/userListStore';
import { isErrorType } from '../../util/errorCheck';
import { useErrorStore } from '../../store/useErrorStore';

export type UserForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface UserAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserForm) => void;
}

const UserAddDialog: React.FC<UserAddDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { data, userAdd, userChk } = useUserListStore();
  const [formData, setFormData] = useState<UserForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [idError, setIdError] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [confirmPwdError, setConfirmPwdError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setError } = useErrorStore();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        email: value,
      }));
    },
    []
  );
  const handlePwdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        password: value,
      }));
    },
    []
  );
  const handlePwdChkChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        confirmPassword: value,
      }));
    },
    []
  );
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        username: value,
      }));
    },
    []
  );

  const validateIdForm = useCallback(async () => {
    if (!formData.email.trim()) {
      setIdError('아이디(이메일)을 입력하세요');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setIdError('올바른 이메일 주소를 입력하세요');
      return false;
    }
    if (await userChk(formData.email)) {
      setIdError('이미 사용중인 이메일입니다. 다른 이메일을 입력하세요');
      return false;
    }
    setIdError(null);
    return true;
  }, [formData]);

  const validatePwdForm = useCallback(() => {
    if (!formData.password.trim()) {
      setPwdError('비밀번호를 입력하세요');
      return false;
    }
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/;

    if (!passwordRegex.test(formData.password)) {
      setPwdError('8~15자 영문, 숫자, 특수문자를 사용하세요.');
      return false;
    }

    setPwdError(null);
    return true;
  }, [formData]);

  const validateConfirmPwdForm = useCallback(() => {
    if (!formData.confirmPassword.trim()) {
      setConfirmPwdError('비밀번호를 입력하세요');
      return false;
    }

    if (formData.confirmPassword !== formData.password) {
      setConfirmPwdError('비밀번호가 일치하지 않습니다');
      return false;
    }

    setConfirmPwdError(null);
    return true;
  }, [formData]);

  const validateNameForm = useCallback(() => {
    if (!formData.username.trim()) {
      setNameError('이름을 입력하세요');
      return false;
    }
    if (!/^[가-힣a-zA-Z]{1,16}$/.test(formData.username)) {
      setNameError('이름을 올바르게 입력하세요. (숫자,특수문자,공백 입력불가)');
      return false;
    }

    setNameError(null);
    return true;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const validId = await validateIdForm();
      const validPwd = validatePwdForm();
      const validConfirmPwd = validateConfirmPwdForm();
      const validName = validateNameForm();
      if (validId && validPwd && validConfirmPwd && validName) {
        onSubmit(formData);
        const fetchUserAdd = async () => {
          const result = await userAdd(formData);

          if (isErrorType(result)) {
            setError(result);
          }
        };
        fetchUserAdd();

        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        onClose();
      }
      setIsSubmitting(false);
    },
    [formData, validateIdForm, onSubmit, onClose]
  );

  const handleClose = useCallback(() => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setIdError(null);
    setPwdError(null);
    setConfirmPwdError(null);
    setNameError(null);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">사용자 생성</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="block font-medium">
              아이디
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.email}
              onChange={handleIdChange}
              className="w-full border p-2 rounded"
            />
          </div>
          {idError !== null && (
            <div className="rounded shadow-md text-red-500">{idError}</div>
          )}
          <div className="mb-3">
            <label htmlFor="password" className="block font-medium">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="영문, 숫자, 특수문자 조합 8~15자"
                value={formData.password}
                onChange={handlePwdChange}
                className="w-full border p-2 rounded pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {pwdError !== null && (
            <div className="rounded shadow-md text-red-500">{pwdError}</div>
          )}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="block font-medium">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handlePwdChkChange}
                className="w-full border p-2 rounded pr-10"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {confirmPwdError !== null && (
            <div className="rounded shadow-md text-red-500">
              {confirmPwdError}
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="username" className="block font-medium">
              이름
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleNameChange}
              className="w-full border p-2 rounded"
            />
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

export default UserAddDialog;
