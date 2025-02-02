import { createSlice } from '@reduxjs/toolkit';
import { TempServicesType } from '../../../types/client-portal/temp-client-portal.types';

const TempServices: TempServicesType[] = [
  {
    id: '1',
    name: 'Marketing video',
    created_by: 'john doe',
    status: 'pending',
    no_of_requests: 20,
    service_data: {
      description: 'A promotional marketing video service.',
      images: [],
      request_form: [],
    },
  },
  {
    id: '2',
    name: 'Product portfolio video',
    created_by: 'alexander turner',
    status: 'inProgress',
    no_of_requests: 10,
    service_data: {
      description: 'A product showcase video service.',
      images: [],
      request_form: [],
    },
  },
  {
    id: '3',
    name: 'Animated video',
    created_by: 'john smith',
    status: 'accepted',
    no_of_requests: 30,
    service_data: {
      description: 'An animated explainer video service.',
      images: [],
      request_form: [],
    },
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
