import { PageHeader } from '@ant-design/pro-components';
import React, { memo } from 'react';

type ClientPortalPageHeaderProps = {
  title: string;
  children: React.ReactNode | null;
};

const ClientPortalPageHeader = ({ title, children }: ClientPortalPageHeaderProps) => {
  return (
    <PageHeader
      title={title}
      style={{ paddingLeft: 0, paddingRight: 0}}
      extra={children || null}
    />
  );
};

export default memo(ClientPortalPageHeader);
