import axios, { AxiosError } from 'axios';
import { NavigateFunction } from 'react-router-dom';
import { CookieSetOptions } from 'universal-cookie/cjs/types';
import refreshToken from '~/refreshToken/refreshToken';
import http from '~/utils/http';
import errorHandling from '../errorHandling/errorHandling';

class AuthRequest {
    postLogin = async (
        params: { nameAccount: string; password: string },
        setCookies: (name: 'tks' | 'k_user', value: any, options?: CookieSetOptions | undefined) => void,
    ) => {
        try {
            const res = await http.post('/account/login', { params });
            console.log(res);

            if (res.data.user) {
                const { id, accessToken } = res.data.user;
                const token = 'Bearer ' + accessToken;
                setCookies('tks', token, {
                    path: '/',
                    secure: false,
                    sameSite: 'strict',
                    expires: new Date(new Date().getTime() + 30 * 86409000),
                });
                delete res.data?.user.accessToken;
                setCookies('k_user', id, {
                    path: '/',
                    secure: false,
                    sameSite: 'strict',
                    expires: new Date(new Date().getTime() + 30 * 86409000),
                });
            }
            return res.data;
        } catch (error) {
            console.log('login', error);
        }
    };
    postSendOTP = async (params: { phoneMail: string | number }) => {
        try {
            const path = 'otp/send';
            const response = await http.post(path, { params });
            return response;
        } catch (error) {
            console.log('sendOTP', error);
        }
    };
    postVerifyOTP = async (params: { phoneMail: string; otp: string }) => {
        try {
            const path = 'verify/otp';
            const res = await http.post(path, { params });
            console.log('rés', res);

            return res;
        } catch (error) {
            console.log('sendOTP', error);
        }
    };
    postRegister = async (params: {
        name: string;
        phoneMail: string | Number;
        password: string;
        gender: number | null;
        date: string;
    }) => {
        try {
            const res = await http.post('/account/register', { params });
            return res?.data;
        } catch (error) {
            console.log('register', error);
        }
    };

    postLogOut = async (accessToken: string) => {
        console.log(accessToken, '123');

        try {
            const axiosJWTss: any = refreshToken.axiosJWTs(accessToken);
            const data = await axiosJWTss.post('/account/logout');
            if (data.data.status === 200) return true;
            return false;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    refreshToken = async () => {
        try {
            const res = await http.post('/account/refresh', {
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            console.log(error, 'refresh');
        }
    };
}
export default new AuthRequest();
