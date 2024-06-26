import { createSlice, current } from '@reduxjs/toolkit';
import { PropsRoomChat } from '~/restAPI/chatAPI';

interface PropsRoomsChat {
    chats: { conversationId?: string; id_other: string; balloon?: boolean; top?: number; left?: number }[];
    balloon: string[];
    established: boolean;
}
export interface PropsRoomsChatRD {
    persistedReducer: {
        roomsChat: PropsRoomsChat;
    };
}
const initialState: PropsRoomsChat = {
    chats: [],
    balloon: [],
    established: false,
};
const roomsChatPage = createSlice({
    name: 'roomsChat',
    initialState: initialState,
    reducers: {
        onChats: (state, action: { payload: { conversationId?: string; id_other: string } }) => {
            let here = false;
            console.log(state.chats, ' state.chats');

            state.chats.forEach((c) => {
                if (c.id_other === action.payload.id_other && c.conversationId === action.payload.conversationId) {
                    here = true;
                }
            });
            if (!here && state.chats.length <= 5) {
                state.chats = [...state.chats, action.payload];
                console.log(state.chats.length, 'current(state.chat)');
            }
        },
        offChats: (state, action: { payload: { conversationId?: string; id_other: string }[] }) => {
            state.chats = action.payload;
        },
        setBalloon: (state, action: { payload: string }) => {
            let check = false;
            state.balloon.map((c) => {
                if (c === action.payload) {
                    check = true;
                }
            });
            if (!check && state.balloon.length < 6) {
                state.balloon.push(action.payload);
                state.established = true;
            }
        },
        removeBalloon: (state, action: { payload: string }) => {
            state.established = false;
            state.balloon = state.balloon.filter((b) => b !== action.payload);
        },
        setTopLeft: (state, action: { payload: { conversationId?: string; id_other: string; top: number; left: number } }) => {
            state.chats = state.chats.map((ch) => {
                if (ch.conversationId === action.payload?.conversationId && ch.id_other === action.payload.id_other) {
                    ch.top = action.payload.top;
                    ch.left = action.payload.left;
                    return ch;
                }
                return ch;
            });
        },
    },
});
export const { onChats, offChats, setBalloon, setTopLeft, removeBalloon } = roomsChatPage.actions;
export default roomsChatPage.reducer;
