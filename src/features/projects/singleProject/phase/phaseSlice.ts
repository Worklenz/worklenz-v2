import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PhaseOption, PhaseType } from '../../../../types/phase.types';

type PhaseState = {
  isPhaseDrawerOpen: boolean;
  phaseList: PhaseType[];
};

const initialState: PhaseState = {
  isPhaseDrawerOpen: false,
  phaseList: [
    {
      phaseId: '1',
      projectId: 'Sz0UEKMCRjYCReyvOXhyK',
      phase: 'New Phase',
      phaseOptions: [
        {
          optionId: 'option1',
          optionName: 'Phase 1',
          optionColor: '#cb9878',
        },
        {
          optionId: 'option2',
          optionName: 'Hello',
          optionColor: '#70a6f3',
        },
      ],
    },
  ],
};

const phaseSlice = createSlice({
  name: 'phaseReducer',
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isPhaseDrawerOpen
        ? (state.isPhaseDrawerOpen = false)
        : (state.isPhaseDrawerOpen = true);
    },

    changePhaseName: (
      state,
      action: PayloadAction<{ phaseId: string; phase: string }>
    ) => {
      const { phaseId, phase } = action.payload;

      const index = state.phaseList.findIndex(
        (phase) => phase.phaseId === phaseId
      );

      if (index !== -1) {
        state.phaseList[index] = { ...state.phaseList[index], phase };
      }
    },

    addPhaseOption: (
      state,
      action: PayloadAction<{ phaseId: string; option: PhaseOption }>
    ) => {
      const { phaseId, option } = action.payload;

      const index = state.phaseList.findIndex(
        (phase) => phase.phaseId === phaseId
      );

      if (index !== -1) {
        state.phaseList[index] = {
          ...state.phaseList[index],
          phaseOptions: [...state.phaseList[index].phaseOptions, option],
        };
      }
    },

    deletePhaseOption: (
      state,
      action: PayloadAction<{ phaseId: string; optionId: string }>
    ) => {
      const { phaseId, optionId } = action.payload;

      const index = state.phaseList.findIndex(
        (phase) => phase.phaseId === phaseId
      );

      if (index !== -1) {
        state.phaseList[index] = {
          ...state.phaseList[index],
          phaseOptions: state.phaseList[index].phaseOptions.filter(
            (option) => option.optionId !== optionId
          ),
        };
      }
    },
  },
});

export const {
  toggleDrawer,
  changePhaseName,
  addPhaseOption,
  deletePhaseOption,
} = phaseSlice.actions;
export default phaseSlice.reducer;
