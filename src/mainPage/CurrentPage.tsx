import React from 'react';
import { PropsId_chats, PropsUser } from 'src/App';

import { socialnetwork } from 'src/dataText/dateTextSocialNetWork';
import Socialnetwork from '~/social_network';
import Study from '~/study';

interface PropsCPage {
    currentPage: number;
    listPage: boolean;
    dataUser: PropsUser;
    setId_chats: React.Dispatch<React.SetStateAction<PropsId_chats[]>>;
    setDataUser: React.Dispatch<React.SetStateAction<PropsUser>>;
}
const currentPageL: React.FC<PropsCPage> = ({ currentPage, listPage, dataUser, setId_chats, setDataUser }) => {
    if (listPage) {
        return currentPage === 1 ? (
            <Socialnetwork
                data={socialnetwork}
                dataUser={dataUser}
                setId_chats={setId_chats}
                setDataUser={setDataUser}
            />
        ) : currentPage === 2 ? (
            <Study />
        ) : (
            <div>hello personal</div>
        );
    }

    return <></>;
};
export default currentPageL;
