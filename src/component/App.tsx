import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import '../index.css';
import { useUserStore } from '../store/userStore';
import CampaignPage from './CampaignPage';
import UserPage from './UserPage';

/*
메인 헤더 페이지 컴포넌트 입니다
*/

interface Tab {
  id: number;
  label: string;
  path: string;
}

const tabs: Tab[] = [
  { id: 1, label: 'Wisebirds', path: '/' },
  { id: 2, label: '캠페인', path: '/campaign' },
  { id: 3, label: '사용자', path: '/users' },
];

function App() {
  const { user, loading, error, fetchUser } = useUserStore();
  const [priv, setPriv] = useState<string>('어드민');
  const [onMyInfo, setMyInfo] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  // priv 변경 시 /users 페이지라면 /로 이동
  useEffect(() => {
    if (priv !== '어드민' && location.pathname === '/users') {
      navigate('/');
    }
  }, [priv, location.pathname, navigate]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPriv(event.target.value);
  };

  const toggleMyInfo = () => {
    setMyInfo((prev) => !prev);
  };

  return (
    <>
      <header className="bg-blue-500 p-4 relative">
        <nav className="flex items-center">
          {tabs.map((tab) => {
            if (priv !== '어드민' && tab.id === 3) {
              return null;
            }

            const isActive = location.pathname === tab.path;

            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`text-white hover:text-gray-300 ml-4 px-3 py-2 rounded ${
                  isActive ? 'bg-blue-700' : ''
                }`}
              >
                {tab.label}
              </Link>
            );
          })}

          <div
            className="ml-auto text-white cursor-pointer"
            onClick={toggleMyInfo}
          >
            👤 {user?.email}
          </div>

          {onMyInfo && (
            <div className="absolute bg-white text-blue-500 p-4 rounded shadow-lg mt-2 w-48 z-10 top-10 right-5">
              <div>이메일: {user?.email}</div>
              <div>이름: {user?.name}</div>
              <div>회사: {user?.company?.name}</div>
            </div>
          )}

          <div className="dropdown-container relative z-20">
            <select
              id="dropdown"
              value={priv}
              onChange={handleSelectChange}
              className="bg-white text-blue-500 p-1 ml-5 rounded"
            >
              <option value="어드민">어드민</option>
              <option value="매니저">매니저</option>
              <option value="뷰어">뷰어</option>
            </select>
          </div>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/campaign" element={<CampaignPage priv={priv} />} />
          <Route path="/users" element={<UserPage />} />
        </Routes>
      </main>
    </>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
