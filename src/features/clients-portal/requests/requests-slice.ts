import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TempRequestsType } from '../../../types/client-portal/temp-client-portal.types';

const TempRequests: TempRequestsType[] = [
  {
    req_no: '#123',
    service: 'Marketing video',
    client: 'john doe',
    status: 'pending',
    time: new Date('2025-01-27T09:00:00'),
  },
  {
    req_no: '#232',
    service: 'Product portfolio video',
    client: 'alexander turner',
    status: 'inProgress',
    time: new Date('2025-01-28T10:00:00'),
  },
  {
    req_no: '#454',
    service: 'Animated video',
    client: 'john smith',
    status: 'accepted',
    time: new Date('2025-01-28T11:00:00'),
  },
];

export type RequestsState = {
  requests: TempRequestsType[];
  selectedRequestNo: string | null;
  isRequestModalOpen: boolean;
};

const initialState: RequestsState = {
  requests: TempRequests,
  selectedRequestNo: null,
  isRequestModalOpen: false,
};

const requestsSlice = createSlice({
  name: 'requestsReducer',
  initialState,
  reducers: {
    toggleRequestModal: (state, actions: PayloadAction<string | null>) => {
      state.isRequestModalOpen = !state.isRequestModalOpen;
      state.isRequestModalOpen
        ? (state.selectedRequestNo = actions.payload)
        : (state.selectedRequestNo = null);
    },
  },
});

export const { toggleRequestModal } = requestsSlice.actions;
export default requestsSlice.reducer;
