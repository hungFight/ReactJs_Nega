import { createSlice } from '@reduxjs/toolkit';
import { PropsRoomChat } from '~/restAPI/chatAPI';

type PropsReLoad = {
    userOnline: string[];
};
const initialState: PropsReLoad = {
    userOnline: [],
};
const userOnlineRD = createSlice({
    name: 'userOnlineRD',
    initialState: initialState,
    reducers: {
        setOnline: (state, action) => {
            state.userOnline = action.payload;
        },
    },
});
export const { setOnline } = userOnlineRD.actions;
export default userOnlineRD.reducer;
