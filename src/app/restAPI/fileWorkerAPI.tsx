import refreshToken from '~/refreshToken/refreshToken';
import errorHandling from './errorHandling/errorHandling';
import { AxiosError } from 'axios';
import httpFile from '~/utils/httpFile';

class fileWorkerAPI {
    addFiles = async (formData: FormData): Promise<{ id: string; type: string; tail: string; title?: string }[]> => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await httpFile.post(`/addFiles`, formData);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    deleteFile = async (ids: string[]) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await httpFile.post<boolean>(`/deleteFile`, { ids });
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
    getFile = async (id: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await httpFile.get(`/getFile/${id}`);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new fileWorkerAPI();
