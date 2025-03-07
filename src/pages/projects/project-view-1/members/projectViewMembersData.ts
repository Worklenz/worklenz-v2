export type ProjectViewMembersType = {
  memberId: string;
  memberName: string;
  jobTitle: string;
  email: string;
  totalTasks: number;
  doneTasks: number;
  access: 'owner' | 'member' | 'admin';
};

export const projectViewMembersData: ProjectViewMembersType[] = [
  {
    memberId: '1',
    memberName: 'Sachintha Prasad',
    jobTitle: '-',
    email: 'prasadsachintha1231@gmail.com',
    totalTasks: 3,
    doneTasks: 1,
    access: 'member',
  },
];
