import apiClient from '@api/api-client';
import { API_BASE_URL } from '@/shared/constants';
import { IServerResponse } from '@/types/common.types';
import { IProfileSettings } from '@/types/settings/profile.types';
import { INotificationSettings } from '../notifications/notifications.types';
import { IAccountSetupRequest, IAccountSetupResponse } from '@/types/project-templates/project-templates.types';
import { ITeam } from '@/types/teams/team.type';

const rootUrl = `${API_BASE_URL}/settings`;

export const profileSettingsApiService = {
  getProfile: async (): Promise<IServerResponse<IProfileSettings>> => {
    const response = await apiClient.get<IServerResponse<IProfileSettings>>(`${rootUrl}/profile`);
    return response.data;
  },

  updateProfile: async (body: IProfileSettings): Promise<IServerResponse<IProfileSettings>> => {
    const response = await apiClient.put<IServerResponse<IProfileSettings>>(`${rootUrl}/profile`, body);
    return response.data;
  },

  getNotificationSettings: async (): Promise<IServerResponse<INotificationSettings>> => {
    const response = await apiClient.get<IServerResponse<INotificationSettings>>(`${rootUrl}/notifications`);
    return response.data;
  },

  updateNotificationSettings: async (body: INotificationSettings): Promise<IServerResponse<INotificationSettings>> => {
    const response = await apiClient.put<IServerResponse<INotificationSettings>>(`${rootUrl}/notifications`, body);
    return response.data;
  },

  setupAccount: async (body: IAccountSetupRequest): Promise<IServerResponse<IAccountSetupResponse>> => {
    const response = await apiClient.post<IServerResponse<IAccountSetupResponse>>(`${rootUrl}/setup`, body);
    return response.data;
  },

  updateTeamName: async (body: { team_name: string }): Promise<IServerResponse<ITeam>> => {
    const response = await apiClient.put<IServerResponse<ITeam>>(`${rootUrl}/team-name`, body);
    return response.data;
  },
};
