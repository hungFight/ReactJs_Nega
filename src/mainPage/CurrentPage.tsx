import React from 'react';
import { PropsId_chats } from 'src/App';

import { socialnetwork } from 'src/dataText/dateTextSocialNetWork';
import Socialnetwork from '~/social_network';
import Study from '~/study';

interface PropsCPage {
    currentPage: number;
    listPage: boolean;
    dataUser: { avatar: string; fullName: string; gender: number };
    setId_chats: React.Dispatch<React.SetStateAction<PropsId_chats[]>>;
}
const currentPageL: React.FC<PropsCPage> = ({ currentPage, listPage, dataUser, setId_chats }) => {
    if (listPage) {
        return currentPage === 1 ? (
            <Socialnetwork data={socialnetwork} dataUser={dataUser} setId_chats={setId_chats} />
        ) : currentPage === 2 ? (
            <Study />
        ) : (
            <div>hello personal</div>
        );
    }

    return <></>;
};
export default currentPageL;
