type FinanceTableColumnsType = {
  key: string;
  name: string;
  width: number;
  type: 'string' | 'hours' | 'currency';
};

// finance table columns
export const financeTableColumns: FinanceTableColumnsType[] = [
  {
    key: 'task',
    name: 'Task',
    width: 240,
    type: 'string',
  },
  {
    key: 'members',
    name: 'Members',
    width: 160,
    type: 'string',
  },
  {
    key: 'hours',
    name: 'Hours',
    width: 80,
    type: 'hours',
  },
  {
    key: 'cost',
    name: 'Cost',
    width: 120,
    type: 'currency',
  },
  {
    key: 'fixedCost',
    name: 'Fixed Cost',
    width: 120,
    type: 'currency',
  },
  {
    key: 'totalBudget',
    name: 'Total Budgeted Cost',
    width: 120,
    type: 'currency',
  },
  {
    key: 'totalActual',
    name: 'Total Actual Cost',
    width: 120,
    type: 'currency',
  },
  {
    key: 'variance',
    name: 'Variance',
    width: 120,
    type: 'currency',
  },
];
