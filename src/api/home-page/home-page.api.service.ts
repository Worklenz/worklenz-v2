import apiClient from '@api/api-client';
import { API_BASE_URL } from '@/shared/constants';
import { IServerResponse } from '@/types/common.types';
import { toQueryString } from '@/utils/toQueryString';
import { IHomeTasksModel, IPersonalTask } from '@/types/home/home-page.types';
import { IHomeTasksConfig } from '@/types/home/home-page.types';
import { IMyTask } from '@/types/home/my-tasks.types';
import { IProject } from '@/types/project/project.types';

const rootUrl = `${API_BASE_URL}/home`;

export const homePageApiService = {
  createPersonalTask: async (body: IMyTask): Promise<IServerResponse<IMyTask>> => {
    const response = await apiClient.post<IServerResponse<IMyTask>>(
      `${rootUrl}/personal-task`,
      body
    );
    return response.data;
  },

  getMyTasks: async (config: IHomeTasksConfig): Promise<IServerResponse<IHomeTasksModel>> => {
    const group_by = config.tasks_group_by;
    const current_tab = config.current_tab;
    const is_calendar_view = config.is_calendar_view;
    const selected_date = config.selected_date?.toISOString().split('T')[0];
    const time_zone = config.time_zone;

    const url = `${rootUrl}/tasks${toQueryString({ group_by, current_tab, is_calendar_view, selected_date, time_zone })}`;

    const response = await apiClient.get<IServerResponse<IHomeTasksModel>>(url);
    return response.data;
  },

  getPersonalTasks: async (): Promise<IServerResponse<IMyTask[]>> => {
    const response = await apiClient.get<IServerResponse<IMyTask[]>>(
      `${rootUrl}/personal-tasks`
    );
    return response.data;
  },

  getProjects: async (view: number): Promise<IServerResponse<IProject[]>> => {
    const response = await apiClient.get<IServerResponse<IProject[]>>(
      `${rootUrl}/projects?view=${view}`
    );
    return response.data;
  },

  getProjectsByTeam: async (team_id: string): Promise<IServerResponse<IProject[]>> => {
    const response = await apiClient.get<IServerResponse<IProject[]>>(`${rootUrl}/team-projects`);
    return response.data;
  },

  markPersonalTaskAsDone: async (task_id: string): Promise<IServerResponse<any>> => {
    const response = await apiClient.put<IServerResponse<any>>(`${rootUrl}/update-personal-task`, {
      id: task_id,
    });
    return response.data;
  },
};
