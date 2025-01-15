import { IServerResponse } from '@/types/common.types';
import apiClient from '../api-client';
import { API_BASE_URL } from '@/shared/constants';
import {
  IOrganization,
  IOrganizationUser,
  IOrganizationTeam,
  IOrganizationUsersGetRequest,
  IOrganizationTeamGetRequest,
  IOrganizationProjectsGetResponse,
} from '@/types/admin-center/admin-center.types';
import { IClient } from '@/types/client.types';
import { toQueryString } from '@/utils/toQueryString';
import search from 'antd/es/transfer/search';

const rootUrl = `${API_BASE_URL}/admin-center`;

export interface IOrganizationUserRequestParams {
  page: number;
  pageSize: number;
  sort: string;
  order: string;
  searchTerm: string;
}

export interface IOrganizationTeamRequestParams {
  index: number;
  size: number;
  field: string | null;
  order: string | null;
  search: string | null;
}

export const adminCenterApiService = {
  async getOrganizationDetails(): Promise<IServerResponse<IOrganization>> {
    const response = await apiClient.get<IServerResponse<IOrganization>>(`${rootUrl}/organization`);
    return response.data;
  },

  async getOrganizationAdmins(): Promise<IServerResponse<IOrganizationUser[]>> {
    const response = await apiClient.get<IServerResponse<IOrganizationUser[]>>(
      `${rootUrl}/organization/admins`
    );
    return response.data;
  },

  async updateOrganizationName<T>(body: IClient): Promise<IServerResponse<IOrganization>> {
    const response = await apiClient.put<IServerResponse<IOrganization>>(
      `${rootUrl}/organization`,
      body
    );
    return response.data;
  },

  async updateOwnerContactNumber<T>(body: {
    contact_number: string;
  }): Promise<IServerResponse<IOrganization>> {
    const response = await apiClient.put<IServerResponse<IOrganization>>(
      `${rootUrl}/organization/owner/contact-number`,
      body
    );
    return response.data;
  },

  async getOrganizationUsers(
    requestParams: IOrganizationUserRequestParams
  ): Promise<IServerResponse<IOrganizationUsersGetRequest>> {
    const params = new URLSearchParams({
      index: requestParams.page.toString(),
      size: requestParams.pageSize.toString(),
      ...(requestParams.sort && { field: requestParams.sort }),
      ...(requestParams.order && { order: requestParams.order }),
      ...(requestParams.searchTerm && { search: requestParams.searchTerm }),
    });
    const response = await apiClient.get<IServerResponse<IOrganizationUsersGetRequest>>(
      `${rootUrl}/organization/users?${params}`
    );
    return response.data;
  },

  async getOrganizationTeams(
    requestParams: IOrganizationTeamRequestParams
  ): Promise<IServerResponse<IOrganizationTeamGetRequest>> {
    const params = new URLSearchParams({
      index: requestParams.index.toString(),
      size: requestParams.size.toString(),
      ...(requestParams.field && { field: requestParams.field }),
      ...(requestParams.order && { order: requestParams.order }),
      ...(requestParams.search && { search: requestParams.search }),
    });
    const response = await apiClient.get<IServerResponse<IOrganizationTeamGetRequest>>(
      `${rootUrl}/organization/teams?${params}`
    );
    return response.data;
  },

  async getOrganizationTeam(team_id: string): Promise<IServerResponse<IOrganizationTeam>> {
    const response = await apiClient.get<IServerResponse<IOrganizationTeam>>(
      `${rootUrl}/organization/team/${team_id}`
    );
    return response.data;
  },

  async updateTeam(
    team_id: string,
    team_members: IOrganizationUser[]
  ): Promise<IServerResponse<IOrganization>> {
    const response = await apiClient.put<IServerResponse<IOrganization>>(
      `${rootUrl}/organization/team/${team_id}`,
      team_members
    );
    return response.data;
  },

  async deleteTeam(id: string): Promise<IServerResponse<any>> {
    const response = await apiClient.delete<IServerResponse<any>>(
      `${rootUrl}/organization/team/${id}`
    );
    return response.data;
  },

  async removeTeamMember(team_member_id: string, team_id: string): Promise<IServerResponse<any>> {
    const response = await apiClient.put<IServerResponse<any>>(
      `${rootUrl}/organization/team-member/${team_member_id}`,
      { teamId: team_id }
    );
    return response.data;
  },

  async getOrganizationProjects(
    requestParams: IOrganizationTeamRequestParams
  ): Promise<IServerResponse<IOrganizationProjectsGetResponse>> {
    const params = new URLSearchParams({
      index: requestParams.index.toString(),
      size: requestParams.size.toString(),
      ...(requestParams.field && { field: requestParams.field }),
      ...(requestParams.order && { order: requestParams.order }),
      ...(requestParams.search && { search: requestParams.search }),
    });
    const response = await apiClient.get<IServerResponse<IOrganizationProjectsGetResponse>>(
      `${rootUrl}/organization/projects?${params}`
    );
    return response.data;
  },
};
