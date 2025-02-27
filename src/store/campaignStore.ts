import { create } from 'zustand';

/*
    캠페인 정보 저장하는 스토어
*/

type Content = {
  name: string;
  id: number;
  enabled: boolean;
  campaign_objective: string;
  impressions: number;
  clicks: number;
  ctr: number;
  video_views: number;
  vtr: number;
};

interface Campaign {
  data: {
    content: Content[];
    size: number;
    total_elements: number;
    total_pages: number;
  } | null;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  toggleEnabled: (index: number) => Promise<void>;
}

export const useCampaignStore = create<Campaign>((set) => ({
  data: null,
  loading: true,
  error: null,
  fetchData: async () => {
    try {
      const response = await fetch('/campaignData.json');
      if (!response.ok) {
        throw new Error('Failed to fetch campaign data');
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
  toggleEnabled: async (index: number) => {
    set({ loading: true, error: null });

    try {
      const currentData = useCampaignStore.getState().data;
      if (!currentData || !currentData.content[index]) {
        throw new Error('Invalid campaign index');
      }
      const updatedContent = [...currentData.content];
      updatedContent[index] = {
        ...updatedContent[index],
        enabled: !updatedContent[index].enabled,
      };

      // 스토어 업데이트
      set({
        data: {
          ...currentData,
          content: updatedContent,
        },
        loading: false,
      });

      // 서버에 PATCH 요청
      const campaignId = updatedContent[index].id;
      // const response = await fetch(`/api/campaigns/${campaignId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      const response = {
        result: true,
        id: index,
      };

      // if (!response.ok) {
      //   throw new Error('Failed to update campaign');
      // }

      // const updatedData = await response.json();
      // console.log(updatedData);
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      });
    }
  },
}));
