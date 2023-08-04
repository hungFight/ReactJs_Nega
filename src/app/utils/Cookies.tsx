import React from 'react';
import { useCookies } from 'react-cookie';

const Cookies = () => {
    const [cookies] = useCookies(['k_user', 'tks']);
    const userId: Readonly<string> = cookies.k_user;
    const token: Readonly<string> = cookies.tks;
    return {
        userId,
        token,
    };
};
export default Cookies;
