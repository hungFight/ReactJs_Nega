import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
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
