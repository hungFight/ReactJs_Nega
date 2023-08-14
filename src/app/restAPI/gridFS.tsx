import refreshToken from '~/refreshToken/refreshToken';

class FileGriFS {
    getFile = async (id_file: string) => {
        try {
            const Axios = refreshToken.axiosJWTs();
            const res = await Axios.get('/fileGridFS/getFile', { params: { id_file } });

            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
}
export default new FileGriFS();
