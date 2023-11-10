import { PropsChat } from '~/Message/Messenger/Conversation/LogicConver';
import refreshToken from '~/refreshToken/refreshToken';
import CommonUtils from '~/utils/CommonUtils';
import errorHandling from './errorHandling/errorHandling';
import { AxiosError } from 'axios';
import { PropsId_chats } from 'src/App';
export interface PropsRoomChat {
    _id: string;
    id_us: string[];
    background: string;
    miss?: number;
    users: {
        id: string;
        avatar: any;
        fullName: string;
        gender: number;
    }[];
    user: {
        id: string;
        avatar: any;
        fullName: string;
        gender: number;
    };
    room: {
        _id: string;
        id: string;
        text: { icon: string; t: string };
        imageOrVideos: { v: string; icon: string; _id: string }[];
        seenBy: string[];
        createdAt: string;
        secondary?: string;
    };
    deleted: {
        id: string;
        createdAt: string;
    }[];
    createdAt: string;
}

class Messenger {
    send = async (formData: any) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsRoomChat>('/messenger/sendChat', formData);
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
            res.data.map((sc) => {
                sc.users.map((us) => {
                    if (us?.avatar) us.avatar = CommonUtils.convertBase64(us.avatar);
                });
                // if (sc.room.user?.avatar) sc.room.user.avatar = CommonUtils.convertBase64(sc.room.user.avatar);
            });

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
    delChatAll = async (conversationId: string, chatId: string, userId: string, id_file: string[]) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsChat>('/messenger/delChatAll', {
                conversationId,
                chatId,
                userId,
                id_file,
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
    updateChat = async (formData: FormData) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsChat>('/messenger/updateChat', formData);
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
}
export default new Messenger();
