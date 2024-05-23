import axios, { AxiosError, CancelTokenSource } from 'axios';
import refreshToken from '~/restAPI/refreshToken/refreshToken';
import { CookieSetOptions } from 'universal-cookie';
import errorHandling from '../errorHandling/errorHandling';
import { PropsComments, PropsDataPosts, feel } from '~/social_network/components/Header/layout/Home/Layout/DataPosts/interfacePosts';
import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
class PostAPI {
    getPosts = async (dispatch: Dispatch<AnyAction>, limit: number, offset: number, status: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.get<PropsDataPosts[]>('/SN/home/post/getPosts', {
                params: { limit, offset, status },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    setPost = async (dispatch: Dispatch<AnyAction>, formData: any) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post<PropsDataPosts>('/SN/home/post/setPost', { ...formData });
            return res.data;
        } catch (error: any) {
            // if (axios.isCancel(error)) {
            //     console.log('Request canceled:', error.message);
            // } else {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
            // }
        }
    };
    sendComment = async (
        dispatch: Dispatch<AnyAction>,
        data: {
            postId: string;
            text: string;
            anonymousC: boolean;
            emos: {
                act: number;
                onlyEmo: {
                    id: number;
                    icon: string;
                    id_user: string[];
                }[];
            };
            commentId?: string;
            repliedId?: string;
        },
    ) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post<PropsComments>('/SN/home/post/sendComment', { ...data });
            return res.data;
        } catch (error: any) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    setEmotion = async (
        dispatch: Dispatch<AnyAction>,
        data: { _id: string; index: number | null; id_user: string; state: string; oldIndex?: number; id_comment?: string; groupCommentId?: string },
    ) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post<feel>('/SN/home/post/setEmotion', { ...data });
            return res.data;
        } catch (error: any) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    getComments = async (dispatch: Dispatch<AnyAction>, postId: string, offset: number, limit: number) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post<PropsComments[]>('/SN/home/post/getComments', { postId, offset, limit });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
}

export default new PostAPI();
