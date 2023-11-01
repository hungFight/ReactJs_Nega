import { createSlice } from '@reduxjs/toolkit';
import { PropsRoomChat } from '~/restAPI/chatAPI';

type PropsReLoad = {
    people: number;
    userOnline: string[];
    session: string;
    delIds:
        | {
              _id: string;
              deleted: {
                  id: string;
                  createdAt: string;
                  _id: string;
              }[];
          }
        | undefined;
};
export interface PropsReloadRD {
    reload: PropsReLoad;
}
const initialState: PropsReLoad = {
    people: 0,
    userOnline: [],
    session: '',
    delIds: undefined,
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

        setSession: (state, action: { payload: string }) => {
            state.session = action.payload;
        },
        setDelIds: (
            state,
            action: {
                payload:
                    | {
                          _id: string;
                          deleted: {
                              id: string;
                              createdAt: string;
                              _id: string;
                          }[];
                      }
                    | undefined;
            },
        ) => {
            console.log(action.payload, 'action.payload');

            state.delIds = action.payload;
        },
    },
});
export const { setPeople, setOnline, setSession, setDelIds } = reloadPage.actions;
export default reloadPage.reducer;
