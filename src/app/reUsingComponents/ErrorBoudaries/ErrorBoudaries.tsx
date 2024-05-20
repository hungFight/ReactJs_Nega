import { useEffect, useState } from 'react';
import { DivMessage } from './stylesErrorBoudaries';
import { Button, P } from '../styleComponents/styleDefault';
import { useDispatch } from 'react-redux';
import { setFalseErrorServer } from '~/redux/hideShow';
import { PropsSessionCode, setSession } from '~/redux/reload';
import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const ErrorBoundaries: React.FC<{
    code: PropsSessionCode;
}> = ({ code }) => {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const message = code === 'NeGA_ExcessiveRequest' ? 'Server is now busy! just wait for moment.' : code === 'NeGA_off' ? 'The session expired! Please login again' : '';
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
                        dispatch(setSession(null));
                        dispatch(setFalseErrorServer());
                        if (code === 'NeGA_off') navigate('/');
                    }}
                >
                    {code === 'NeGA_off' ? 'Login' : 'Xác nhận'}
                </Button>
            </P>
        </DivMessage>
    );
};

export default ErrorBoundaries;
