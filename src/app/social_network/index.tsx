import React, { ReactNode, useDeferredValue, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LanguageI } from '~/assets/Icons/Icons';
import { InitialStateHideShow } from '~/redux/hideShow';
import { PropsSetting } from '~/reUsingComponents/Setting/interface';
import Header, { PropsSN } from './components/Header/HeaderLayout';
import Settingcbl from '~/reUsingComponents/Setting/Setting';
import { PropsId_chats } from 'src/App';
import { memo } from 'react';
import { PropsUser } from '~/typescript/userType';

const settingData = [
    {
        title: 'Language',
        icon: <LanguageI />,
        children: {
            data: [
                { name: 'English', lg: 'EN' },
                { name: 'VietNamese', lg: 'VN' },
            ],
        },
    },
    {
        title: 'Log Out',
        logout: true,
    },
];
export interface InNetWork {
    header: PropsSN;
    sett: {
        data: PropsSetting;
    };
    body: {};
}

interface PropsLanguage {
    persistedReducer: {
        language: {
            sn: string;
        };
    };
}

const Socialnetwork: React.FC<{
    data: {
        [vi: string]: InNetWork;
        en: InNetWork;
    };
    setDataUser: React.Dispatch<React.SetStateAction<PropsUser>>;
    dataUser: PropsUser;
    setId_chats: React.Dispatch<React.SetStateAction<PropsId_chats[]>>;
}> = ({ data, dataUser, setId_chats, setDataUser }) => {
    const lg = useSelector((state: PropsLanguage) => state.persistedReducer.language.sn);
    const { header, sett } = data[lg];

    const turnSetting = useSelector((state: { hideShow: InitialStateHideShow }) => state.hideShow?.setting);
    console.log('social', lg, dataUser);

    return (
        <>
            <Header
                dataText={{
                    logo: header.logo,
                    sett: header.sett,
                    home: header.home,
                    exchange: header.exchange,
                    video: header.video,
                    friends: header.friends,
                    search: header.search,
                    location: header.location,
                }}
                dataUser={dataUser}
                setDataUser={setDataUser}
                setId_chats={setId_chats}
            />
            <Settingcbl dataO={sett.data} LgNow={lg} turnSetting={turnSetting} />
        </>
    );
};

export default Socialnetwork;
