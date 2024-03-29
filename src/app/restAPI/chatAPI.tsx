import {
    PropsChat,
    PropsConversationCustoms,
    PropsImageOrVideos,
    PropsRoom,
} from '~/Message/Messenger/Conversation/LogicConver';
import refreshToken from '~/refreshToken/refreshToken';
import CommonUtils from '~/utils/CommonUtils';
import errorHandling from './errorHandling/errorHandling';
import { AxiosError } from 'axios';
import { PropsId_chats } from 'src/App';
export type PropsRoomChat = PropsConversationCustoms & PropsRoom;

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
    getChat = async (
        id_chat: PropsId_chats,
        limit: number,
        offset: number,
        moreChat: boolean = false,
        id_room?: string,
    ) => {
        console.log(id_room, 'id_room', moreChat);

        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get<PropsChat>('/messenger/getChat', {
                params: {
                    id_room: id_chat.id_room ? id_chat.id_room : id_room,
                    id_other: id_chat.id_other,
                    limit,
                    offset,
                    moreChat,
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
    delChatAll = async (conversationId: string, chatId: string, userId: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsChat>('/messenger/delChatAll', {
                conversationId,
                chatId,
                userId,
            });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    delChatSelf = async (conversationId: string, chatId: string, userId: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsChat>('/messenger/delChatSelf', {
                conversationId,
                chatId,
                userId,
            });
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
        id_chat: string;
        userId: string;
        id_other: string;
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
    setBackground = async (formData: FormData) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsChat>('/messenger/setBackground', formData);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    delBackground = async (conversationId: string, id_file: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsChat>('/messenger/delBackground', { conversationId, id_file: [id_file] });
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
