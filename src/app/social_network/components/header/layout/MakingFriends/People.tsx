/* eslint-disable react-hooks/exhaustive-deps */

import { io } from 'socket.io-client';

import { Div, DivFlex, DivNone, H3, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivItems, DivMenu, DivOptions, DivResults, DivSearch, Input } from './styleMakingFriends';
import { useState, useEffect, useLayoutEffect, memo, useRef } from 'react';
import Strangers from './Strangers';
import Friends from './Friends';
import Requested from './Requested';
import Others from './OthersRequest';
import { PropsId_chats } from 'src/App';

const socket = io('http://localhost:3001', { transports: ['websocket'] });

export interface PropsTextFriends {
    menu: { name: string; id: 'strangers' | 'friends' | 'family' | 'yousent' | 'otherssent' }[];
}
export interface PropsUserPeople {
    avatar?: string;
    fullName?: string;
    gender?: number;
}
interface PropsMakingFriends {
    friendsT: PropsTextFriends;
    colorText: string;
    colorBg: number;
    dataUser?: PropsUserPeople;
    cRef: React.MutableRefObject<number>;
    setId_chats: React.Dispatch<React.SetStateAction<PropsId_chats[]>>;
}

const MakingFriends: React.FC<PropsMakingFriends> = ({ friendsT, colorText, colorBg, dataUser, cRef, setId_chats }) => {
    const [type, setType] = useState<'strangers' | 'friends' | 'family' | 'yousent' | 'otherssent'>('strangers');
    const lRef = useRef<any>();
    const menu = friendsT.menu;

    return (
        <DivOptions bg={colorBg === 1 ? '#3d414c' : ''} color={colorText}>
            <Div width="100%" css="height: 30px;"></Div>
            <Div css="height: 91%">
                <DivNone>
                    {menu.map((u) => (
                        <DivFlex
                            key={u.id}
                            width="fit-content"
                            padding="5px 20px"
                            margin="5px 20px"
                            cursor="var(--pointer)"
                            css="background-color: #282827; border-radius: 5px; &:hover{box-shadow: 0 0 5px;transition: all 0.3s linear;}"
                            onClick={() => setType(u.id)}
                        >
                            <P>{u.name}</P>
                        </DivFlex>
                    ))}
                </DivNone>
                {/* <DivMenu></DivMenu> */}
                <Div
                    width="70%"
                    css={`
                        position: relative;
                        height: 100%;
                        overflow: hidden;
                        @media (min-width: 800px) {
                            width: 81%;
                        }
                    `}
                >
                    {type === 'strangers' && <Strangers type={type} cRef={cRef} />}
                    {type === 'friends' && <Friends type={type} setId_chats={setId_chats} />}
                    {type === 'otherssent' && <Requested type={type} />}
                    {type === 'yousent' && <Others type={type} />}
                    {/* <Strangers type={type} />

                    <Friends type={type} />

                    <Requested type={type} />

                    <Others type={type} />
                    <DivResults id="family">
                        <H3 css="width: 100%; text-align: center; padding: 3px; background-color: #353535; font-size: 1.5rem; ">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </H3>
                        {loading && (
                            <DivLoading>
                                <LoadingI />
                            </DivLoading>
                        )}
                        Empty
                    </DivResults> */}
                </Div>
            </Div>
        </DivOptions>
    );
};
export default memo(MakingFriends);
