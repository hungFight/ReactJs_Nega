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
const axiosJWTFile = axios.create({
    baseURL: process.env.REACT_APP_SERVER_FILE_V1,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
class refreshToken {
    private static isInterceptorAttached: boolean = false;
    private static isInterceptorAttachedR: boolean = false;
    axiosJWTs() {
        const token = Cookies.get('tks');
        console.log('token here', token);
        let i = 0;
        if (!refreshToken.isInterceptorAttached && !refreshToken.isInterceptorAttachedR && token) {
            let tokenN = token;

            axiosJWT.interceptors.request.use(
                async (config) => {
                    return await new Promise(async (resolve, reject) => {
                        try {
                            refreshToken.isInterceptorAttached = true;
                            console.log('all right', i++);
                            const date = new Date();
                            const decodeToken: any = await jwt_decode(tokenN);

                            if (decodeToken.exp < date.getTime() / 1000 + 5) {
                                // faster 50 second
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
    axiosJWTsFIle() {
        const token = Cookies.get('tks');
        console.log('token here File', token);
        let i = 0;
        if (!refreshToken.isInterceptorAttachedR && token) {
            let tokenNN = token;
            axiosJWTFile.interceptors.request.use(
                async (config) => {
                    return await new Promise(async (resolve, reject) => {
                        try {
                            console.log('all right', i++);
                            const date = new Date();
                            const decodeToken: any = await jwt_decode(tokenNN);
                            refreshToken.isInterceptorAttachedR = true;
                            if (decodeToken.exp < date.getTime() / 1000 + 5) {
                                // faster 50 second
                                console.log(decodeToken.exp, date.getTime() / 1000 + 2, token, 'hhhh');

                                const data = await authHttpRequest.refreshToken();

                                console.log(data.newAccessToken, 'newAccessToken');

                                if (data?.newAccessToken) {
                                    const newToken = 'Bearer ' + data.newAccessToken;
                                    tokenNN = newToken;
                                    Cookies.set('tks', newToken, {
                                        path: '/',
                                        secure: false,
                                        sameSite: 'strict',
                                        expires: new Date(new Date().getTime() + 30 * 86409000),
                                    });
                                }
                            }
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
        return axiosJWTFile;
    }
}
export default new refreshToken();
