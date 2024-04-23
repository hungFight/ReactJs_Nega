import { PropsChat, PropsConversationCustoms, PropsImageOrVideos, PropsRooms } from '~/Message/Messenger/Conversation/LogicConver';
import refreshToken from '~/refreshToken/refreshToken';
import CommonUtils from '~/utils/CommonUtils';
import errorHandling from './errorHandling/errorHandling';
import { AxiosError } from 'axios';
import { PropsId_chats } from 'src/App';
export type PropsRoomChat = PropsConversationCustoms & PropsRooms;

class Messenger {
    send = async (fda: any) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsRoomChat>('/messenger/sendChat', fda);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    getRoom = async (limit: number, offset: number) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get<PropsRoomChat[]>('/messenger/getRoom', { params: { limit, offset } });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    getChat = async (id_chat: PropsId_chats, limit: number, offset: number, moreChat: boolean = false, indexRef: number, conversationId?: string, id_room?: string): Promise<PropsChat> => {
        console.log(conversationId, 'conversationId', moreChat);

        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get('/messenger/getChat', {
                params: {
                    conversationId: id_chat.conversationId ? id_chat.conversationId : conversationId,
                    id_other: id_chat.id_other,
                    limit,
                    offset,
                    moreChat,
                    indexRef,
                    id_room,
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
            }>('/messenger/delete', {
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
            const res = await Axios.post<PropsChat>('/messenger/undo', {
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
            const res = await Axios.post('/messenger/delChatAll', data);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    delChatSelf = async (data: { conversationId: string; dataId: string; roomId: string; filterId: string }): Promise<string | null> => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post('/messenger/delChatSelf', data);
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
        _id: string;
        id: string;
        text: {
            t: string;
            icon: string;
        };
        delete?: string;
        update?: string;
        secondary?: string;
        length?: number;
        imageOrVideos: PropsImageOrVideos[];
        sending?: boolean;
        seenBy: string[];
        updatedAt: string;
        createdAt: string;
    } | null> => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post('/messenger/updateChat', { ...formData });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    pin = async (chatId: string, userId: string, conversationId: string, latestChatId: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsChat>('/messenger/pin', {
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
            const res = await Axios.get('/messenger/getPins', {
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
            const res = await Axios.delete('/messenger/deletePin', {
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
    setBackground = async (data: { latestChatId: string; id_file: { id: string; type: string }; conversationId: string }) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsChat>('/messenger/setBackground', { ...data });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    delBackground = async (conversationId: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post('/messenger/delBackground', { conversationId });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    getConversationBalloon = async (conversationId: string[]) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post('/messenger/getConversationBalloon', { conversationId });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new Messenger();
