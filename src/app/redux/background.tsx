import { createSlice, current } from '@reduxjs/toolkit';

interface PropsBackGroundRedux {
    colorText: string;
    colorBg: number;
    chats: { id_room?: string; id_other: string; balloon?: boolean; top?: number; left?: number }[];
}
export interface PropsBgRD {
    persistedReducer: {
        background: PropsBackGroundRedux;
    };
}
const initialState: PropsBackGroundRedux = {
    colorText: '#cbcbcb',
    colorBg: 1,
    chats: [],
};
const backgroundSlide = createSlice({
    name: 'background',
    initialState: initialState,
    reducers: {
        changeText: (state, action) => {
            state.colorText = action.payload;
        },
        changeBg: (state, action) => {
            state.colorBg = action.payload;
        },
        onChats: (state, action: { payload: { id_room?: string; id_other: string } }) => {
            let here = false;
            console.log(current(state.chats), ' state.chats');

            current(state).chats.forEach((c) => {
                if (c.id_other === action.payload.id_other && c.id_room === action.payload.id_room) {
                    here = true;
                }
            });
            if (!here && current(state).chats.length <= 5) {
                state.chats.push(action.payload);
                console.log(state.chats.length, 'current(state.chat)');
            }
        },
        offChats: (state, action: { payload: { id_room?: string; id_other: string }[] }) => {
            state.chats = action.payload;
        },
        setBalloon: (state, action: { payload: { id_other: string; id_room?: string } }) => {
            state.chats = state.chats.map((c) => {
                if (c.id_room === action.payload?.id_room && c.id_other === action.payload.id_other) {
                    c.balloon = true;
                    return c;
                }
                return c;
            });
        },
        setTopLeft: (state, action: { payload: { id_room?: string; id_other: string; top: number; left: number } }) => {
            state.chats = state.chats.map((ch) => {
                if (ch.id_room === action.payload?.id_room && ch.id_other === action.payload.id_other) {
                    ch.top = action.payload.top;
                    ch.left = action.payload.left;
                    return ch;
                }
                return ch;
            });
        },
    },
});
export const { changeBg, changeText, onChats, offChats, setBalloon, setTopLeft } = backgroundSlide.actions;
export default backgroundSlide.reducer;
