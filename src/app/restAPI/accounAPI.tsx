import { PropsAccount } from '~/Authentication/ChangePassword/typeChangePassword';
import CommonUtils from '~/utils/CommonUtils';
import http from '~/utils/http';

class AccountRequest {
    getPhoneMail = async (params: { phoneMail: string | number }) => {
        const res = await http.post<PropsAccount[]>('account/get', {
            params,
        });
        return res.data.map((u) => {
            const a = CommonUtils.convertBase64(u.avatar);
            u.avatar = a;
            return u;
        });
    };

    changePassword = async (params: { id: string; password: string }) => {
        try {
            const res = await http.post('account/changePassword', {
                params,
            });
            return { status: res.data.status, message: res.data.message };
        } catch (error) {
            console.log('changePassword', error);
        }
    };
}

export default new AccountRequest();
