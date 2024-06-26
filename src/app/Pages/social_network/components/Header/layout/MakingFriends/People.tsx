/* eslint-disable react-hooks/exhaustive-deps */

import { Div, DivFlex } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivOptions } from './styleMakingFriends';
import { useState, memo, useRef } from 'react';
import Strangers from './Strangers';
import Friends from './Friends';
import Requested from './Requested';
import Others from './OthersRequest';
import { PropsId_chats } from 'src/App';
import { ButtonAnimationSurround, DivNone } from '~/reUsingComponents/styleComponents/styleComponents';
import { PropsUser } from '~/typescript/userType';

export interface PropsTextFriends {
    menu: { name: string; id: 'strangers' | 'friends' | 'family' | 'yousent' | 'otherssent'; bgAnimation: string[] }[];
}

interface PropsMakingFriends {
    friendsT: PropsTextFriends;
    colorText: string;
    colorBg: number;
    dataUser: PropsUser;
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
                    {menu.map((u, index) => (
                        <DivFlex key={u.id} width="fit-content" margin="5px 40px" cursor="var(--pointer)" onClick={() => setType(u.id)}>
                            <ButtonAnimationSurround
                                title={u.name}
                                bgImg={u.bgAnimation[0]}
                                bgSecond={u.bgAnimation[1]}
                                css={`
                                    width: 120px;
                                    border-radius: 5px;
                                    padding: 0 10px;
                                    ${u.id === type ? 'background-color: antiquewhite;' : ''}
                                    ${index ? 'margin: 8px 0;' : 'margin:0;'}
                                `}
                            />
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
                    {type === 'strangers' && <Strangers userData={dataUser} cRef={cRef} />}
                    {type === 'friends' && <Friends userData={dataUser} setId_chats={setId_chats} />}
                    {type === 'otherssent' && <Requested userData={dataUser} />}
                    {type === 'yousent' && <Others userData={dataUser} />}
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
