import { createSlice } from '@reduxjs/toolkit';
import { PropsRoomChat } from '~/restAPI/chatAPI';

type PropsReMessenger = {
    roomChat: PropsRoomChat | undefined;
};
export interface PropsReMessengerRD {
    messenger: PropsReMessenger;
}
const initialState: PropsReMessenger = {
    roomChat: undefined,
};
const messengerPage = createSlice({
    name: 'messenger',
    initialState: initialState,
    reducers: {
        setRoomChat: (state, action: { payload: PropsRoomChat }) => {
            state.roomChat = action.payload;
        },
    },
});
export const { setRoomChat } = messengerPage.actions;
export default messengerPage.reducer;
