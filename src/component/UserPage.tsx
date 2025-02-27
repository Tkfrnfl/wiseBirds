import React, { useState, useEffect, useCallback } from 'react';
import { useUserListStore } from '../store/userListStore';
import UserAddDialog from './dialog/UserAddDialog';
import UserUpdateDialog from './dialog/UserUpdateDialog';
import { isErrorType } from '../util/errorCheck';
import { useErrorStore } from '../store/useErrorStore';

const UserPage: React.FC = () => {
  const [pageNum, setPageNum] = useState<number>(1);
  const { data, fetchData } = useUserListStore();
  const { setError } = useErrorStore();
  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<string>('');
  const [isOpenUpdate, setIsOpenUpdate] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserListData = async () => {
      const result = await fetchData();

      if (isErrorType(result)) {
        setError(result);
      }
    };
    fetchUserListData();
  }, []);

  const handlePrevious = () => {
    if (pageNum > 1) {
      setPageNum(pageNum - 1);
    }
  };

  const handleNext = () => {
    if (data?.total_pages !== undefined && pageNum < data?.total_pages) {
      setPageNum(pageNum + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setPageNum(page);
  };
  const totalPages = Number(data?.total_pages) || 1;

  const currentPageData = data?.content.slice((pageNum - 1) * 25, pageNum * 25);

  const handleIsOpen = () => {
    setIsOpenAdd(true);
  };
  const handleIsUpdateOpen = (id: string) => {
    setUpdateId(id);
    setIsOpenUpdate(true);
  };

  const handleIsClose = () => {
    setIsOpenAdd(false);
  };
  const handleIsUpdateClose = () => {
    setIsOpenUpdate(false);
  };
  const handleIsSubmit = () => {
    setIsOpenAdd(false);
  };
  const handleIsUpdateSubmit = () => {
    setIsOpenUpdate(false);
  };

  return (
    <div>
      <div className="font-bold mb-3">사용자 관리</div>
      <hr className="w-full border-t border-gray-300 my-4" />
      <button
        onClick={handleIsOpen}
        className="rounded bg-blue-500 p-2 ml-3 text-white"
      >
        생성
      </button>
      <table className="w-full bg-white border border-gray-200 rounded-b-md shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b ">아이디</th>
            <th className="py-2 px-4 border-b ">이름</th>
            <th className="py-2 px-4 border-b">마지막 로그인 일시</th>
            <th className="py-2 px-4 border-b ">수정</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData?.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-left">{item.email}</td>
              <td className="py-2 px-4 border-b text-left">{item.name}</td>
              <td className="py-2 px-4 border-b text-right">
                {item.last_login_at}
              </td>
              <td className="py-2 px-4 border-b text-left">
                <button onClick={() => handleIsUpdateOpen(item.email)}>
                  수정
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지 선택 부분 */}
      <div className="flex justify-center items-center space-x-2 p-4">
        <button
          onClick={handlePrevious}
          disabled={pageNum === 1}
          className="px-3 py-1 border rounded-l-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-1 border rounded-md ${
                pageNum === page
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={handleNext}
          disabled={pageNum === totalPages}
          className="px-3 py-1 border rounded-r-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &gt;
        </button>
      </div>
      <UserAddDialog
        isOpen={isOpenAdd}
        onClose={handleIsClose}
        onSubmit={handleIsSubmit}
      />
      <UserUpdateDialog
        id={updateId}
        isOpen={isOpenUpdate}
        onClose={handleIsUpdateClose}
        onSubmit={handleIsUpdateSubmit}
      />
    </div>
  );
};

export default UserPage;
