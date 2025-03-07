import React from 'react';
import Team from './team';
import Categories from './categories';
import Projects from './projects';
import Billable from './billable';

const TimeReportPageHeader: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Team />
      <Categories />
      <Projects />
      <Billable />
    </div>
  );
};

export default TimeReportPageHeader;
