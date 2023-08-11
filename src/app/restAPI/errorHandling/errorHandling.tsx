import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const errorHandling = (error: AxiosError) => {
    if (error.response) {
        const data: any = error.response.data;
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (data.status === 0 && error.response.status >= 400) {
            // data.status === 0 define haven't logged in
            return 'NeGA_off';
        } else if (error.response.status === 404) {
            return data;
        } else if (error.response.status === 401) {
        }
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
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
