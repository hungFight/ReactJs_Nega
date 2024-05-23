import refreshToken from '~/restAPI/refreshToken/refreshToken';
class SearchAPI {
    user = async (id: string) => {
        try {
            const axiosJWT = refreshToken.axiosJWTs();
            const path = '/SN/profile';
            const res = await axiosJWT.post(path, { params: { id } });
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
}
export default new SearchAPI();
