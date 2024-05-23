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
let controllerRequest = false;
class refreshToken {
    private static isInterceptorAttached: boolean = false;
    private static isInterceptorAttachedR: boolean = false;
    axiosJWTs() {
        const token = Cookies.get('tks');
        if (!refreshToken.isInterceptorAttached && token && !controllerRequest) {
            let tokenN = token;
            axiosJWT.interceptors.request.use(
                async (config) => {
                    return await new Promise(async (resolve, reject) => {
                        try {
                            const date = new Date();
                            const decodeToken: any = await jwt_decode(tokenN);
                            if (decodeToken.exp < date.getTime() / 1000 + 5 && !controllerRequest) {
                                refreshToken.isInterceptorAttached = true;
                                controllerRequest = true;
                                // faster 50 second
                                const newToken = await authHttpRequest.refreshToken();
                                controllerRequest = false;
                                refreshToken.isInterceptorAttached = false;
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
        if (!refreshToken.isInterceptorAttachedR && token) {
            let tokenNN = token;
            refreshToken.isInterceptorAttachedR = true;
            axiosJWTFile.interceptors.request.use(
                async (config) => {
                    return await new Promise(async (resolve, reject) => {
                        try {
                            const date = new Date();
                            const decodeToken: any = await jwt_decode(tokenNN);
                            if (decodeToken.exp < date.getTime() / 1000 + 5) {
                                // faster 50 second
                                const data = await authHttpRequest.refreshToken();
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
