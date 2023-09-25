import React from 'react';
import { memo } from 'react';

import { socialnetwork } from 'src/dataMark/dateTextSocialNetWork';
import Socialnetwork from '~/social_network';
import Study from '~/study';

interface PropsCPage {
    currentPage: number;
    listPage: boolean;
    dataUser: { avatar: string; fullName: string; gender: number };
    setId_chats: React.Dispatch<
        React.SetStateAction<
            {
                id_room: string | undefined;
                id_other: string;
            }[]
        >
    >;
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
