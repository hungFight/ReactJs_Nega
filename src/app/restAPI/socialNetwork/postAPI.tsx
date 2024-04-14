import axios, { AxiosError, CancelTokenSource } from 'axios';
import refreshToken from '~/refreshToken/refreshToken';
import { CookieSetOptions } from 'universal-cookie';
import errorHandling from '../errorHandling/errorHandling';
import { PropsComments, PropsDataPosts, feel } from '~/social_network/components/Header/layout/Home/Layout/DataPosts/interfacePosts';
class PostAPI {
    getPosts = async (limit: number, offset: number, status: string): Promise<PropsDataPosts[]> => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.get('/SN/home/post/getPosts', {
                params: { limit, offset, status },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    setPost = async (formData: any): Promise<PropsDataPosts> => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post('/SN/home/post/setPost', { ...formData });
            return res.data;
        } catch (error: any) {
            // if (axios.isCancel(error)) {
            //     console.log('Request canceled:', error.message);
            // } else {
            const err: any = error as AxiosError;
            return errorHandling(err);
            // }
        }
    };
    sendComment = async (data: {
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
    }) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post('/SN/home/post/sendComment', { ...data });
            return res.data;
        } catch (error: any) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    setEmotion = async (data: { _id: string; index: number | null; id_user: string; state: string; oldIndex?: number; id_comment?: string }): Promise<feel> => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post('/SN/home/post/setEmotion', { ...data });
            return res.data;
        } catch (error: any) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    getComments = async (postId: string, offset: number, limit: number): Promise<PropsComments[]> => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post('/SN/home/post/getComments', { postId, offset, limit });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
}

export default new PostAPI();
