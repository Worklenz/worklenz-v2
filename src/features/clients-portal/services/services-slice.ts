import { createSlice } from '@reduxjs/toolkit';
import { TempServicesType } from '../../../types/client-portal/temp-client-portal.types';
import { add } from 'date-fns';

const TempServices: TempServicesType[] = [
  {
    id: '1',
    name: 'Marketing video',
    created_by: 'sachintha prasad',
    status: 'pending',
    no_of_requests: 20,
  },
  {
    id: '2',
    name: 'Product portfolio video',
    created_by: 'sachintha prasad',
    status: 'inProgress',
    no_of_requests: 10,
  },
  {
    id: '3',
    name: 'Animated video',
    created_by: 'sachintha prasad',
    status: 'accepted',
    no_of_requests: 30,
  },
];

type ServicesState = {
  services: TempServicesType[];
  isAddServicesModalOpen: boolean;
};

const initialState: ServicesState = {
  services: TempServices,
  isAddServicesModalOpen: false,
};

const servicesSlice = createSlice({
  name: 'servicesReducer',
  initialState,
  reducers: {
    toggleAddServicesModal: (state) => {
      state.isAddServicesModalOpen = !state.isAddServicesModalOpen;
    },
    addService: (state, action) => {
      state.services.push(action.payload);
    },
  },
});

export const { toggleAddServicesModal, addService } = servicesSlice.actions;
export default servicesSlice.reducer;
