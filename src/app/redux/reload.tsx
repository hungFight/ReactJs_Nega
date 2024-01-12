import { createSlice } from '@reduxjs/toolkit';
import { PropsRoomChat } from '~/restAPI/chatAPI';

type PropsReLoad = {
    people: number;
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
    people: 0, // reload page people
    session: '', // display server error
    delIds: undefined, // delete in chat
};
const reloadPage = createSlice({
    name: 'reload',
    initialState: initialState,
    reducers: {
        setPeople: (state, action) => {
            state.people = action.payload;
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
            state.delIds = action.payload;
        },
    },
});
export const { setPeople, setSession, setDelIds } = reloadPage.actions;
export default reloadPage.reducer;
