import axios, { AxiosError } from 'axios';
import refreshToken from '~/refreshToken/refreshToken';
import Cookies from 'universal-cookie';
import { PropsUser, PropsUserPer } from 'src/App';
import CommonUtils from '~/utils/CommonUtils';
import errorHandling from './errorHandling/errorHandling';

export interface PropsParamsById {
    id?: boolean;
    fullName?: boolean | string;
    biography?: boolean | null;
    gender?: boolean | number;
    background?: boolean | null | string;
    avatar?: boolean | null | string;
    hobby?: boolean | null | string[];
    birthday?: boolean | null | string;
    schoolName?: boolean | null | string;
    address?: boolean | null | string;
    skill?: boolean | null | string[];
    birthDay?: boolean | string;
    occupation?: boolean | null | string;
    experience?: boolean | null;
    createdAt?: boolean | null;
    active?: boolean;
    firstPage?: boolean;
    secondPage?: boolean;
    thirdPage?: boolean;
    mores?: PropsParamsMores;
}
interface PropsParamsMores {
    followedAmount?: boolean;
    followingAmount?: boolean;
    friendAmount?: boolean;
    loverAmount?: boolean | string;
    position?: boolean;
    star?: boolean;
    language?: boolean | string[];
    visitor?: boolean;
    relationship?: boolean | string;
}
const cookies = new Cookies();
class HttpRequestUser {
    getById = async (id: string | string[], params: PropsParamsById, mores: PropsParamsMores, first?: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
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
    getByName = async (name: string, cateMore: string, searchMore: string, params: PropsParamsById) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post('/user/getByName', {
                name,
                cateMore,
                searchMore,
                params: params,
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    setLg = async (id: string, lg: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post('/user/setLg', {
                id: id,
                lg: lg,
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    setAs = async (as: number) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.patch('/user/setAs', {
                as: as,
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    getNewMes = async () => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get('/user/getNewMes');
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    delMessage = async () => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get('/user/delMessage');
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    changesOne = async (id: string, value: any, params: PropsParamsById) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.patch<string | number | Buffer>('/user/changesOne', {
                params: {
                    id,
                    params,
                    value,
                },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    changesMany = async (params: PropsParamsById, mores: PropsParamsMores) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.patch('/user/changesMany', {
                params: {
                    params,
                    mores,
                },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    follow = async (id: string, follow?: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.patch('/user/follow', {
                params: {
                    id,
                    follow,
                },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    Unfollow = async (id: string, unfollow: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.patch('/user/Unfollow', {
                params: {
                    id,
                    unfollow,
                },
            });
            console.log(res, 'sd');

            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    getMore = async (offset: number, limit: number) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get('/user/getMore', {
                params: {
                    offset,
                    limit,
                },
            });
            console.log(res, 'sd');

            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    setHistory = async (data: { id: string; avatar: string; fullName: string; nickName: string; gender: number }) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post('/user/setHistory', {
                params: {
                    data,
                },
            });
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    getHistory = async () => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get('/user/getHistory');
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new HttpRequestUser();
