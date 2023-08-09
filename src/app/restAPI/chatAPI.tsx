import { PropsChat } from '~/Message/Send/LogicConver';
import refreshToken from '~/refreshToken/refreshToken';
import CommonUtils from '~/utils/CommonUtils';
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

class SendChat {
    send = async (token: string, formData: any) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.post<PropsRoomChat>('/SN/sendChat/send', formData);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    getRoom = async (token: string, limit: number, offset: number) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.get<PropsRoomChat[]>('/SN/sendChat/getRoom', { params: { limit, offset } });
            res.data.map((sc) => {
                sc.users.map((us) => {
                    if (us?.avatar) us.avatar = CommonUtils.convertBase64(us.avatar);
                });
                // if (sc.room.user?.avatar) sc.room.user.avatar = CommonUtils.convertBase64(sc.room.user.avatar);
            });

            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    getChat = async (
        token: string,
        id_chat: { id_room: string | undefined; id_other: string },
        limit: number,
        offset: number,
        of?: boolean,
    ) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.get<PropsChat>('/SN/sendChat/getChat', {
                params: { ...id_chat, limit, offset, of },
            });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
}
export default new SendChat();
