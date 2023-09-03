import { createSlice, current } from '@reduxjs/toolkit';

export interface InitialStateHideShow {
    setting: boolean;
    personalPage: boolean;
    openProfile: {
        newProfile: string[];
        currentId: string;
    };
    errorServer: {
        check: boolean;
        message?: string;
    };
}
const initialState: InitialStateHideShow = {
    setting: false,
    personalPage: false,
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
        onPersonalPage: (state) => {
            state.personalPage = true;
        },
        offPersonalPage: (state) => {
            state.personalPage = false;
        },
        offAll: (state) => {
            state.personalPage = false;
            state.setting = false;
        },
        setOpenProfile: (state, action) => {
            state.openProfile = action.payload;
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
export const {
    onSetting,
    offSetting,
    onPersonalPage,
    offPersonalPage,
    setOpenProfile,
    offAll,
    setTrueErrorServer,
    setFalseErrorServer,
    setCurrentIdProfile,
} = hideShowSlice.actions;
export default hideShowSlice.reducer;
