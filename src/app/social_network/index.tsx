import React, { ReactNode, useDeferredValue, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LanguageI } from '~/assets/Icons/Icons';
import { InitialStateHideShow } from '~/redux/hideShow';
import { PropsSetting } from '~/reUsingComponents/Setting/interface';
import Header, { PropsSN } from './components/Header/HeaderLayout';
import Settingcbl from '~/reUsingComponents/Setting/Setting';

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
interface InNetWork {
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
    dataUser: { avatar: string; fullName: string; gender: number };
    setId_chats: React.Dispatch<
        React.SetStateAction<
            {
                id_room: string | undefined;
                id_other: string;
            }[]
        >
    >;
}> = ({ data, dataUser, setId_chats }) => {
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
                setId_chats={setId_chats}
            />
            <Settingcbl dataO={sett.data} LgNow={lg} turnSetting={turnSetting} />
        </>
    );
};

export default Socialnetwork;
