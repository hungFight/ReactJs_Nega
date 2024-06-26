import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ButtonAnimationSurround, Htitle } from '~/reUsingComponents/styleComponents/styleComponents';
import { changeLogin } from '~/redux/languageRD';

import Language from '~/utils/Language/Language';
import { A, DivForm, DivLanguage, Perror, DivRegister, DivAccount } from './styleLogin';
import Eyes from '~/reUsingComponents/Eys/Eye';
import { Input } from '~/reUsingComponents/styleComponents/styleDefault';
import LogicLogin from './logicLogin';
import { PropsUser } from '~/typescript/userType';
// eslint-disable-next-line @typescript-eslint/no-redeclare
interface InLogin {
    title: string;

    input: {
        id: number;
        type: string | string[];
        placeholder: string;
    }[];
    changePassword: string;
    submit: string;
    register: string;
}
export interface PropsLogin {
    [en: string]: InLogin;
    vi: InLogin;
}

const Login: React.FC<{
    data: PropsLogin;
    setWhatKind: React.Dispatch<React.SetStateAction<'register' | 'changePassword' | ''>>;
    setUserFirst: React.Dispatch<React.SetStateAction<PropsUser>>;
    setCookies: any;
}> = ({ data, setWhatKind, setUserFirst, setCookies }) => {
    const {
        colorBg,
        colorText,
        title,
        input,
        changePassword,
        submit,
        register,
        language,
        errText,
        value,
        checkRef,
        invalid,
        showPass,
        eventsOnChange,
        checkInput,
        colorInput,
        handleSubmit,
        handleInputFocus,
        handleRegister,
        handlelanguage,
        setShowPass,
        dispatch,
        loading,
    } = LogicLogin(data, setWhatKind, setUserFirst, setCookies);
    return (
        <>
            <DivForm>
                <DivLanguage onClick={handlelanguage}>
                    <Language change={dispatch} language={language} changeLanguage={changeLogin} />
                </DivLanguage>
                <Htitle>{title}</Htitle>
                <form method="POST" onSubmit={handleSubmit}>
                    <DivAccount>
                        {input.map((val) => {
                            return (
                                <Input
                                    key={val.id}
                                    type={Array.isArray(val.type) ? val.type[showPass.check] : val.type}
                                    value={checkInput[val.id]}
                                    color={colorInput[val.id] ? 'rgb(255 97 97 / 83%)' : colorText}
                                    placeholder={val.placeholder}
                                    onChange={eventsOnChange[val.id]}
                                    onFocus={handleInputFocus}
                                />
                            );
                        })}
                        <Eyes value={value.password} setShow={setShowPass} show={showPass} top="71px" />
                        <A onClick={() => setWhatKind('changePassword')} color={colorText}>
                            {changePassword}
                        </A>
                    </DivAccount>
                    {errText && <Perror> {errText}</Perror>}
                    <DivRegister onClick={handleRegister}>{register}</DivRegister>
                    <ButtonAnimationSurround title={submit} loading={loading} />
                </form>
            </DivForm>
        </>
    );
};

export default Login;
