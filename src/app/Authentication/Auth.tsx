import { ReactNode, useState } from 'react';
import Login, { PropsLogin } from './Login/Login';
import Register from './Register/Register';

import styled from 'styled-components';
import { UndoIRegister } from '~/assets/Icons/Icons';
import Verify from './Verify/Verify';
import { PropsRegisterLanguage } from './Register/interfaceType';
import ChangePassword from './ChangePassword/ChangePassword';
import { PropsUser } from '~/typescript/userType';
const DivBackground = styled.div`
    width: 100%;
    height: 100%;
    padding-top: 50px;
    background: #202124;
    overflow-y: overlay;
`;
export const Pnext = styled.p`
    font-size: 2rem;
    color: white;
    cursor: var(--pointer);
    position: absolute;
    top: 3px;
    display: flex;
`;
const Authentication: React.FC<{
    dataLogin: PropsLogin;
    dataRegister: PropsRegisterLanguage;
    setUserFirst: React.Dispatch<React.SetStateAction<PropsUser>>;
    setCookies: any;
}> = ({ dataLogin, dataRegister, setUserFirst, setCookies }) => {
    const [enable, setEnable] = useState<boolean>(false);
    const [account, setAccount] = useState<string | number>('');
    const [whatKind, setWhatKind] = useState<'register' | 'changePassword' | ''>('');
    const [acc, setAcc] = useState<number>(0);
    const Next: ReactNode = (
        <Pnext
            onClick={() => {
                setEnable(false);
                setWhatKind('');
            }}
        >
            <UndoIRegister />
        </Pnext>
    );

    const Element = () => {
        if (whatKind === 'register') {
            if (enable) return <Register acc={acc} dataRegister={dataRegister} account={account} Next={Next} />;
            return <Verify setAcc={setAcc} setEnable={setEnable} setAccount={setAccount} Next={Next} whatKind={whatKind} />;
        } else if (whatKind === 'changePassword') {
            if (enable) return <ChangePassword phoneMail={account} Next={Next} setWhatKind={setWhatKind} setEnable={setEnable} />;
            return <Verify setAcc={setAcc} setEnable={setEnable} setAccount={setAccount} Next={Next} whatKind={whatKind} />;
        } else {
            return <Login data={dataLogin} setCookies={setCookies} setWhatKind={setWhatKind} setUserFirst={setUserFirst} />;
        }
    };
    return (
        <>
            <DivBackground>
                <>{Element()}</>
            </DivBackground>
        </>
    );
};
export default Authentication;
