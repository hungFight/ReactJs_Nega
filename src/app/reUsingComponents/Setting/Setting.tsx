import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InitialStateHideShow, offAll, offSetting } from '~/redux/hideShow';

import authHttpRequest from '~/restAPI/authAPI/authAPI';
import HttpRequestUser from '~/restAPI/userAPI';

import { CloseI } from '~/assets/Icons/Icons';
import Bar from '~/reUsingComponents/Bar/Bar';
import { PropsSetting } from './interface';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { DivFlexPosition } from '../styleComponents/styleComponents';
import { DivLanguages, DivResults } from './styleSetting';
import { Div, P } from '../styleComponents/styleDefault';
import { socket } from 'src/mainPage/NextWeb';
import { changeSN } from '~/redux/languageRD';

const css2 = `
        margin-top: 49px;
        box-shadow: 0 0 1px;
    `;
const css3 = `
        font-size: 12px;
        margin: 3px 0 0 3px;
        display: flex;
        align-items: self-end;
    `;
const Settingcbl: React.FC<{
    dataO: PropsSetting;
    LgNow: string;
    turnSetting: boolean;
}> = ({ dataO, LgNow, turnSetting }) => {
    const dispatch = useDispatch();
    const datas = dataO.data;
    const navigate = useNavigate();
    const showHideSettingn = useSelector((state: { hideShow: InitialStateHideShow }) => state.hideShow?.setting);
    const [cookies, setCookie, removeCookie] = useCookies(['tks', 'k_user']);
    const k_user: string = cookies.k_user;
    const checkLg = useRef<string>(LgNow);

    const [showresult, setShowresult] = useState<ReactNode>();
    const [resultoption, setResultoption] = useState<boolean>(false);

    useEffect(() => {
        if (!showHideSettingn) setResultoption(false);
    }, [showHideSettingn]);
    const handleChangeLanguage = async (lg: string) => {
        if (checkLg.current !== lg) {
            const res = await HttpRequestUser.setLg(dispatch, k_user, lg);
            console.log('laggggg', res);
            dispatch(changeSN(res));
            checkLg.current = lg;
        }
    };
    const css1 = `
        min-width: 270px;
        position: fixed;
        top: 0px;
        right: ${turnSetting ? '9px' : '-280px'};
        box-shadow: 0 0 4px rgb(108 106 106);
        z-index: 9999;
        transition: all 0.3s linear;
        border-radius: 5px;
        background-color: #202124;
        color: var(--color-light);
    `;
    const handleResult = (data: any) => {
        const cssR = `
                transition: all 0.1s linear;
                width: 100%;
                padding: 5px;
                text-align: center;
                cursor: pointer;
                &:hover {
                    background-color: rgba(176, 176, 176, 0.08);
                }
        `;
        setShowresult(() => {
            if (data) {
                setResultoption(true);
                return data.data.map((title: any, index: number) => {
                    return (
                        <P css={cssR} key={index} onClick={() => handleChangeLanguage(title.lg)}>
                            {title.name}
                        </P>
                    );
                });
            }
            setResultoption(false);
        });
    };
    const handleLogOut = async () => {
        const res = await authHttpRequest.postLogOut();
        console.log(res);
        if (res) {
            navigate('/');
            dispatch(offAll());
            removeCookie('k_user');
            localStorage.clear();
            socket.emit('offline', k_user);
        }
    };
    return (
        <>
            <Div height="500px" css={css1} onClick={(e) => e.stopPropagation()}>
                <DivFlexPosition
                    size="25px"
                    top="11px"
                    left="11px"
                    onClick={() => {
                        setResultoption(false);
                        dispatch(offSetting());
                    }}
                >
                    <CloseI />
                </DivFlexPosition>
                <Div width="250px" css={css2}>
                    {datas.map((setting: any, index: number) => {
                        if (setting.logout) {
                        }
                        return (
                            <div key={index}>
                                {setting.logout ? (
                                    <DivLanguages onClick={handleLogOut}>
                                        <P css=" margin-left: 15px;">{setting.title}</P>
                                    </DivLanguages>
                                ) : (
                                    <DivLanguages onClick={() => handleResult(setting.children)}>
                                        <P css=" margin-left: 15px;">{setting.title}</P>
                                        {setting.title === 'Language' && <P css={css3}>( English ){setting.icon}</P>}
                                    </DivLanguages>
                                )}
                            </div>
                        );
                    })}
                </Div>
                {resultoption && <Bar top="calc(50% - 10px);" onClick={() => setResultoption(false)} css="width: 5px;" />}
                {resultoption && <DivResults> {showresult}</DivResults>}
            </Div>
        </>
    );
};

export default Settingcbl;
