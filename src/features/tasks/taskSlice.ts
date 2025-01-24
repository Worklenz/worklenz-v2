import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskType } from '@/types/task.types';
import { MemberType } from '@/types/member.types';
import { ITaskLabel } from '@/types/tasks/taskLabel.types';

type TaskState = {
  tasks: TaskType[];
  isCreateTaskDrawerOpen: boolean;
  isUpdateTaskDrawerOpen: boolean;
};

const initialState: TaskState = {
  isCreateTaskDrawerOpen: false,
  isUpdateTaskDrawerOpen: false,
  tasks: [
    {
      taskId: 'SP-1',
      task: 'Workload',
      description:
        'Define the basic structure for task templates. Define the basic structure for task templates Define the basic structure for task templates Define the basic structure for task templates',
      progress: 0,
      members: [
        {
          memberId: '1',
          memberName: 'Chamika J',
          memberEmail: '',
          memberRole: 'owner',
          isActivate: null,
          isInivitationAccept: false,
        },
        {
          memberId: '2',
          memberName: 'Sachintha Prasad',
          memberEmail: '',
          memberRole: 'owner',
          isActivate: null,
          isInivitationAccept: false,
        },
      ],
      labels: [
        { labelId: 'label1', labelName: 'Bug', labelColor: '#ff9c3c' },
        { labelId: 'label2', labelName: 'Test', labelColor: '#905b39' },
        {
          labelId: 'label3',
          labelName: 'Documentation',
          labelColor: '#cbbc78',
        },
      ],
      status: 'todo',
      priority: 'high',
      timeTracking: 320,
      estimation: '-',
      startDate: new Date('2023-09-15'),
      dueDate: new Date('2023-10-10'),
      completedDate: null,
      createdDate: new Date('2023-09-10'),
      lastUpdated: new Date('2023-09-15'),
      reporter: '-',
      phase: 'UI/UX',
      subTasks: [
        {
          taskId: 'SP-09',
          task: 'Define workload requirements',
          description: 'Identify and document requirements.',
          members: [
            {
              memberId: '1',
              memberName: 'Chamika J',
              memberEmail: '',
              memberRole: 'owner',
              isActivate: null,
              isInivitationAccept: false,
            },
            {
              memberId: '2',
              memberName: 'Sachintha Prasad',
              memberEmail: '',
              memberRole: 'owner',
              isActivate: null,
              isInivitationAccept: false,
            },
          ],
          labels: [
            {
              labelId: 'label4',
              labelName: 'Template',
              labelColor: '#154c9b',
            },
          ],
          status: 'doing',
          priority: 'medium',
          startDate: new Date('2023-09-15'),
          dueDate: new Date('2023-09-20'),
          createdDate: new Date('2023-09-14'),
          lastUpdated: new Date('2023-09-16'),
        },
        {
          taskId: 'SP-10',
          task: 'Review workload analysis',
          description: 'Review the workload analysis report.',
          members: [],
          labels: [],
          status: 'todo',
          priority: 'low',
          startDate: new Date('2023-09-21'),
          dueDate: new Date('2023-09-25'),
          createdDate: new Date('2023-09-15'),
          lastUpdated: new Date('2023-09-18'),
        },
      ],
    },
    {
      taskId: 'SP-4',
      task: 'Settings (task templates)',
      description: null,
      progress: 30,
      members: [
        {
          memberId: '1',
          memberName: 'Chamika J',
          memberEmail: '',
          memberRole: 'owner',
          isActivate: null,
          isInivitationAccept: false,
        }
      ],
      labels: [
        {
          labelId: 'label3',
          labelName: 'Documentation',
          labelColor: '#a3c4dc',
        },
      ],
      status: 'doing',
      priority: 'medium',
      timeTracking: 0,
      estimation: '-',
      startDate: new Date('2023-10-01'),
      dueDate: new Date('2023-11-01'),
      completedDate: null,
      createdDate: new Date('2023-09-25'),
      lastUpdated: new Date('2023-10-05'),
      reporter: '-',
      phase: '',
      subTasks: [
        {
          taskId: 'SP-15',
          task: 'Create task template structure',
          description: 'Define the basic structure for task templates.',
          members: [],
          labels: [
            {
              labelId: 'label3',
              labelName: 'Documentation',
              labelColor: '#cbbc78',
            },
          ],
          status: 'doing',
          priority: 'high',
          startDate: new Date('2023-10-02'),
          dueDate: new Date('2023-10-05'),
          createdDate: new Date('2023-10-01'),
          lastUpdated: new Date('2023-10-03'),
        },
      ],
    },
    {
      taskId: 'SP-5',
      task: 'Insights (tasks)',
      description: 'Define the basic',
      progress: 0,
      members: [],
      labels: [{ labelId: 'label2', labelName: 'Test', labelColor: '#905b39' }],
      status: 'todo',
      priority: 'low',
      timeTracking: 100,
      estimation: '-',
      startDate: new Date('2023-10-05'),
      dueDate: new Date('2023-10-20'),
      completedDate: null,
      createdDate: new Date('2023-10-01'),
      lastUpdated: new Date('2023-10-10'),
      reporter: '-',
      phase: '',
      subTasks: [],
    },
    {
      taskId: 'SP-06',
      task: 'Settings (change password)',
      description: 'Define the basic structure for task templates.',
      progress: 100,
      members: [],
      labels: [
        {
          labelId: 'label3',
          labelName: 'Documentation',
          labelColor: '#cbbc78',
        },
        {
          labelId: 'label4',
          labelName: 'Template',
          labelColor: '#154c9b',
        },
        {
          labelId: 'label5',
          labelName: 'UI',
          labelColor: '#f37070',
        },
      ],
      status: 'done',
      priority: 'medium',
      timeTracking: 0,
      estimation: '-',
      startDate: new Date('2023-09-01'),
      dueDate: new Date('2023-09-15'),
      completedDate: new Date('2023-09-14'),
      createdDate: new Date('2023-08-28'),
      lastUpdated: new Date('2023-09-14'),
      reporter: '-',
      phase: '',
      subTasks: [],
    },
  ],
};

const taskSlice = createSlice({
  name: 'taskReducer',
  initialState,
  reducers: {
    // create drawer toggle
    toggleCreateTaskDrawer: (state) => {
      state.isCreateTaskDrawerOpen
        ? (state.isCreateTaskDrawerOpen = false)
        : (state.isCreateTaskDrawerOpen = true);
    },
    // update drawer toggle
    toggleUpdateTaskDrawer: (state) => {
      state.isUpdateTaskDrawerOpen
        ? (state.isUpdateTaskDrawerOpen = false)
        : (state.isUpdateTaskDrawerOpen = true);
    },

    // task crud
    addTask: (state, action: PayloadAction<TaskType>) => {
      state.tasks.push(action.payload);
    },

    addTaskToTop: (state, action: PayloadAction<TaskType>) => {
      state.tasks.unshift(action.payload);
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(
        (task) => task.taskId !== action.payload
      );
    },

    // update specific items
    // add or remove members to the task
    toggleMember: (
      state,
      action: PayloadAction<{ taskId: string; member: MemberType }>
    ) => {
      const { taskId, member } = action.payload;
      const task = state.tasks.find((task) => task.taskId === taskId);
      if (task) {
        const memberExists = task.members?.some(
          (existingMember) => existingMember.memberId === member.memberId
        );
        task.members = memberExists
          ? task.members?.filter(
              (existingMember) => existingMember.memberId !== member.memberId
            )
          : [...(task.members || []), member];
      }
    },
    // add or remove labels to the task
    toggleLabel: (
      state,
      action: PayloadAction<{ taskId: string; label: ITaskLabel }>
    ) => {
      const { taskId, label } = action.payload;
      const task = state.tasks.find((task) => task.taskId === taskId);
      if (task) {
        const labelExists = task.labels?.some(
          (existingLabel: ITaskLabel) => existingLabel.id === label.id
        );
        task.labels = labelExists
          ? task.labels?.filter(
              (existingLabel: ITaskLabel) => existingLabel.id !== label.id
            )
          : [...(task.labels || []), label];
      }
    },
  },
});

export const {
  toggleCreateTaskDrawer,
  toggleUpdateTaskDrawer,
  addTask,
  deleteTask,
  toggleMember,
  toggleLabel,
  addTaskToTop,
} = taskSlice.actions;

export default taskSlice.reducer;
