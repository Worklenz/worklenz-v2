import { Typography } from 'antd';
import React from 'react';
import { colors } from '../../../../../../styles/colors';
import { useTranslation } from 'react-i18next';

type ProjectDaysLeftAndOverdueCellProps = {
  daysLeft: number | null;
};

const ProjectDaysLeftAndOverdueCell = ({ daysLeft }: ProjectDaysLeftAndOverdueCellProps) => {
  // localization
  const { t } = useTranslation('reporting-projects');

  return (
    <Typography.Text style={{ cursor: 'pointer', color: colors.limeGreen }}>
      {daysLeft ? `${daysLeft} ${t('daysLeftText')}` : '-'}
    </Typography.Text>
  );
};

export default ProjectDaysLeftAndOverdueCell;
