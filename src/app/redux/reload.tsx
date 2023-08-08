import { createSlice } from '@reduxjs/toolkit';
import { PropsRoomChat } from '~/restAPI/chatAPI';

type PropsReLoad = {
    people: number;
    userOnline: string[];
    roomChat: PropsRoomChat | undefined;
};
export interface PropsReloadRD {
    reload: PropsReLoad;
}
const initialState: PropsReLoad = {
    people: 0,
    userOnline: [],
    roomChat: undefined,
};
const reloadPage = createSlice({
    name: 'reload',
    initialState: initialState,
    reducers: {
        setPeople: (state, action) => {
            state.people = action.payload;
        },

        setOnline: (state, action) => {
            state.userOnline = action.payload;
        },
        setRoomChat: (state, action: { payload: PropsRoomChat }) => {
            state.roomChat = action.payload;
        },
    },
});
export const { setPeople, setOnline, setRoomChat } = reloadPage.actions;
export default reloadPage.reducer;
