import { ITaskListColumn } from "@/types/tasks/taskList.types";
import apiClient from "../api-client";
import { IServerResponse } from "@/types/common.types";

export const tasksCustomColumnsService = {
  getCustomColumns: async (projectId: string): Promise<IServerResponse<ITaskListColumn[]>> => {
    const response = await apiClient.get(`/api/v1/custom-columns/project/${projectId}/columns`);
    return response.data;
  },
  
  updateTaskCustomColumnValue: async (
    taskId: string, 
    columnKey: string, 
    value: string | number | boolean,
    projectId: string
  ): Promise<IServerResponse<any>> => {
    const response = await apiClient.put(`/api/v1/tasks/${taskId}/custom-column`, {
      column_key: columnKey,
      value: value,
      project_id: projectId
    });
    return response.data;
  }
};
