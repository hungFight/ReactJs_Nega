import refreshToken from '~/refreshToken/refreshToken';
import errorHandling from './errorHandling/errorHandling';
import { AxiosError } from 'axios';

class FileGriFS {
    getFile = async (id_file: string, type?: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get('/fileGridFS/getFile', { params: { id_file, type } });

            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            return errorHandling(err);
        }
    };
}
export default new FileGriFS();
