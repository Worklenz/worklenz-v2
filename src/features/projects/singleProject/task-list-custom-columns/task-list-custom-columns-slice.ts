import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomTableColumnsType } from '../taskListColumns/taskColumnsSlice';
import { LabelType } from '../../../../types/label.type';
import { SelectionType } from '../../../../pages/projects/projectView/taskList/taskListTable/custom-columns/custom-column-modal/selection-type-column/selection-type-column';

export type CustomFieldsTypes =
  | 'people'
  | 'number'
  | 'date'
  | 'selection'
  | 'checkbox'
  | 'labels'
  | 'key'
  | 'formula';

export type CustomFieldNumberTypes =
  | 'formatted'
  | 'unformatted'
  | 'percentage'
  | 'withLabel';

export type ExpressionType = 'add' | 'substract' | 'divide' | 'multiply';

type TaskListCustomColumnsState = {
  isCustomColumnModalOpen: boolean;
  customFieldType: CustomFieldsTypes;
  customFieldNumberType: CustomFieldNumberTypes;
  decimals: number;
  label: string;
  labelPosition: 'left' | 'right';
  previewValue: number;
  expression: ExpressionType;
  firstNumericColumn: CustomTableColumnsType | null;
  secondNumericColumn: CustomTableColumnsType | null;
  labelsList: LabelType[];
  selectionsList: SelectionType[];
};

const initialState: TaskListCustomColumnsState = {
  isCustomColumnModalOpen: false,
  customFieldType: 'people',
  customFieldNumberType: 'formatted',
  decimals: 0,
  label: 'LKR',
  labelPosition: 'left',
  previewValue: 1000,
  expression: 'add',
  firstNumericColumn: null,
  secondNumericColumn: null,
  labelsList: [],
  selectionsList: [],
};

const taskListCustomColumnsSlice = createSlice({
  name: 'taskListCustomColumnsReducer',
  initialState,
  reducers: {
    toggleCustomColumnModalOpen: (state) => {
      state.isCustomColumnModalOpen = !state.isCustomColumnModalOpen;
    },
    setCustomFieldType: (state, action: PayloadAction<CustomFieldsTypes>) => {
      state.customFieldType = action.payload;
    },
    setCustomFieldNumberType: (
      state,
      action: PayloadAction<CustomFieldNumberTypes>
    ) => {
      state.customFieldNumberType = action.payload;
    },
    setDecimals: (state, action: PayloadAction<number>) => {
      state.decimals = action.payload;
    },
    setLabel: (state, action: PayloadAction<string>) => {
      state.label = action.payload;
    },
    setLabelPosition: (state, action: PayloadAction<'left' | 'right'>) => {
      state.labelPosition = action.payload;
    },
    setExpression: (state, action: PayloadAction<ExpressionType>) => {
      state.expression = action.payload;
    },
    setFirstNumericColumn: (
      state,
      action: PayloadAction<CustomTableColumnsType>
    ) => {
      state.firstNumericColumn = action.payload;
    },
    setSecondNumericColumn: (
      state,
      action: PayloadAction<CustomTableColumnsType>
    ) => {
      state.secondNumericColumn = action.payload;
    },
    setLabelsList: (state, action: PayloadAction<LabelType[]>) => {
      state.labelsList = action.payload;
    },
    setSelectionsList: (state, action: PayloadAction<SelectionType[]>) => {
      state.selectionsList = action.payload;
    },
    resetCustomFieldValues: (state) => {
      state = initialState;
    },
  },
});

export const {
  toggleCustomColumnModalOpen,
  setCustomFieldType,
  setCustomFieldNumberType,
  setDecimals,
  setLabel,
  setLabelPosition,
  setExpression,
  setFirstNumericColumn,
  setSecondNumericColumn,
  setLabelsList,
  setSelectionsList,
  resetCustomFieldValues,
} = taskListCustomColumnsSlice.actions;
export default taskListCustomColumnsSlice.reducer;
