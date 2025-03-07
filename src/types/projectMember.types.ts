import { IProjectMember } from "./project/projectMember.types";

export interface IProjectMemberViewModel extends IProjectMember {
  name?: string;
  team_member_id?: string;
  job_title?: string;
  email?: string;
  avatar_url?: string;
  color_code?: string;
}

export interface IProjectMembersViewModel {
  total?: number;
  data?: IProjectMemberViewModel[];
}
