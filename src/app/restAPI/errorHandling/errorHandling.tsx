import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const errorHandling = (error: AxiosError) => {
    console.log(error);

    if (error.response) {
        const data: any = error.response.data;
        const res = error.response;
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(res.data);
        console.log(res.status);
        console.log(res.headers);
        if ((data.status === 0 || data.errorAny === 0) && error.response.status !== 500) {
            // data.status === 0 define haven't logged in
            return 'NeGA_off';
        } else if (data.status === 8888) {
            return 'NeGA_off_u';
        } else if (res.status === 500 && data?.messageObject?.status === 9999) {
            return data?.messageObject.message;
        } else {
            return null;
        }
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
};

export default errorHandling;
