import { createSlice } from '@reduxjs/toolkit';

export interface PropsReloadRD {
    people: number;
    userOnline: string[];
    roomChat: boolean;
}
const initialState: PropsReloadRD = {
    people: 0,
    userOnline: [],
    roomChat: false,
};
const reloadPage = createSlice({
    name: 'reload',
    initialState: initialState,
    reducers: {
        people: (state, action) => {
            state.people = action.payload;
        },

        online: (state, action) => {
            state.userOnline = action.payload;
        },
        reRoomChat: (state) => {
            state.roomChat = !state.roomChat;
        },
    },
});
export const { people, online, reRoomChat } = reloadPage.actions;
export default reloadPage.reducer;
