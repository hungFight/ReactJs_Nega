import refreshToken from '~/restAPI/refreshToken/refreshToken';
import errorHandling from './errorHandling/errorHandling';
import { AxiosError } from 'axios';
import httpFile from '~/utils/httpFile';
import { Dispatch } from 'react';
import { AnyAction } from '@reduxjs/toolkit';

class fileWorkerAPI {
    addFiles = async (dispatch: Dispatch<AnyAction>, formData: FormData) => {
        try {
            // file, title?, id_sort?, old_id?(to delete old file)
            const Axios = refreshToken.axiosJWTsFIle();
            const res = await Axios.post<{ id: string; width?: string; height?: string; type: string; tail: string; title?: string; id_sort?: string; id_client: string }[]>(`/addFiles`, formData);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    deleteFileImg = async (dispatch: Dispatch<AnyAction>, ids: string[]) => {
        try {
            const Axios = refreshToken.axiosJWTsFIle();
            const res = await Axios.post<boolean>(`/deleteFileImg`, { ids });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    deleteFileVideo = async (dispatch: Dispatch<AnyAction>, ids: string[]) => {
        try {
            const Axios = refreshToken.axiosJWTsFIle();
            const res = await Axios.post<boolean>(`/deleteFileVideo`, { ids });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    getFileImg = async (dispatch: Dispatch<AnyAction>, id: string) => {
        try {
            const Axios = refreshToken.axiosJWTsFIle();
            const res = await Axios.get(`/getFileImg/${id}`);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
    getFileVideo = async (dispatch: Dispatch<AnyAction>, id: string) => {
        try {
            const Axios = refreshToken.axiosJWTsFIle();
            const res = await Axios.get(`/getFileVideo/${id}`);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err, dispatch);
        }
    };
}
export default new fileWorkerAPI();
