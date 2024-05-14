import axios, { AxiosError } from 'axios';
import refreshToken from '~/refreshToken/refreshToken';
import Cookies from 'universal-cookie';
import { PropsUser, PropsUserPer } from 'src/App';
import CommonUtils from '~/utils/CommonUtils';
import errorHandling from './errorHandling/errorHandling';
import { Dispatch } from 'react';
import { AnyAction } from '@reduxjs/toolkit';

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
interface PropsMoresGetting {
    position?: boolean;
    star?: boolean;
    loverAmount?: boolean;
    friendAmount?: boolean;
    visitorAmount?: boolean;
    followedAmount?: boolean;
    followingAmount?: boolean;
    relationship?: boolean;
    language?: boolean;
    privacy: boolean;
    createdAt?: boolean;
}
type PropsErrorCode = 'NeGA_off' | 'NeGA_ExcessiveRequest' | null;
class HttpRequestUser {
    getById = async (dispatch: Dispatch<AnyAction>, id: string | string[], params: PropsParamsById, mores: PropsMoresGetting, first?: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post('/user/getById', {
                id: id,
                first,
                params: params,
                mores,
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    getByName = async (dispatch: Dispatch<AnyAction>, name: string, cateMore: string, searchMore: string, params: PropsParamsById) => {
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
            return errorHandling(err, dispatch);
        }
    };
    setLg = async (dispatch: Dispatch<AnyAction>, id: string, lg: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post('/user/setLg', {
                id: id,
                lg: lg,
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    setActive = async (dispatch: Dispatch<AnyAction>, active: boolean) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.patch('/user/setActive', {
                active,
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    getNewMes = async (dispatch: Dispatch<AnyAction>) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get('/user/getNewMes');
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    delMessage = async (dispatch: Dispatch<AnyAction>) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get('/user/delMessage');
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    delSubAccount = async (dispatch: Dispatch<AnyAction>, id: string, phoneOrEmail: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post('/user/delSubAccount', { id, phoneOrEmail });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    changesOne = async (
        dispatch: Dispatch<AnyAction>,
        id: string,
        params: PropsParamsById,
        value?: any,
    ): Promise<
        | {
              loverData:
                  | {
                        id: string;
                        userId: string;
                        idIsLoved: string;
                        createdAt: Date;
                        updatedAt: Date;
                    }
                  | undefined;
              count_loves: number;
          }
        | string
        | boolean
        | PropsErrorCode
    > => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.patch('/user/changesOne', {
                params: {
                    id,
                    params,
                    value,
                },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    changesMany = async (
        dispatch: Dispatch<AnyAction>,
        params: PropsParamsById,
        mores: PropsParamsMores,
        privacy: {
            [position: string]: string;
            address: string;
            birthday: string;
            relationship: string;
            gender: string;
            schoolName: string;
            occupation: string;
            hobby: string;
            skill: string;
            language: string;
            subAccount: string;
        },
    ) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.patch('/user/changesMany', {
                params: {
                    params,
                    mores,
                    privacy,
                },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    follow = async (dispatch: Dispatch<AnyAction>, id: string, follow?: string) => {
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
            return errorHandling(err, dispatch);
        }
    };
    Unfollow = async (dispatch: Dispatch<AnyAction>, id: string, unfollow: string) => {
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
            return errorHandling(err, dispatch);
        }
    };
    getMore = async (dispatch: Dispatch<AnyAction>, offset: number, limit: number) => {
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
            return errorHandling(err, dispatch);
        }
    };
    setHistory = async (dispatch: Dispatch<AnyAction>, data: { id: string; avatar: string; fullName: string; gender: number }) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.post('/user/setHistory', {
                params: {
                    data,
                },
            });
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    getHistory = async (dispatch: Dispatch<AnyAction>) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get('/user/getHistory');
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    getActiveStatus = async (dispatch: Dispatch<AnyAction>, id_other?: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get('/user/getActiveStatus', { params: { id_other } });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
}
export default new HttpRequestUser();
