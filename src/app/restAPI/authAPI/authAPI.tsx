import axios, { AxiosError } from 'axios';
import { NavigateFunction } from 'react-router-dom';
import { CookieSetOptions } from 'universal-cookie/cjs/types';
import refreshToken from '~/restAPI/refreshToken/refreshToken';
import http from '~/utils/http';
import errorHandling from '../errorHandling/errorHandling';
import Cookies from 'js-cookie';
import { PropsUser } from '~/typescript/userType';

class AuthRequest {
    public postLogin = async (params: { nameAccount: string; password: string }) => {
        try {
            const res = await http.post<PropsUser>('/account/login', { params });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    public subLogin = async (nameAccount: string, password: string, id?: string) => {
        try {
            const res = await http.post('/account/subLogin', { nameAccount, password, id });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    public postSendOTP = async (params: { phoneMail: string | number }): Promise<{ status: number; message: string }> => {
        const path = 'otp/send';
        const response = await http.post(path, { params }).then((data) => {
            return data.data;
        });
        return response;
    };
    public postVerifyOTP = async (params: { phoneMail: string; otp: string }): Promise<{ status: number; message: string; acc: number }> => {
        const path = 'verify/otp';
        const res = await http.post(path, { params }).then((data) => data.data);
        return res;
    };
    public postRegister = async (params: { name: string; phoneMail: string | Number; password: string; gender: number | null; date: string }) => {
        try {
            const res = await http.post('/account/register', { params });
            return res?.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };

    public postLogOut = async () => {
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
    public refreshToken = async () => {
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
