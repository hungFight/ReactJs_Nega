import axios, { AxiosError, CancelTokenSource } from 'axios';
import refreshToken from '~/refreshToken/refreshToken';
import { CookieSetOptions } from 'universal-cookie';
import errorHandling from '../errorHandling/errorHandling';
import { PropsDataPosts } from '~/social_network/components/Header/layout/Home/Layout/DataPosts/interfacePosts';
class HomeAPI {
    getPosts = async (limit: number, offset: number, status: string): Promise<PropsDataPosts[]> => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.get('/SN/home/getPosts', {
                params: { limit, offset, status },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    setPost = async (formData: any) => {
        try {
            console.log(formData);

            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post('/SN/home/setPost', { ...formData });
            return res.data;
        } catch (error: any) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else {
                console.error('Error:', error);
            }
        }
    };
}

export default new HomeAPI();
