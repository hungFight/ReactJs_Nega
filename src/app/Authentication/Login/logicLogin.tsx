import React, { useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import authAPI from '~/restAPI/authAPI/authAPI';
import { PropsLogin } from './Login';
import { PropsBgRD } from '~/redux/background';
import { PropsUser } from '~/typescript/userType';
interface PropsState {
    persistedReducer: {
        language: {
            login: string;
        };
    };
}
function LogicLogin(
    data: PropsLogin,
    setWhatKind: React.Dispatch<React.SetStateAction<'register' | 'changePassword' | ''>>,
    setUserFirst: React.Dispatch<React.SetStateAction<PropsUser>>,
    setCookies: any,
) {
    const [loading, setLoading] = useState<boolean>(false);
    const dataLanguages = useSelector((state: PropsState) => state.persistedReducer?.language.login);
    const { colorBg, colorText } = useSelector((state: PropsBgRD) => state.persistedReducer.background);
    const [language, setLanguage] = useState<boolean>(false);

    const { title, input, changePassword, submit, register } = data[dataLanguages];

    const dispatch = useDispatch();
    //server
    const [errText, setErrText] = useState<string>('');
    //client
    const [value, setValue] = useState<{ nameAccount: string; password: string }>({
        nameAccount: '',
        password: '',
    });
    const checkRef = useRef<any>({ nameAccount: value.nameAccount, password: value.password });
    const [invalid, setInvalid] = useState<{ nameAccount: boolean; password: boolean }>({
        nameAccount: false,
        password: false,
    });
    const [showPass, setShowPass] = useState<{ icon: boolean; check: number }>({ icon: false, check: 1 });

    const handleInputChangeN = (e: { target: { value: string } }) => {
        setValue({ ...value, nameAccount: e.target.value });
    };
    const handleInputChangeP = (e: { target: any }) => {
        setValue({ ...value, password: e.target.value });
        setInvalid({ ...invalid, password: false });
        if (e.target.value) {
            setShowPass({ ...showPass, icon: true });
        } else {
            setShowPass({ ...showPass, icon: false });
        }
    };
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        checkRef.current = value;
        if (!value.nameAccount && !value.password) {
            setInvalid({ ...invalid, nameAccount: true, password: true });
        } else if (!value.nameAccount) {
            setInvalid({ ...invalid, nameAccount: true, password: false });
        } else if (!value.password) {
            setInvalid({ ...invalid, nameAccount: false, password: true });
        } else {
            const params = {
                nameAccount: value.nameAccount,
                password: value.password,
            };
            setLoading(true);
            const data = await authAPI.postLogin(params);
            if (data) {
                setCookies('k_user', data.id, {
                    path: '/',
                    secure: false,
                    sameSite: 'strict',
                    expires: new Date(new Date().getTime() + 30 * 86409000), // 30 days
                });
                setUserFirst(data);
            } else setErrText('Account is not exist or password wrong!');
            setLoading(false);
        }
    };
    const handleInputFocus = (e: { target: { getAttribute: any } }) => {
        if (e.target.getAttribute('placeholder') === 'Password') {
            setInvalid({ ...invalid, password: false });
        } else {
            setInvalid({ ...invalid, nameAccount: false });
        }
        setErrText('');
    };
    const handleRegister = () => {
        setWhatKind('register');
    };
    console.log(invalid, value);
    const handlelanguage = () => {
        setLanguage(!language);
    };
    // Input
    const eventsOnChange = [handleInputChangeN, handleInputChangeP];
    const checkInput = [value.nameAccount, value.password];
    const colorInput = [invalid.nameAccount, invalid.password];
    return {
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
    };
}

export default LogicLogin;
