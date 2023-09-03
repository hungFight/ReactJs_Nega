import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';
import authHttpRequest from '~/restAPI/authAPI/authAPI';
axios.defaults.withCredentials = true;
const axiosJWT = axios.create({
    baseURL: process.env.REACT_APP_SPACESHIP,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
class refreshToken {
    private isInterceptorAttached: boolean = false;
    axiosJWTs() {
        const token = Cookies.get('tks');
        console.log('token here', token);
        let i = 0;
        if (!this.isInterceptorAttached && token) {
            let tokenN = token;

            axiosJWT.interceptors.request.use(
                async (config) => {
                    return await new Promise(async (resolve, reject) => {
                        try {
                            console.log('all right', i++);
                            const date = new Date();
                            const decodeToken: any = await jwt_decode(tokenN);

                            if (decodeToken.exp < date.getTime() / 1000 + 5) {
                                console.log(decodeToken.exp, date.getTime() / 1000 + 2, token, 'hhhh');

                                const data = await authHttpRequest.refreshToken();

                                console.log(data.newAccessToken, 'newAccessToken');

                                if (data?.newAccessToken) {
                                    const newToken = 'Bearer ' + data.newAccessToken;
                                    tokenN = newToken;
                                    Cookies.set('tks', newToken, {
                                        path: '/',
                                        secure: false,
                                        sameSite: 'strict',
                                        expires: new Date(new Date().getTime() + 30 * 86409000),
                                    });
                                }
                            }
                            this.isInterceptorAttached = true;
                            resolve(config);
                        } catch (error) {
                            reject(error);
                        }
                    });
                },
                (err) => {
                    console.log('error Axios');
                    return Promise.reject(err);
                },
            );
        }
        return axiosJWT;
    }
}
export default new refreshToken();
