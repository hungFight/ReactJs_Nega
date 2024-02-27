import refreshToken from '~/refreshToken/refreshToken';
import errorHandling from './errorHandling/errorHandling';
import { AxiosError } from 'axios';
import httpFile from '~/utils/httpFile';

class fileWorkerAPI {
    getFile = async (id: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await httpFile.get(`/files/getFile/${id}`);
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new fileWorkerAPI();
