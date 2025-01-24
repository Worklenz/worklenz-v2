import React from 'react';
import { statusData } from '@/lib/project/projectConstants';
import { ConfigProvider, Select, Typography } from 'antd';
import { colors } from '@/styles/colors';
import { useTranslation } from 'react-i18next';
import { toCamelCase } from '@/utils/toCamelCase';

const ProjectStatusCell = ({ status }: { status: string }) => {
  // localization
  const { t } = useTranslation('reporting-projects');

  // status selection options
  const statusOptions = [
    ...statusData.map((status, index) => ({
      key: index,
      value: status.value,
      label: (
        <Typography.Text
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          className="group-hover:text-[#1890ff]"
        >
          {status.icon}
          {t(`${status.value}Text`)}
        </Typography.Text>
      ),
    })),
  ];

  //   in this status data that get from the lib/project/projectConstants --> the value attribute is in camel case but in the props which is used as default value it came as the actual status name thats why this function is used

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            selectorBg: colors.transparent,
          },
        },
      }}
    >
      <Select
        options={statusOptions}
        defaultValue={toCamelCase(status)}
        style={{ width: 'fit-content' }}
      />
    </ConfigProvider>
  );
};

export default ProjectStatusCell;
