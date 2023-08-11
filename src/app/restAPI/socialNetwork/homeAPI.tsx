import axios, { AxiosError, CancelTokenSource } from 'axios';
import refreshToken from '~/refreshToken/refreshToken';
import { CookieSetOptions } from 'universal-cookie';
import errorHandling from '../errorHandling/errorHandling';
class HomeAPI {
    getPosts = async (accessToken: string, limit: number, offset: number, status: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs(accessToken);
            const res = await axiosJWTss.get('/SN/home/getPosts', {
                params: { limit, offset, status },
            });
            return res.data;
        } catch (error) {
            const err: any = error as AxiosError;
            return errorHandling(err);
        }
    };
    setPost = async (accessToken: string, formData: any) => {
        try {
            console.log(formData);

            const axiosJWTss = refreshToken.axiosJWTs(accessToken);
            const res = await axiosJWTss.post('/SN/home/setPost', formData);
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
