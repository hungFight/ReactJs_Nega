import { createSlice, current } from '@reduxjs/toolkit';

interface PropsBackGroundRedux {
    colorText: string;
    colorBg: number;
}
export interface PropsBgRD {
    persistedReducer: {
        background: PropsBackGroundRedux;
    };
}
const initialState: PropsBackGroundRedux = {
    colorText: '#cbcbcb',
    colorBg: 1,
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
    },
});
export const { changeBg, changeText } = backgroundSlide.actions;
export default backgroundSlide.reducer;
