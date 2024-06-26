import { AxiosError } from 'axios';
import refreshToken from '~/restAPI/refreshToken/refreshToken';
import errorHandling from '../errorHandling/errorHandling';
import { PropsFriends } from '~/Pages/social_network/components/Header/layout/MakingFriends/Friends';
import { Dispatch } from 'react';
import { AnyAction } from '@reduxjs/toolkit';
import { PropsDataStranger } from '~/Pages/social_network/components/Header/layout/MakingFriends/Strangers';
class PeopleRequest {
    public setFriend = async (dispatch: Dispatch<AnyAction>, id: string, per?: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post('/SN/people/setFriend', {
                params: { id_friend: id, per },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    public delete = async (dispatch: Dispatch<AnyAction>, id: string, kindOf?: string, per?: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post('/SN/people/deleteReq', { params: { id_req: id, kindOf: kindOf, per } });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    public setConfirm = async (dispatch: Dispatch<AnyAction>, id: string, kindOf?: string, per?: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.patch('/SN/people/setConfirm', {
                params: { id_req: id, kindOf: kindOf, per },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    public getStrangers = async (dispatch: Dispatch<AnyAction>, offset: number, limit: number, rel?: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.get<PropsDataStranger[]>('/SN/people/getStrangers', {
                params: {
                    limit,
                    rel,
                    offset,
                },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    public getFriends = async (dispatch: Dispatch<AnyAction>, offset: number, limit: number, type: string) => {
        // there are three type friend, requested, send request
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            console.log('loop friend');
            const res = await axiosJWTss.get<PropsFriends[]>('/SN/people/getFriends', {
                params: {
                    offset,
                    limit,
                    type,
                },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
}

export default new PeopleRequest();
