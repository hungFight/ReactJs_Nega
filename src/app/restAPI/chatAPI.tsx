import { PropsChat } from '~/Message/Messenger/Conversation/LogicConver';
import refreshToken from '~/refreshToken/refreshToken';
import CommonUtils from '~/utils/CommonUtils';
import errorHandling from './errorHandling/errorHandling';
import { AxiosError } from 'axios';
export interface PropsRoomChat {
    _id: any;
    id_us: string[];
    background: string;
    miss: number;
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
        text: { icon: string; t: string };
        imageOrVideos: { v: string; icon: string; _id: string }[];
        seenBy: string[];
        createdAt: string;
        // user: { avatar: any; fullName: string; gender: number; id: string };
    };
    createdAt: string;
}

class Messenger {
    send = async (formData: any) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<PropsRoomChat>('/messenger/send', formData);
            return res.data;
        } catch (error) {
            console.log(error);
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
        id_chat: { id_room: string | undefined; id_other: string },
        limit: number,
        offset: number,
        of?: boolean,
    ) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get<PropsChat>('/messenger/getChat', {
                params: { id_room: id_chat.id_room, id_other: id_chat.id_other, limit, offset, of },
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
            const res = await Axios.delete<boolean>('/messenger/delete', {
                params: { id_room },
            });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    undo = async (id_room: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post<boolean>('/messenger/undo', {
                params: { id_room },
            });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
}
export default new Messenger();
