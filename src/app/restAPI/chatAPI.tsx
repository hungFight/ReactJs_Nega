import refreshToken from '~/refreshToken/refreshToken';
import errorHandling from './errorHandling/errorHandling';
import { AxiosError } from 'axios';
import { PropsId_chats } from 'src/App';
import { PropsConversationCustoms, PropsItemOperationsCon, PropsOldSeenBy, PropsRoom, PropsRooms } from '~/typescript/messengerType';
import { PropsChat } from '~/Message/Messenger/Conversation/LogicConver';
import { Dispatch } from 'react';
import { AnyAction } from '@reduxjs/toolkit';
export type PropsRoomsChat = PropsConversationCustoms & PropsRooms;
export type PropsRoomChat = PropsConversationCustoms & PropsRoom;

class Messenger {
    private domain: string = 'messenger';
    send = async (dispatch: Dispatch<AnyAction>, fda: any) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsRoomChat>(`/${this.domain}/sendChat`, fda);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    getRoom = async (dispatch: Dispatch<AnyAction>, limit: number, offset: number) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get<PropsRoomsChat[]>(`/${this.domain}/getRoom`, { params: { limit, offset } });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    getChat = async (dispatch: Dispatch<AnyAction>, id_chat: PropsId_chats, indexQuery: number, moreChat: boolean = false, indexRef: number, conversationId?: string) => {
        console.log(conversationId, 'conversationId', moreChat);

        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get<PropsChat>(`/${this.domain}/getChat`, {
                params: {
                    conversationId: id_chat.conversationId ? id_chat.conversationId : conversationId,
                    id_other: id_chat.id_other,
                    indexQuery,
                    moreChat,
                    indexRef,
                },
            });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    delete = async (dispatch: Dispatch<AnyAction>, id_room: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.delete<{
                _id: string;
                deleted: {
                    id: string;
                    createdAt: string;
                    _id: string;
                }[];
            }>(`/${this.domain}/delete`, {
                params: { id_room },
            });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    undo = async (dispatch: Dispatch<AnyAction>, id_room: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsChat>(`/${this.domain}/undo`, {
                params: { id_room },
            });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    delChatAll = async (dispatch: Dispatch<AnyAction>, data: { conversationId: string; dataId: string; roomId: string; filterId: string; userId: string }) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<string>(`/${this.domain}/delChatAll`, data);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    delChatSelf = async (dispatch: Dispatch<AnyAction>, data: { conversationId: string; dataId: string; roomId: string; filterId: string }) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<string | null>(`/${this.domain}/delChatSelf`, data);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    updateChat = async (
        dispatch: Dispatch<AnyAction>,
        formData: {
            value: string;
            conversationId: string;
            update: string;
            dataId: string;
            userId: string;
            id_other: string;
            filesId:
                | {
                      id: string;
                      width?: string | undefined;
                      height?: string | undefined;
                      type: string;
                      tail: string;
                      title?: string | undefined;
                      id_sort?: string | undefined;
                      id_client: string;
                  }[]
                | null;
            old_ids: string[];
            roomId: string;
            filterId: string;
        },
    ) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<{
                value: string | undefined;
                imageOrVideos: {
                    readonly _id: string;
                    readonly icon: string;
                    readonly type: string;
                    readonly tail: string;
                }[];
                updatedAt: Date;
                updatedBy: string;
            }>(`/${this.domain}/updateChat`, { ...formData });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    pin = async (dispatch: Dispatch<AnyAction>, chatId: string, userId: string, conversationId: string, latestChatId: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsChat>(`/${this.domain}/pin`, {
                chatId,
                userId,
                conversationId,
                latestChatId,
            });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    getPins = async (dispatch: Dispatch<AnyAction>, conversationId: string, pins: string[]) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get(`/${this.domain}/getPins`, {
                params: {
                    conversationId,
                    pins,
                },
            });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    deletePin = async (dispatch: Dispatch<AnyAction>, conversationId: string, pinId: string, roomId: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.delete(`/${this.domain}/deletePin`, {
                params: {
                    conversationId,
                    pinId,
                    roomId,
                },
            });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    setBackground = async (dispatch: Dispatch<AnyAction>, data: { id_file: { id: string; type: string }; conversationId: string; dataId: string }) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<{
                operation: PropsItemOperationsCon;
                ids_file: {
                    type: string;
                    v: string;
                    id: string;
                    userId: string;
                };
            }>(`/${this.domain}/setBackground`, { ...data });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    delBackground = async (dispatch: Dispatch<AnyAction>, conversationId: string, dataId: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsItemOperationsCon>(`/${this.domain}/delBackground`, { conversationId, dataId });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    getConversationBalloon = async (dispatch: Dispatch<AnyAction>, conversationId: string[]) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post(`/${this.domain}/getConversationBalloon`, { conversationId });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    setSeenBy = async (dispatch: Dispatch<AnyAction>, param: PropsOldSeenBy[], conversationId: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<boolean>(`/${this.domain}/setSeenBy`, { param, conversationId });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
}
export default new Messenger();
