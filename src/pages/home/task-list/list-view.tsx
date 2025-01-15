import { Tabs } from 'antd';
import AddTaskInlineForm from './add-task-inline-form';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslation } from 'react-i18next';

const ListView = () => {
  const { model } = useAppSelector(state => state.homePageReducer);
  const {t} = useTranslation('home');

  const tabItems = [
    {
      key: 'all',
      label: `${t('tasks.all')} (${model.total})`,
      children: <AddTaskInlineForm />,
    },
    {
      key: 'today',
      label: `${t('tasks.today')} (${model.today})`,
    },
    {
      key: 'upcoming',
      label: `${t('tasks.upcoming')} (${model.upcoming})`,
    },
    {
      key: 'overdue',
      label: `${t('tasks.overdue')} (${model.overdue})`,
    },
    {
      key: 'no due date',
      label: `${t('tasks.noDueDate')} (${model.no_due_date})`,
    },
  ];

  return (
    <Tabs type="card" items={tabItems} />
  );
};

export default ListView;
