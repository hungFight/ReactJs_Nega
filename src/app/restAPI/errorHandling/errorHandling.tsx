import { AnyAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { Dispatch } from 'react';
import { setSession } from '~/redux/reload';

const errorHandling = (error: AxiosError, dispatch?: Dispatch<AnyAction>) => {
    console.log(error);
    if (error.response) {
        const data: any = error.response.data;
        const res = error.response;
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(res.data);
        console.log(res.status);
        console.log(res.headers);
        if (data?.status === 0) {
            // data.status === 0 define haven't logged in
            if (dispatch) dispatch(setSession('NeGA_off'));
            return null;
        } else if (data.status === 9) {
            if (dispatch) dispatch(setSession('NeGA_ExcessiveRequest'));
            return null;
        } else {
            return null;
        }
    } else if (error.request) {
        console.log(error.request);
        return null;
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        return null;
    }
};

export default errorHandling;
