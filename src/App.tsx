import { useDispatch, useSelector } from 'react-redux';
import { InitialStateHideShow, offAll, onPersonalPage, setIdUser } from './app/redux/hideShow';
import { Buffer } from 'buffer';

import Personalpage from './mainPage/personalPage/PersonalPage';
import { login } from './dataMark/dataLogin';
import { register } from './dataMark/dataRegister';
import React, { Suspense, useEffect, useLayoutEffect, useState } from 'react';
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
    const [dataMFirst, setDataMFirst] = useState<
        {
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
        }[]
    >([]);

    async function fetch(id: string, first?: string) {
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
        if (res?.avatar) {
            const av = CommonUtils.convertBase64(res.avatar);
            res.avatar = av;
            console.log(res, 'sss');
        }
        if (res?.background) {
            const av = CommonUtils.convertBase64(res.background);
            res.background = av;
        }

        if (first) {
            setUserFirst(res);
        } else {
            setLoading(false);
            return res;
        }
    }
    console.log(userFirst, 'userFirst');
    console.log(userData, 'userData');
    useEffect(() => {
        const search = async () => {
            const search = window.location.search;
            if (search && idUser.length === 0) {
                const id = search.split('id=');
                const ids = [];
                const datas: PropsUserPer[] = [];
                if (id.length < 5 && id.length > 0) {
                    for (let i = 1; i < id.length; i++) {
                        ids.push(id[i]);
                        const data = await fetch(id[i]);
                        if (data) datas.push(data);
                    }
                    if (datas.length > 0) setUserData(datas);
                }
            }
        };
        if (userId && token) search();
        socket.on(
            `${userId}roomChat`,
            async (data: {
                user: {
                    id: string;
                    fullName: string;
                    avatar: Buffer;
                    gender: number;
                };
                createdAt: string;
                imageOrVideos: { v: string; icon: string }[];
                seenBy: string[];
                text: { t: string; icon: string };
                _id: string;
            }) => {
                const newD: any = await new Promise(async (resolve, reject) => {
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

                setDataMFirst([...dataMFirst, newD]);
                console.log(newD, 'be sent by others');
            },
        );
    }, []);
    useEffect(() => {
        const search = async () => {
            if (idUser.length === 1) {
                const data = await fetch(idUser[0]);
                if (data) setUserData([data]);
            }
        };
        if (userId && token) search();
    }, [idUser]);

    const handleClick = (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        setUserData([]);
        dispatch(setIdUser([]));
    };
    useEffect(() => {
        if (userId && token) fetch(userId, 'first');
    }, [userId]);

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
                {/* <Div>Helloo</Div> */}
                <ErrorBoudaries
                    check={errorServer.check}
                    message={errorServer.message || 'Server is having a problem. Please try again later!'}
                />
                {userFirst && (
                    <>
                        <Website idUser={idUser} dataUser={userFirst} setDataUser={setUserFirst} />
                        {(setting || personalPage) && <DivOpacity onClick={handleClick} />}
                        <Div
                            css={`
                                position: absolute;
                                top: 57px;
                                right: 50px;
                                z-index: 1;
                            `}
                        >
                            {dataMFirst.map((m) => (
                                <Div
                                    key={m.user.id}
                                    width="200px"
                                    css={`
                                        background-color: #276aa5;
                                        border-radius: 50px;
                                        height: 40px;
                                        align-items: center;
                                        padding: 0 3px;
                                        margin: 5px 0;
                                        user-select: none;
                                        color: ${colorText};
                                        transition: all 0.5s linear;
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
                                            min-width: 30px;
                                            width: 30px;
                                            height: 30px;
                                            margin: 3px 5px;
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
                                            width="80%"
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
                                                {/* {Time} */}
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
