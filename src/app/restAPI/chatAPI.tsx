import refreshToken from '~/refreshToken/refreshToken';
import errorHandling from './errorHandling/errorHandling';
import { AxiosError } from 'axios';
import { PropsId_chats } from 'src/App';
import { PropsConversationCustoms, PropsOldSeenBy, PropsRoom, PropsRooms } from '~/typescript/messengerType';
import { PropsChat } from '~/Message/Messenger/Conversation/LogicConver';
export type PropsRoomsChat = PropsConversationCustoms & PropsRooms;
export type PropsRoomChat = PropsConversationCustoms & PropsRoom;

class Messenger {
    private domain: string = 'messenger';
    send = async (fda: any): Promise<PropsRoomChat> => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post(`/${this.domain}/sendChat`, fda);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    getRoom = async (limit: number, offset: number) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get<PropsRoomsChat[]>(`/${this.domain}/getRoom`, { params: { limit, offset } });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    getChat = async (id_chat: PropsId_chats, indexQuery: number, moreChat: boolean = false, indexRef: number, conversationId?: string): Promise<PropsChat> => {
        console.log(conversationId, 'conversationId', moreChat);

        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get(`/${this.domain}/getChat`, {
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
            return errorHandling(err);
        }
    };
    delete = async (id_room: string) => {
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
            return errorHandling(err);
        }
    };
    undo = async (id_room: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsChat>(`/${this.domain}/undo`, {
                params: { id_room },
            });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    delChatAll = async (data: { conversationId: string; dataId: string; roomId: string; filterId: string; userId: string }): Promise<Date> => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post(`/${this.domain}/delChatAll`, data);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    delChatSelf = async (data: { conversationId: string; dataId: string; roomId: string; filterId: string }): Promise<string | null> => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post(`/${this.domain}/delChatSelf`, data);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    updateChat = async (formData: {
        value: string;
        conversationId: string;
        update: string;
        dataId: string;
        userId: string;
        id_other: string;
        filesId: {
            id: string;
            width?: string | undefined;
            height?: string | undefined;
            type: string;
            tail: string;
            title?: string | undefined;
            id_sort?: string | undefined;
            id_client: string;
        }[];
        old_ids: string[];
        roomId: string;
        filterId: string;
    }): Promise<{
        value: string | undefined;
        imageOrVideos: {
            readonly _id: string;
            readonly icon: string;
            readonly type: string;
            readonly tail: string;
        }[];
        updatedAt: Date;
        updatedBy: string;
    } | null> => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post(`/${this.domain}/updateChat`, { ...formData });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    pin = async (chatId: string, userId: string, conversationId: string, latestChatId: string) => {
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
            return errorHandling(err);
        }
    };
    getPins = async (conversationId: string, pins: string[]) => {
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
            return errorHandling(err);
        }
    };
    deletePin = async (conversationId: string, pinId: string, roomId: string) => {
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
            return errorHandling(err);
        }
    };
    setBackground = async (data: {
        id_file: { id: string; type: string };
        conversationId: string;
    }): Promise<{
        operation: {
            userId: string;
            createdAt: string;
            title: string;
        };
        ids_file: {
            type: string;
            v: string;
            id: string;
            userId: string;
        };
    }> => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post(`/${this.domain}/setBackground`, { ...data });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    delBackground = async (conversationId: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post(`/${this.domain}/delBackground`, { conversationId });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    getConversationBalloon = async (conversationId: string[]) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post(`/${this.domain}/getConversationBalloon`, { conversationId });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    setSeenBy = async (param: PropsOldSeenBy[], conversationId: string): Promise<boolean> => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post(`/${this.domain}/setSeenBy`, { param, conversationId });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new Messenger();
