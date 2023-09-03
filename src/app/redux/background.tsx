import { createSlice, current } from '@reduxjs/toolkit';

interface PropsBackGroundRedux {
    colorText: string;
    colorBg: number;
    chats: { id_room: string | undefined; id_other: string }[];
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
        onChats: (state, action: { payload: { id_room: string | undefined; id_other: string } }) => {
            let here = false;
            console.log(state.chats, ' state.chats');

            current(state).chats.forEach((c) => {
                if (c.id_other === action.payload.id_other) {
                    here = true;
                }
            });
            if (!here && current(state).chats.length <= 5) {
                state.chats.push(action.payload);
                console.log(state.chats.length, 'current(state.chat)');
            }
        },
        offChats: (state, action: { payload: { id_room: string | undefined; id_other: string }[] }) => {
            state.chats = action.payload;
        },
    },
});
export const { changeBg, changeText, onChats, offChats } = backgroundSlide.actions;
export default backgroundSlide.reducer;
