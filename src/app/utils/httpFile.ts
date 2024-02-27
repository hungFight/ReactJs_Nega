import axios, { AxiosInstance } from 'axios';
axios.defaults.withCredentials = true;
class HttpFile {
    instance: AxiosInstance;
    constructor() {
        this.instance = axios.create({
            baseURL: process.env.REACT_APP_SERVER_FILE_V1,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
    }
}
const httpFile = new HttpFile().instance;
export default httpFile;
