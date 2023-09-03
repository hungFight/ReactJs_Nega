import { AnyAction } from '@reduxjs/toolkit';
import React, { Dispatch } from 'react';
import { useDispatch } from 'react-redux';
import { setSession } from '~/redux/reload';

const ServerBusy = (res: any, dispatch: Dispatch<AnyAction>) => {
    if (typeof res === 'string' && res === 'NeGA_off') {
        dispatch(setSession('The session expired! Please login again'));
        return null;
    } else if (res === 'Server is busy!') {
        dispatch(setSession('Server is busy!'));
        return null;
    }
    return res;
};

export default ServerBusy;
