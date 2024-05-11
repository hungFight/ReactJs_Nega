import { AnyAction } from '@reduxjs/toolkit';
import React, { Dispatch } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { setSession } from '~/redux/reload';

const ServerBusy = (res: any, dispatch: Dispatch<AnyAction>) => {
    if (typeof res === 'string' && res === 'NeGA_off') {
        dispatch(setSession(res));
        return null;
    } else if (res === 'NeGA_ExcessiveRequest') {
        dispatch(setSession(res));
        return null;
    }
    return res;
};

export default ServerBusy;
