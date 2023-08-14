import refreshToken from '~/refreshToken/refreshToken';
class PeopleRequest {
    getPeople = async (rl?: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.get(`/SN/people/getPeopleAll?rl=${rl}`);
            console.log(res, 'getPeople');
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    setFriend = async (id: string, per?: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post('/SN/people/setFriend', {
                params: { id_friend: id, per },
            });
            return res.data;
        } catch (error) {
            console.log(error, 'add Friend');
        }
    };
    getfriendAll = async () => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.get('/SN/people/getFriendAll');
            return res.data;
        } catch (error) {
            console.log(error, 'get FriendAll');
        }
    };
    delete = async (id: string, kindOf?: string, per?: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.post('/SN/people/deleteReq', { params: { id_req: id, kindOf: kindOf, per } });
            return res.data;
        } catch (error) {
            console.log(error, 'delete');
        }
    };
    setConfirm = async (id: string, kindOf?: string, atInfor?: boolean) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.patch('/SN/people/setConfirm', {
                params: { id_req: id, kindOf: kindOf, atInfor },
            });
            return res.data;
        } catch (error) {
            console.log(error, 'delete');
        }
    };
    getStrangers = async (limit: number, ids: string[]) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            const res = await axiosJWTss.get('/SN/people/getStrangers', {
                params: {
                    limit,
                    ids,
                },
            });
            return res.data;
        } catch (error) {
            console.log(error, 'get Strangers');
        }
    };
    getFriends = async (offset: number, limit: number, type: string) => {
        try {
            const axiosJWTss = refreshToken.axiosJWTs();
            console.log('loop friend');
            const res = await axiosJWTss.get('/SN/people/getFriends', {
                params: {
                    offset,
                    limit,
                    type,
                },
            });
            return res.data;
        } catch (error) {
            console.log(error, 'get Strangers');
        }
    };
}

export default new PeopleRequest();
