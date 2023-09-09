import axios, { AxiosError } from 'axios';
import { NavigateFunction } from 'react-router-dom';
import { CookieSetOptions } from 'universal-cookie/cjs/types';
import refreshToken from '~/refreshToken/refreshToken';
import http from '~/utils/http';
import errorHandling from '../errorHandling/errorHandling';
import Cookies from 'js-cookie';

class AuthRequest {
    postLogin = async (
        params: { nameAccount: string; password: string },
        setCookies?: (name: 'tks' | 'k_user', value: any, options?: CookieSetOptions | undefined) => void,
    ) => {
        try {
            const res = await http.post('/account/login', { params });
            console.log(res, setCookies);

            if (res.data) {
                const { id, accessToken } = res.data;
                const token = 'Bearer ' + accessToken;
                if (setCookies) {
                    console.log('cookie', setCookies);

                    setCookies('tks', token, {
                        path: '/',
                        secure: false,
                        sameSite: 'strict',
                        expires: new Date(new Date().getTime() + 30 * 86409000),
                    });
                    delete res.data?.accessToken;
                    setCookies('k_user', id, {
                        path: '/',
                        secure: false,
                        sameSite: 'strict',
                        expires: new Date(new Date().getTime() + 30 * 86409000),
                    });
                }
            }
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    subLogin = async (nameAccount: string, password: string, other?: string, id?: string) => {
        try {
            const res = await http.post('/account/subLogin', { nameAccount, password, id });
            if (other)
                if (res.data) {
                    const { id, accessToken } = res.data;
                    const token = 'Bearer ' + accessToken;
                    console.log('cookie');

                    Cookies.set('tks', token, {
                        path: '/',
                        secure: false,
                        sameSite: 'strict',
                        expires: new Date(new Date().getTime() + 30 * 86409000),
                    });
                    delete res.data?.accessToken;
                    Cookies.set('k_user', id, {
                        path: '/',
                        secure: false,
                        sameSite: 'strict',
                        expires: new Date(new Date().getTime() + 30 * 86409000),
                    });
                }
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    postSendOTP = async (params: { phoneMail: string | number }) => {
        try {
            const path = 'otp/send';
            const response = await http.post(path, { params });
            return response;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    postVerifyOTP = async (params: { phoneMail: string; otp: string }) => {
        try {
            const path = 'verify/otp';
            const res = await http.post(path, { params });
            console.log('rés', res);

            return res;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
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
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };

    postLogOut = async () => {
        try {
            const axiosJWTss: any = refreshToken.axiosJWTs();
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
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new AuthRequest();
