import { createSlice, current } from '@reduxjs/toolkit';

export interface InitialStateHideShow {
    setting: boolean;
    openProfile: {
        newProfile: string[];
        currentId?: string; // is used in personalPage's title
    };
    errorServer: {
        check: boolean;
        message?: string;
    };
}
const initialState: InitialStateHideShow = {
    setting: false,
    openProfile: {
        newProfile: [],
        currentId: '',
    },
    errorServer: {
        check: false,
        message: '',
    },
};
const hideShowSlice = createSlice({
    name: 'hideShow',
    initialState,
    reducers: {
        onSetting: (state) => {
            state.setting = true;
        },
        offSetting: (state) => {
            state.setting = false;
        },
        offAll: (state) => {
            state.setting = false;
        },
        setOpenProfile: (state, action: { payload: { newProfile: string[]; currentId?: string } }) => {
            state.openProfile = action.payload;
        },
        setNewProfile: (state, action: { payload: string[] }) => {
            state.openProfile.newProfile = action.payload;
        },
        setCurrentIdProfile: (state, action) => {
            state.openProfile.currentId = action.payload;
        },
        setTrueErrorServer: (state, action?: { payload: string }) => {
            state.errorServer.check = true;
            state.errorServer.message = action?.payload;
        },
        setFalseErrorServer: (state) => {
            state.errorServer.check = false;
            state.errorServer.message = '';
        },
    },
});
export const { onSetting, offSetting, setOpenProfile, offAll, setTrueErrorServer, setFalseErrorServer, setCurrentIdProfile, setNewProfile } = hideShowSlice.actions;
export default hideShowSlice.reducer;
