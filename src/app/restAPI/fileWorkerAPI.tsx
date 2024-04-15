import refreshToken from '~/refreshToken/refreshToken';
import errorHandling from './errorHandling/errorHandling';
import { AxiosError } from 'axios';
import httpFile from '~/utils/httpFile';

class fileWorkerAPI {
    addFiles = async (formData: FormData): Promise<{ id: string; width?: string; height?: string; type: string; tail: string; title?: string; id_sort?: string; id_client: string }[]> => {
        try {
            // file, title?, id_sort?, old_id?(to delete old file)
            const Axios = refreshToken.axiosJWTsFIle();
            const res = await Axios.post(`/addFiles`, formData);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    deleteFileImg = async (ids: string[]): Promise<boolean> => {
        try {
            const Axios = refreshToken.axiosJWTsFIle();
            const res = await Axios.post<boolean>(`/deleteFileImg`, { ids });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    deleteFileVideo = async (ids: string[]) => {
        try {
            const Axios = refreshToken.axiosJWTsFIle();
            const res = await Axios.post<boolean>(`/deleteFileVideo`, { ids });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    getFileImg = async (id: string) => {
        try {
            const Axios = refreshToken.axiosJWTsFIle();
            const res = await Axios.get(`/getFileImg/${id}`);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    getFileVideo = async (id: string) => {
        try {
            const Axios = refreshToken.axiosJWTsFIle();
            const res = await Axios.get(`/getFileVideo/${id}`);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new fileWorkerAPI();
