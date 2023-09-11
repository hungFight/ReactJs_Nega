import { AxiosError } from 'axios';
import refreshToken from '~/refreshToken/refreshToken';
import errorHandling from '../errorHandling/errorHandling';
class PeopleRequest {
    setFriend = async (id: string, per?: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post('/SN/people/setFriend', {
                params: { id_friend: id, per },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    delete = async (id: string, kindOf?: string, per?: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post('/SN/people/deleteReq', { params: { id_req: id, kindOf: kindOf, per } });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    setConfirm = async (id: string, kindOf?: string, atInfor?: boolean) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.patch('/SN/people/setConfirm', {
                params: { id_req: id, kindOf: kindOf, atInfor },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    getStrangers = async (limit: number, rel?: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.get('/SN/people/getStrangers', {
                params: {
                    limit,
                    rel,
                },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    getFriends = async (offset: number, limit: number, type: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            console.log('loop friend');
            const res = await axiosJWTss.get('/SN/people/getFriends', {
                params: {
                    offset,
                    limit,
                    type,
                },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
}

export default new PeopleRequest();
