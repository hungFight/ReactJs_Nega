import { createSlice } from '@reduxjs/toolkit';
import { PropsRoomChat } from '~/restAPI/chatAPI';
export type PropsSessionCode = 'NeGA_off' | 'NeGA_ExcessiveRequest' | null;
type PropsReLoad = {
    people: number;
    session: PropsSessionCode;
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
    session: null, // display server error
    delIds: undefined, // delete in chat
};
const reloadPage = createSlice({
    name: 'reload',
    initialState: initialState,
    reducers: {
        setPeople: (state, action) => {
            state.people = action.payload;
        },
        setSession: (state, action: { payload: PropsSessionCode }) => {
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
