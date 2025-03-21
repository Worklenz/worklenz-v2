import { API_BASE_URL } from '@/shared/constants';
import { toQueryString } from '@/utils/toQueryString';
import apiClient from '../api-client';

const rootUrl = `${API_BASE_URL}/reporting/allocation`;

export const reportingTimesheetApiService = {
  getTimeSheetData: async (body = {}, archived = false) => {
    const q = toQueryString({ archived });
    const response = await apiClient.post(`${rootUrl}/${q}`, body);
    return response.data;
  },

  getAllocationProjects: async (body = {}) => {
    const response = await apiClient.post(`${rootUrl}/allocation-projects`, { body });
    return response.data;
  },
};
