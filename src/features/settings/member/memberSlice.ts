import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { MemberType } from '../../../types/member.types';
import { ITeamMemberViewModel } from '@/types/teamMembers/teamMembersGetResponse.types';

type MemberState = {
  owner: MemberType;
  membersList: MemberType[];
  isUpdateMemberDrawerOpen: boolean;
  isInviteMemberDrawerOpen: boolean;
};

const initialState: MemberState = {
  owner: {
    memberId: nanoid(),
    memberName: 'Sachintha Prasad',
    memberEmail: 'prasadsachintha1231@gmail.com',
    memberRole: 'owner',
    isActivate: true,
    isInivitationAccept: true,
  },
  membersList: [],
  isUpdateMemberDrawerOpen: false,
  isInviteMemberDrawerOpen: false,
};

const memberSlice = createSlice({
  name: 'memberReducer',
  initialState,
  reducers: {
    toggleInviteMemberDrawer: (state) => {
      state.isInviteMemberDrawerOpen
        ? (state.isInviteMemberDrawerOpen = false)
        : (state.isInviteMemberDrawerOpen = true);
    },
    toggleUpdateMemberDrawer: (state) => {
      state.isUpdateMemberDrawerOpen
        ? (state.isUpdateMemberDrawerOpen = false)
        : (state.isUpdateMemberDrawerOpen = true);
    }  },
});

export const {
  toggleInviteMemberDrawer,
  toggleUpdateMemberDrawer
} = memberSlice.actions;
export default memberSlice.reducer;
