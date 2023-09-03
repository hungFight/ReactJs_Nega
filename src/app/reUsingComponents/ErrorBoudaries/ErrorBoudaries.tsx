import { useEffect, useState } from 'react';
import { DivMessage } from './stylesErrorBoudaries';
import { Button, P } from '../styleComponents/styleDefault';
import { useDispatch } from 'react-redux';
import { setFalseErrorServer } from '~/redux/hideShow';
import { setSession } from '~/redux/reload';
import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';
const ErrorBoundaries: React.FC<{
    message: string;
}> = ({ message }) => {
    const dispatch = useDispatch();
    const [c, s, removeCookies] = useCookies(['k_user', 'tks']);
    const login = message === 'NeGA_off' ? true : false;
    return (
        <DivMessage>
            <P
                color="#ff5252;"
                css="    color: #ff5252;
                            width: 70%;
                            background-color: #282828;
                            font-size: 1.6rem;
                            font-weight: bold;
                            border-radius: 5px;
                            text-align: center;
                            padding: 10px;"
            >
                {message}
                <br></br>
                <Button
                    bg="#2e8c65b5"
                    color="#d4d4d4"
                    size="1.3rem"
                    css="margin: 10px auto; "
                    onClick={() => {
                        dispatch(setSession(''));
                        if (login) {
                            Cookies.remove('tks');
                            Cookies.remove('k_user');
                            removeCookies('k_user');
                        }
                    }}
                >
                    {login ? 'Login' : 'Xác nhận'}
                </Button>
            </P>
        </DivMessage>
    );
};

export default ErrorBoundaries;
