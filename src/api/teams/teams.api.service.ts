import { IServerResponse } from '@/types/common.types';
import apiClient from '../api-client';
import { ITeam, ITeamActivateResponse, ITeamGetResponse, ITeamInvites } from '@/types/teams/team.type';
import { API_BASE_URL } from '@/shared/constants';
import { IOrganizationTeam } from '@/types/admin-center/admin-center.types';
import { ITeamInvitationViewModel } from '@/types/notifications/notifications.types';

export const teamsApiService = {
  getTeams: async (): Promise<IServerResponse<ITeamGetResponse[]>> => {
    const response = await apiClient.get<IServerResponse<ITeamGetResponse[]>>(
      `${API_BASE_URL}/teams`,
    );
    return response.data;
  },

  setActiveTeam: async (teamId: string): Promise<IServerResponse<ITeamActivateResponse>> => {
    const response = await apiClient.put<IServerResponse<ITeamActivateResponse>>(
      `${API_BASE_URL}/teams/activate`, { id: teamId }
    );
    return response.data;
  },

  createTeam: async (team: IOrganizationTeam): Promise<IServerResponse<ITeam>> => {
    const response = await apiClient.post<IServerResponse<ITeam>>(
      `${API_BASE_URL}/teams`, team
    );
    return response.data;
  },

  getInvitations: async (): Promise<IServerResponse<ITeamInvites[]>> => {
    const response = await apiClient.get<IServerResponse<ITeamInvites[]>>(
      `${API_BASE_URL}/teams/invites`
    );
    return response.data;
  }
};
