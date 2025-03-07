export type MemberLoggedTimeType = {
  memberId: string;
  memberName: string;
  memberLoggedTime: string;
};

export type ProjectType = {
  projectId: string;
  projectName: string;
  members: MemberLoggedTimeType[];
};
