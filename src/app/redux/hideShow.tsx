import { createSlice, current } from '@reduxjs/toolkit';

export interface InitialStateHideShow {
    setting: boolean;
    personalPage: boolean;
    idUser: string[];
    chat: { id_room: string | undefined; id_other: string }[]; // id, if is is 0 id is id_room if 1 is id_other
    errorServer: {
        check: boolean;
        message?: string;
    };
}
const initialState: InitialStateHideShow = {
    setting: false,
    personalPage: false,
    chat: [],
    idUser: [],
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
        setIdUser: (state, action) => {
            state.idUser = action.payload;
        },
        setTrueErrorServer: (state, action?: { payload: string }) => {
            state.errorServer.check = true;
            state.errorServer.message = action?.payload;
        },
        setFalseErrorServer: (state) => {
            state.errorServer.check = false;
            state.errorServer.message = '';
        },
        onChat: (state, action: { payload: { id_room: string | undefined; id_other: string } }) => {
            let here = false;
            state.chat.forEach((c) => {
                if (c.id_other === action.payload.id_other) {
                    here = true;
                }
            });
            if (!here && state.chat.length <= 5) {
                state.chat.push(action.payload);
                console.log(state.chat.length, 'current(state.chat)');
            }
        },
        offChat: (state, action: { payload: { id_room: string | undefined; id_other: string }[] }) => {
            state.chat = action.payload;
        },
    },
});
export const {
    onSetting,
    offSetting,
    onPersonalPage,
    offPersonalPage,
    setIdUser,
    offAll,
    setTrueErrorServer,
    setFalseErrorServer,
    onChat,
    offChat,
} = hideShowSlice.actions;
export default hideShowSlice.reducer;
