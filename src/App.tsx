/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from 'react-redux';
import { InitialStateHideShow, offAll, onPersonalPage, setIdUser } from './app/redux/hideShow';
import { Buffer } from 'buffer';

import Personalpage from './mainPage/personalPage/PersonalPage';
import { login } from './dataMark/dataLogin';
import { register } from './dataMark/dataRegister';
import React, { RefObject, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DivContainer, DivLoading, DivPos, Hname } from './app/reUsingComponents/styleComponents/styleComponents';
import styled from 'styled-components';
import { A, Div, P } from './app/reUsingComponents/styleComponents/styleDefault';
import Progress from './app/reUsingComponents/Progress/Progress';
import ErrorBoudaries from './app/reUsingComponents/ErrorBoudaries/ErrorBoudaries';
import { socket } from './mainPage/nextWeb';
import { DotI, LoadingI, TyOnlineI, UndoI } from '~/assets/Icons/Icons';
import CommonUtils from '~/utils/CommonUtils';
import userAPI from '~/restAPI/userAPI';
import { PropsTitleP } from './mainPage/personalPage/layout/Title';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import Conversation from '~/Message/Send/Conversation';
import { PropsReloadRD } from '~/redux/reload';
import fileGridFS from '~/restAPI/gridFS';
import { PropsBgNEGA } from '~/redux/background';
import Cookies from '~/utils/Cookies';
import { useQuery } from '@tanstack/react-query';
import verifyAPI from '~/restAPI/verifyAPI/verifyAPI';
const DivOpacity = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: #686767a1;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
`;
export interface PropsUser {
    id: string;
    avatar: any;
    fullName: string;
    nickName: string;
    gender: number;
    background: any;
    status: string;
    sn: string;
    l: string;
    w: string;
    as: number;
}
export interface PropsUserPer {
    id: string;
    avatar: any;
    fullName: string;
    nickName: string;
    gender: number;
    background: any;
    status: string;
    sn: string;
    l: string;
    w: string;
    as: number;
    id_f_user: {
        createdAt: string | null;
        idCurrentUser: string | null;
        idFriend: string | null;
        level: number | null;
    };
    id_friend: {
        createdAt: string | null;
        idCurrentUser: string | null;
        idFriend: string | null;
        level: number | null;
    };
    id_m_user: PropsTitleP;
    id_flwing: {
        flwed: number;
        flwing: number;
        id_followed: string;
        id_following: string;
        createdAt: string;
        updatedAt: string;
    };
    id_flwed: {
        flwing: number | null;
        flwed: number | null;
        id_following: string | null;
        id_followed: string | null;
        createdAt: string | null;
        updatedAt: string | null;
    };
    id_loved_user: {
        id_loved: string;
    };
}
type PropsMFirst = {
    user: {
        id: string;
        fullName: string;
        avatar: any;
        gender: number;
    };
    createdAt: string;
    imageOrVideos: { v: any; icon: string }[];
    seenBy: string[];
    text: { t: string; icon: string };
    _id: string;
};
const Authentication = React.lazy(() => import('~/Authentication/Auth'));
const Website = React.lazy(() => import('./mainPage/nextWeb'));
const Message = React.lazy(() => import('~/Message/message'));
function App() {
    const [currentPage, setCurrentPage] = useState<number>(() => {
        return JSON.parse(localStorage.getItem('currentPage') || '{}').currentWeb;
    });
    const { userId, token } = Cookies(); // customs hook
    const dispatch = useDispatch();
    const { idUser, errorServer } = useSelector((state: { hideShow: InitialStateHideShow }) => state.hideShow);
    const { setting, personalPage } = useSelector((state: any) => state.hideShow);
    const { chat, userOnline } = useSelector((state: { reload: PropsReloadRD }) => state.reload);
    const { colorText, colorBg } = useSelector((state: PropsBgNEGA) => state.persistedReducer.background);
    const [userData, setUserData] = useState<PropsUserPer[]>([]);

    const [userFirst, setUserFirst] = useState<PropsUser>();
    const [loading, setLoading] = useState<boolean>(false);
    // messenger
    const [dataMFirst, setDataMFirst] = useState<PropsMFirst[]>([]);
    const [dataMTwo, setDataMTwo] = useState<PropsMFirst>();
    const showChat = useRef<HTMLInputElement | null>(null);

    async function fetch(id: string | string[], first?: string) {
        if (!first) setLoading(true);
        const res = await userAPI.getById(
            token,
            id,
            {
                id: 'id',
                avatar: 'avatar',
                background: 'background',
                fullName: 'fullName',
                nickName: 'nickName',
                status: 'status',
                gender: 'gender',
                as: 'as',
                sn: 'sn',
                l: 'l',
                w: 'w',
            },
            {
                position: 'position',
                star: 'star',
                visit: 'visit',
            },
            first,
        );

        if (!Array.isArray(res)) {
            setUserFirst(res);
        } else {
            setLoading(false);
            return res;
        }
    }
    console.log(userFirst, 'userFirst');
    console.log(userData, 'userData');
    function expire(eleDiv1s: NodeListOf<Element>) {
        for (let i = eleDiv1s.length - 1; i >= 0; i--) {
            const timeOut = setTimeout(() => {
                console.log('nooo');
                Array.from(eleDiv1s)[i].remove();
                return () => clearTimeout(timeOut);
            }, 5000);
        }
    }
    useEffect(() => {
        const search = async () => {
            const search = window.location.search;
            if (search && idUser.length === 0) {
                const ids = search.split('id=');
                if (ids.length < 5 && ids.length > 0) {
                    const datas = await fetch(ids);
                    if (datas) setUserData(datas);
                }
            } else {
                if (idUser.length === 1) {
                    const data = await fetch(idUser);
                    if (data) setUserData(data);
                }
            }
        };
        if (userId && token) search();
        socket.on(`${userId}roomChat`, async (data: PropsMFirst) => {
            const newD = await new Promise<PropsMFirst>(async (resolve, reject) => {
                try {
                    await Promise.all(
                        data.imageOrVideos.map(async (d, index) => {
                            const buffer = await fileGridFS.getFile(token, d.v);
                            const base64 = CommonUtils.convertBase64Gridfs(buffer.file);
                            data.imageOrVideos[index].v = base64;
                        }),
                    );
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });

            const eleDiv1 = document.createElement('div');
            const eleDiv2 = document.createElement('div');
            const eleImg = document.createElement('img');
            const eleH3 = document.createElement('h3');
            const eleDiv3 = document.createElement('div');
            const eleP = document.createElement('p');
            const elePState = document.createElement('p');
            eleDiv1.className = 'showChatDiv1';
            eleImg.className = 'showChatImg';
            eleImg.src = CommonUtils.convertBase64(Buffer.from(newD.user.avatar));
            eleImg.alt = newD.user.fullName;
            eleDiv2.className = 'showChatDiv2';
            eleDiv2.style.color = colorText;
            eleH3.className = 'showChatName';
            eleH3.innerText = newD.user.fullName;
            eleDiv3.className = 'showChatDiv3';
            eleP.className = 'showChatTitle';
            eleP.innerText = newD.text.t;
            elePState.className = 'showChatPState';
            elePState.innerText = 'Vừa xong';
            //Add
            eleDiv3.appendChild(eleP);
            eleDiv3.appendChild(elePState);
            eleDiv2.appendChild(eleH3);
            eleDiv2.appendChild(eleDiv3);
            eleDiv1.appendChild(eleImg);
            eleDiv1.appendChild(eleDiv2);
            if (showChat.current) showChat.current.insertAdjacentElement('beforeend', eleDiv1);
            const eleDiv1s = document.querySelectorAll('.showChatDiv1');
            console.log(eleDiv1s.length, 'eleDiv1s');
            expire(eleDiv1s);
        });
    }, [idUser]);

    useEffect(() => {
        if (dataMTwo) setDataMFirst([...dataMFirst, dataMTwo]);
    }, [dataMTwo]);
    const handleClick = (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        setUserData([]);
        dispatch(setIdUser([]));
    };

    let timeOut: NodeJS.Timeout;
    useEffect(() => {
        if (userId && token) fetch(userId, 'only');
        if (dataMFirst.length > 0) {
            timeOut = setTimeout(() => {
                console.log('time Out');
                setDataMFirst((pre) => pre.filter((p, index) => index !== 0));
            }, 5000);
        }
        return () => clearTimeout(timeOut);
    }, [dataMFirst]);
    console.log(dataMFirst, 'dataMFirst');

    const leng = idUser?.length;
    const css = `
        position: fixed;
        right: 0;
        bottom: 0;
        z-index: 11;
        overflow-y: overlay;
        &::-webkit-scrollbar {
            width: 0px;
            height: 0px;
            border-radius: 0;
        }

`;

    if (token && userId) {
        return (
            <Suspense
                fallback={
                    <Progress
                        title={{
                            vn: 'Đang tải dữ liệu...',
                            en: 'loading data...',
                        }}
                    />
                }
            >
                <ErrorBoudaries
                    check={errorServer.check}
                    message={errorServer.message || 'Server is having a problem. Please try again later!'}
                />
                {userFirst ? (
                    <>
                        <Website idUser={idUser} dataUser={userFirst} setDataUser={setUserFirst} />
                        {(setting || personalPage) && <DivOpacity onClick={handleClick} />}
                        <Div
                            width="240px"
                            wrap="wrap"
                            ref={showChat}
                            css={`
                                position: absolute;
                                top: 57px;
                                right: 50px;
                                z-index: 1;
                                transition: all 1s linear;
                            `}
                        >
                            {dataMFirst.map((m) => (
                                <Div
                                    key={m.createdAt}
                                    width="100%"
                                    wrap="wrap"
                                    css={`
                                        background-color: #276aa5;
                                        border-radius: 50px;
                                        height: 50px;
                                        align-items: center;
                                        padding: 0 3px;
                                        margin: 5px 0;
                                        user-select: none;
                                        color: ${colorText};
                                        transition: all 0.5s linear;
                                        background-image: linear-gradient(45deg, #000000, #8b9aa800);
                                        &:active {
                                            background-color: #484848ba;
                                        }
                                        @media (min-width: 768px) {
                                            cursor: var(--pointer);
                                            &:hover {
                                                background-color: #484848ba;
                                            }
                                        }
                                    `}
                                >
                                    <Avatar
                                        src={CommonUtils.convertBase64(Buffer.from(m.user.avatar))}
                                        gender={m.user.gender}
                                        radius="50%"
                                        css={`
                                            min-width: 35px;
                                            width: 35px;
                                            height: 35px;
                                            margin: 3px 5px;
                                            box-shadow: 0 0 4px #22d056;
                                            border-radius: 50%;
                                        `}
                                    />
                                    {userOnline.includes(m.user.id) && (
                                        <DivPos
                                            bottom="2px"
                                            left="32px"
                                            size="10px"
                                            css="color: #149314; padding: 2px; background-color: #1c1b1b;"
                                        >
                                            <TyOnlineI />
                                        </DivPos>
                                    )}
                                    <Div width="72%" wrap="wrap">
                                        <Hname>{m.user.fullName}</Hname>
                                        <Div
                                            width="100%"
                                            css={`
                                                align-items: center;
                                                position: relative;
                                            `}
                                        >
                                            <P
                                                z="1.2rem"
                                                css="width: 100%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; margin-top: 3px; "
                                            >
                                                {m.text.t}
                                            </P>
                                            <P z="1rem" css="width: 100%; margin-top: 5px; margin-left: 10px">
                                                vừa xong
                                            </P>
                                        </Div>
                                    </Div>
                                    <Div>{/* <Mess */}</Div>
                                </Div>
                            ))}
                        </Div>
                        <Message dataUser={userFirst} userOnline={userOnline} />

                        {chat?.map((room) => (
                            <Conversation
                                key={room.id_room}
                                colorText={colorText}
                                colorBg={colorBg}
                                data={room}
                                currentPage={currentPage}
                                dataFirst={userFirst}
                            />
                        ))}

                        {loading && (
                            <Div
                                width="100%"
                                css={`
                                    height: 100%;
                                    position: absolute;
                                    top: 0px;
                                    z-index: 888;
                                    color: ${colorText};
                                    font-size: 50px;
                                    align-items: center;
                                    justify-content: center;
                                    background-color: #2b2c2d78;
                                `}
                            >
                                <DivLoading css="width: auto;">
                                    <LoadingI />
                                </DivLoading>
                            </Div>
                        )}

                        {userData?.length > 0 && (
                            <DivContainer
                                width="100%"
                                height="100%"
                                css={css}
                                bg={`${colorBg === 1 ? '#272727' : 'white'}`}
                                content={leng === 1 ? 'center' : 'start'}
                                display="flex"
                            >
                                {userData?.length > 1 && (
                                    <Div
                                        css={`
                                            display: none;
                                            @media (max-width: 600px) {
                                                width: auto;
                                                height: auto;
                                                display: flex;
                                                position: fixed;
                                                flex-direction: column;
                                                top: 175px;
                                                right: 7px;
                                                z-index: 88;
                                                border-radius: 50%;
                                            }
                                        `}
                                    >
                                        {userData.map((rs) => {
                                            return (
                                                <A key={rs.id} href={`#profiles${rs.id}`}>
                                                    <Avatar
                                                        src={rs.avatar}
                                                        alt={rs.fullName}
                                                        gender={rs.gender}
                                                        radius="50%"
                                                        id={userId}
                                                        css=" width: 40px; height: 40px; cursor: var(--pointer);"
                                                    />
                                                </A>
                                            );
                                        })}
                                    </Div>
                                )}
                                {userData?.map((data: any, index: number) => (
                                    <Personalpage
                                        setUserFirst={setUserFirst}
                                        userFirst={userFirst}
                                        colorText={colorText}
                                        colorBg={colorBg}
                                        user={data}
                                        online={userOnline}
                                        key={index}
                                        leng={leng}
                                    />
                                ))}
                                <DivPos
                                    position="fixed"
                                    size="30px"
                                    top="20px"
                                    right="11px"
                                    color={colorText}
                                    onClick={handleClick}
                                >
                                    <UndoI />
                                </DivPos>
                            </DivContainer>
                        )}
                    </>
                ) : (
                    <Progress
                        title={{
                            vn: 'Đang tải dữ liệu...',
                            en: 'loading data...',
                        }}
                    />
                )}
            </Suspense>
        );
    }
    return (
        <Suspense
            fallback={
                <Progress
                    title={{
                        vn: 'Vui lòng chờ trong giây lát để thệ thông cập nhật thông tin cho bạn. Xin cảm ơn đã sử dụng dịch vụ của chúng tôi!',
                        en: 'Please wait a while to update your information. Thank you for using our services!',
                    }}
                />
            }
        >
            <Authentication
                dataLogin={{ en: login.en, vi: login.vi }}
                dataRegister={{ vi: register.vi, en: register.en }}
            />
        </Suspense>
    );
}

export default App;
