import { configureStore } from '@reduxjs/toolkit';

// Auth & User
import authReducer from '@features/auth/authSlice';
import userReducer from '@features/user/userSlice';

// Core UI
import themeReducer from '@features/theme/themeSlice';
import localesReducer from '@features/i18n/localesSlice';
import alertsReducer from '@/services/alerts/alertSlice';

// Projects
import projectReducer from '@features/project/project.slice';
import projectsReducer from '@features/projects/projectsSlice';
import projectMemberReducer from '@features/projects/singleProject/members/projectMembersSlice';
import projectViewTaskListColumnsReducer from '@features/projects/singleProject/taskListColumns/taskColumnsSlice';
import phaseReducer from '@features/projects/singleProject/phase/phaseSlice';
import updatesReducer from '../features/projects/singleProject/updates/updatesSlice';
import statusReducer from '@features/projects/status/StatusSlice';
import bulkActionReducer from '@features/projects/bulkActions/bulkActionSlice';
import projectInsightsReducer from '@features/projects/insights/project-insights.slice';

// Project Lookups
import projectCategoriesReducer from '@features/projects/lookups/projectCategories/projectCategoriesSlice';
import projectStatusesReducer from '@features/projects/lookups/projectStatuses/projectStatusesSlice';
import projectHealthReducer from '@features/projects/lookups/projectHealth/projectHealthSlice';

// Tasks
import taskReducer from '@features/tasks/taskSlice';
import createCardReducer from '@features/board/createCardSlice';
import priorityReducer from '@features/taskAttributes/taskPrioritySlice';
import taskLabelsReducer from '@features/taskAttributes/taskLabelSlice';
import taskStatusReducer from '@features/taskAttributes/taskStatusSlice';

// Settings & Management
import memberReducer from '@features/settings/member/memberSlice';
import clientReducer from '@features/settings/client/clientSlice';
import jobReducer from '@features/settings/job/jobSlice';
import teamReducer from '@features/teams/teamSlice';
import billingReducer from '@features/adminCenter/billing/billingSlice';
import categoriesReducer from '@features/settings/categories/categoriesSlice';
import labelReducer from '@features/settings/label/labelSlice';

// Features
import dateReducer from '@features/date/dateSlice';
import notificationReducer from '@features/navbar/notification/notificationSlice';
import buttonReducer from '@features/actionSetup/buttonSlice';
import scheduleReducer from '../features/schedule/scheduleSlice';

// Reports
import reportingReducer from '@features/reporting/reporting.slice';
import timeLogReducer from '../features/timeReport/projects/timeLogSlice';
import taskTemplateReducer from '../features/settings/taskTemplates/taskTemplateSlice';
import projectReportsTableColumnsReducer from '../features/reporting/projectReports/projectReportsTableColumns/projectReportsTableColumnSlice';
import projectReportsReducer from '../features/reporting/projectReports/projectReportsSlice';
import membersReportsReducer from '../features/reporting/membersReports/membersReportsSlice';
import roadmapReducer from '../features/roadmap/roadmap-slice';
import teamMembersReducer from '@features/team-members/team-members.slice';

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    // Auth & User
    auth: authReducer,
    userReducer: userReducer,

    // Core UI
    themeReducer: themeReducer,
    localesReducer: localesReducer,
    alertsReducer: alertsReducer,

    // Projects
    projectReducer: projectReducer,
    projectsReducer: projectsReducer,
    projectMemberReducer: projectMemberReducer,
    teamMembersReducer: teamMembersReducer,
    projectViewTaskListColumnsReducer: projectViewTaskListColumnsReducer,
    phaseReducer: phaseReducer,
    updatesReducer: updatesReducer,
    statusReducer: statusReducer,
    bulkActionReducer: bulkActionReducer,
    projectInsightsReducer: projectInsightsReducer,

    // Project Lookups
    projectCategoriesReducer: projectCategoriesReducer,
    projectStatusesReducer: projectStatusesReducer,
    projectHealthReducer: projectHealthReducer,

    // Tasks
    taskReducer: taskReducer,
    createCardReducer: createCardReducer,
    priorityReducer: priorityReducer,
    taskLabelsReducer: taskLabelsReducer,
    taskStatusReducer: taskStatusReducer,

    // Settings & Management
    memberReducer: memberReducer,
    clientReducer: clientReducer,
    jobReducer: jobReducer,
    teamReducer: teamReducer,
    billingReducer: billingReducer,
    categoriesReducer: categoriesReducer,
    labelReducer: labelReducer,

    // Features
    dateReducer: dateReducer,
    notificationReducer: notificationReducer,
    button: buttonReducer,
    scheduleReducer: scheduleReducer,

    // Reports
    reportingReducer: reportingReducer,
    timeLogReducer: timeLogReducer,
    taskTemplateReducer: taskTemplateReducer,
    projectReportsTableColumnsReducer: projectReportsTableColumnsReducer,
    projectReportsReducer: projectReportsReducer,
    membersReportsReducer: membersReportsReducer,
    roadmapReducer: roadmapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
