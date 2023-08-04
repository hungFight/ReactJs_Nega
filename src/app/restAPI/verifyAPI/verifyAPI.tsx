import { AxiosError } from 'axios';
import http from '~/utils/http';

class VerifyAPI {
    login = async () => {
        try {
            const res = await http.post('verify/login');
            console.log(res, 'res');
            return res.data;
        } catch (error) {
            const err = error as AxiosError;
            const dataErr: any = err.response?.data;
            if (dataErr.status === 0) return false;
            console.log(dataErr);
        }
    };
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new VerifyAPI();
