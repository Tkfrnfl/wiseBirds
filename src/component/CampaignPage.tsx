import React, { useState, useEffect, useCallback } from 'react';
import { useCampaignStore } from '../store/campaignStore';
import { useErrorStore } from '../store/useErrorStore';
import { isErrorType } from '../util/errorCheck';

type Prop = {
  priv: string;
};

const CampaignPage: React.FC<Prop> = ({ priv }) => {
  const [pageNum, setPageNum] = useState<number>(1);
  const { data, loading, error, fetchData, toggleEnabled } = useCampaignStore();
  const { setError } = useErrorStore();
  useEffect(() => {
    const fetchCampaignData = async () => {
      const result = await fetchData();

      if (isErrorType(result)) {
        setError(result);
      }
    };
    fetchCampaignData();
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

  const handleToggle = useCallback((disabled: boolean, id: number) => {
    if (!disabled) {
      const toggleResult = toggleEnabled(id - 1);
      if (isErrorType(toggleResult)) {
        setError(toggleResult);
      }
    }
  }, []);

  const campaignTextMap = (data: string) => {
    switch (data) {
      case 'WEBSITE_TRAFFIC':
        return '웹사이트 전환';
      case 'LEAD':
        return '리드';
      default:
        return data;
    }
  };

  const currentPageData = data?.content.slice((pageNum - 1) * 25, pageNum * 25);

  return (
    <div>
      <div className="font-bold mb-3">캠페인 관리</div>
      <table className="w-full bg-white border border-gray-200 rounded-b-md shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b ">상태</th>
            <th className="py-2 px-4 border-b ">캠페인명</th>
            <th className="py-2 px-4 border-b">캠페인목적</th>
            <th className="py-2 px-4 border-b ">노출수</th>
            <th className="py-2 px-4 border-b ">클릭수</th>
            <th className="py-2 px-4 border-b ">CTR</th>
            <th className="py-2 px-4 border-b ">동영상전환수</th>
            <th className="py-2 px-4 border-b ">VTR</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData?.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-center">
                <div
                  onClick={() => handleToggle(priv === '뷰어', item.id)}
                  className={`border-b w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                    item.enabled ? 'bg-blue-500' : 'bg-gray-300'
                  } ${priv === '뷰어' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      item.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              </td>

              <td className="py-2 px-4 border-b text-left">{item.name}</td>
              <td className="py-2 px-4 border-b text-left">
                {campaignTextMap(item.campaign_objective)}
              </td>
              <td className="py-2 px-4 border-b text-right">
                {item.impressions.toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b text-right">
                {item.clicks.toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b text-right">
                {(Math.round(item.ctr * 100) / 100).toFixed(2)}%
              </td>
              <td className="py-2 px-4 border-b text-right">
                {item.video_views}
              </td>
              <td className="py-2 px-4 border-b text-right">
                {Math.round(item.vtr * 100).toFixed(2)}%
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
    </div>
  );
};

export default CampaignPage;
