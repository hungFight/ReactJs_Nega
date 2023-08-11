import axios, { AxiosError } from 'axios';
import refreshToken from '~/refreshToken/refreshToken';
import Cookies from 'universal-cookie';
import { PropsUser, PropsUserPer } from 'src/App';
import CommonUtils from '~/utils/CommonUtils';
import errorHandling from './errorHandling/errorHandling';

export interface PropsParamsById {
    id?: string;
    fullName?: string;
    nickName?: string | null;
    status?: string | null;
    gender?: string;
    background?: string | null;
    avatar?: string | null;
    admin?: string;
    hobby?: string | null;
    strengths?: string | null;
    address?: string | null;
    skill?: string | null;
    birthDay?: string;
    occupation?: string | null;
    experience?: string | null;
    createdAt?: string | null;
    sn?: string;
    l?: string;
    w?: string;
    as?: string;
    more?: PropsParamsMores;
}
interface PropsParamsMores {
    position?: string;
    star?: string;
    love?: string;
    visit?: string;
    follow?: string;
    following?: string;
}
const cookies = new Cookies();
class HttpRequestUser {
    getById = async (
        token: string,
        id: string | string[],
        params: PropsParamsById,
        mores: PropsParamsMores,
        first?: string,
    ) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.post<PropsUserPer[] | PropsUser>('/user/getById', {
                id: id,
                mores,
                first,
                params: params,
            });
            console.log(res, 'res');
            if (Array.isArray(res.data)) {
                return res.data.map((dt) => {
                    if (dt.avatar) {
                        const av = CommonUtils.convertBase64(dt.avatar);
                        dt.avatar = av;
                        console.log(res, 'sss');
                    }
                    if (dt.background) {
                        const av = CommonUtils.convertBase64(dt.background);
                        dt.background = av;
                    }
                    return dt;
                });
            } else {
                if (res?.data.avatar) {
                    const av = CommonUtils.convertBase64(res.data.avatar);
                    res.data.avatar = av;
                }
                if (res?.data.background) {
                    const av = CommonUtils.convertBase64(res.data.background);
                    res.data.background = av;
                }
                return res.data;
            }
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    getByName = async (token: string, name: string, cateMore: string, searchMore: string, params: PropsParamsById) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.post('/user/getByName', {
                name,
                cateMore,
                searchMore,
                params: params,
            });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    setLg = async (token: string, id: string, lg: string) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.post('/user/setLg', {
                id: id,
                lg: lg,
            });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    setAs = async (token: string, as: number) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.patch('/user/setAs', {
                as: as,
            });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    getNewMes = async (token: string) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.get('/user/getNewMes');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    delMessage = async (token: string) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.get('/user/delMessage');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    changesOne = async (token: string, id: string, value: any, params: PropsParamsById) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.patch('/user/changesOne', {
                params: {
                    id,
                    params,
                    value,
                },
            });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    follow = async (token: string, id: string, follow?: string) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.patch('/user/follow', {
                params: {
                    id,
                    follow,
                },
            });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    Unfollow = async (token: string, id: string, unfollow: string) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.patch('/user/Unfollow', {
                params: {
                    id,
                    unfollow,
                },
            });
            console.log(res, 'sd');

            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    getMore = async (token: string, offset: number, limit: number) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.get('/user/getMore', {
                params: {
                    offset,
                    limit,
                },
            });
            console.log(res, 'sd');

            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    setHistory = async (
        token: string,
        data: { id: string; avatar: string; fullName: string; nickName: string; gender: number },
    ) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.post('/user/setHistory', {
                params: {
                    data,
                },
            });
        } catch (error) {
            console.log(error);
        }
    };
    getHistory = async (token: string) => {
        try {
            const Axios = refreshToken.axiosJWTs(token);
            const res = await Axios.get('/user/getHistory');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
}
export default new HttpRequestUser();
