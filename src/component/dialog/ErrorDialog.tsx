import React, { useState, useCallback } from 'react';

interface ErrorDialogProps {
  isOpen: boolean;
  onSubmit: () => void;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ isOpen, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <p>에러가 발생했습니다.</p>
        <p>같은 현상이 반복되면 고객센터로 문의 바랍니다.</p>

        <p>*고객센터</p>
        <p>- email: helpdesk@wisebirds.ai</p>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog;
