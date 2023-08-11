import { createSlice } from '@reduxjs/toolkit';
import { PropsRoomChat } from '~/restAPI/chatAPI';

type PropsReLoad = {
    people: number;
    userOnline: string[];
    roomChat: PropsRoomChat | undefined;
    session: string;
};
export interface PropsReloadRD {
    reload: PropsReLoad;
}
const initialState: PropsReLoad = {
    people: 0,
    userOnline: [],
    roomChat: undefined,
    session: '',
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
        setSession: (state, action: { payload: string }) => {
            state.session = action.payload;
        },
    },
});
export const { setPeople, setOnline, setRoomChat, setSession } = reloadPage.actions;
export default reloadPage.reducer;
