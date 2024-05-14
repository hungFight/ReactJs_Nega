/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'src/app/utils/Cookies';
import React, { Suspense, useEffect, useRef, useState } from 'react';
// Import Swiper styles
import { InitialStateHideShow, setOpenProfile } from './app/redux/hideShow';
import PersonalPage from './mainPage/personalPage/PersonalPage';
import { login } from './dataText/dataLogin';
import { register } from './dataText/dataRegister';
import { DivContainer, DivLoading, DivPos, Hname } from './app/reUsingComponents/styleComponents/styleComponents';
import styled from 'styled-components';
import { A, Div, P } from './app/reUsingComponents/styleComponents/styleDefault';
import Progress from './app/reUsingComponents/Progress/Progress';
import ErrorBoundaries from './app/reUsingComponents/ErrorBoudaries/ErrorBoudaries';
import { socket } from './mainPage/NextWeb';
import { LoadingI, UndoI } from '~/assets/Icons/Icons';
import userAPI from '~/restAPI/userAPI';
import { PropsMores } from './mainPage/personalPage/layout/TitleOfPers/Title';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import Conversation from '~/Message/Messenger/Conversation/Conversation';
import { PropsReloadRD } from '~/redux/reload';
import { PropsBgRD } from '~/redux/background';
import { PropsRoomChat } from '~/restAPI/chatAPI';
import { gql } from '@apollo/client';
import ServerBusy from '~/utils/ServerBusy';
import { useCookies } from 'react-cookie';
import { decrypt } from '~/utils/crypto';
import { ConversationText } from './dataText/DataMessenger';
import Languages from '~/reUsingComponents/languages';
import { PropsRoomsChatRD } from '~/redux/roomsChat';
import Balloon from './mainPage/Balloon/Balloon';
import subImage from '~/utils/subImage';
import { useQuery } from '@tanstack/react-query';
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
    readonly id: string;
    avatar: any;
    fullName: string;
    gender: number;
    background: any;
    biography: string;
    firstPage: string;
    secondPage: string;
    thirdPage: string;
    active: boolean;
}
export interface PropsUserPer {
    readonly id: string;
    avatar: any;
    fullName: string;
    address: string;
    gender: number;
    birthday: string;
    background: any;
    biography: string;
    active: boolean;
    occupation: string;
    schoolName: string;
    skill: string[];
    hobby: string[];
    firstPage: string;
    secondPage: string;
    thirdPage: string;
    mores: PropsMores[] | [];
    userRequest:
        | {
              id: number;
              idRequest: string;
              idIsRequested: string;
              level: number;
              createdAt: string | Date;
              updatedAt: string | Date;
          }[]
        | [];
    userIsRequested:
        | {
              id: number;
              idRequest: string;
              idIsRequested: string;
              level: number;
              createdAt: string | Date;
              updatedAt: string | Date;
          }[]
        | [];
    isLoved:
        | {
              id: string;
              userId: string;
              idIsLoved: string;
              createdAt: string | Date;
          }[]
        | [];
    loved:
        | {
              id: string;
              userId: string;
              idIsLoved: string;
              createdAt: string | Date;
          }[]
        | [];
    followings:
        | {
              id: string;
              idFollowing: string;
              idIsFollowed: string;
              following: number;
              followed: number;
              createdAt: string | Date;
          }[]
        | [];
    followed:
        | {
              id: string;
              idFollowing: string;
              idIsFollowed: string;
              following: number;
              followed: number;
              createdAt: string | Date;
          }[]
        | [];
    accountUser: {
        account: {
            id: string;
            fullName: string;
            avatar: string | null;
            gender: number;
            phoneNumberEmail: string;
        };
    }[];
}
export type PropsId_chats = {
    conversationId?: string;
    id_other: string;
    top?: number;
    left?: number;
};
const Authentication = React.lazy(() => import('~/Authentication/Auth'));
const Website = React.lazy(() => import('./mainPage/NextWeb'));
const Message = React.lazy(() => import('~/Message/Message'));
function App() {
    const { lg } = Languages();
    const [currentPage, setCurrentPage] = useState<number>(() => {
        return JSON.parse(localStorage.getItem('currentPage') || '{}').currentWeb;
    });
    const [_c, _set, _del] = useCookies(['tks', 'k_user']);
    const dispatch = useDispatch();
    const { userId, token, removeCookies } = Cookies(); // customs hook
    const { openProfile, errorServer } = useSelector((state: { hideShow: InitialStateHideShow }) => state.hideShow);
    const { colorText, colorBg } = useSelector((state: PropsBgRD) => state.persistedReducer.background);
    const { chats, balloon, established } = useSelector((state: PropsRoomsChatRD) => state.persistedReducer.roomsChat);
    const mm = useRef<{ index: number; id: string }[]>([]);
    const { setting, personalPage } = useSelector((state: { hideShow: InitialStateHideShow }) => state.hideShow);
    const { session } = useSelector((state: PropsReloadRD) => state.reload);
    const userOnline = useSelector((state: { userOnlineRD: { userOnline: string[] } }) => state.userOnlineRD.userOnline);
    const [userData, setUsersData] = useState<PropsUserPer[]>([]);
    const [userFirst, setUserFirst] = useState<PropsUser>({
        id: '',
        fullName: '',
        avatar: null,
        gender: 1,
        background: '',
        biography: '',
        firstPage: 'en',
        secondPage: 'en',
        thirdPage: 'en',
        active: true,
    });
    const [loading, setLoading] = useState<boolean>(false);
    // messenger
    const [id_chats, setId_chats] = useState<PropsId_chats[]>(chats);
    const showChat = useRef<HTMLInputElement | null>(null);
    const GET_USERDATA = gql`
        query Get_dataWarning($id: String!) {
            warningData(id: $id) {
                id
                message
            }
        }
    `;
    // const { data } = useQuery(GET_USERDATA, {
    //     variables: {
    //         id: userId,
    //     },
    //     skip: !userId || !token,
    // });
    const [idAbsolute, setIdAbsolute] = useState<string[]>([]);
    const handleCheck = useRef<boolean>(false);
    async function fetchF(id: string | string[], first?: string) {
        if (!first) setLoading(true);
        const res: PropsUser = await userAPI.getById(
            dispatch,
            id,
            {
                id: true,
                avatar: true,
                background: true,
                fullName: true,
                address: true,
                biography: true,
                birthday: true,
                gender: true,
                active: true,
                hobby: true,
                skill: true,
                occupation: true,
                schoolName: true,
                firstPage: true,
                secondPage: true,
                thirdPage: true,
            },
            {
                position: true,
                star: true,
                loverAmount: true,
                friendAmount: true,
                visitorAmount: true,
                followedAmount: true,
                followingAmount: true,
                relationship: true,
                language: true,
                createdAt: true,
                privacy: true,
            },
            first,
        );
        // Tìm ảnh trong mã HTML và lấy URL của ảnh đầu tiên
        if (res)
            if (!Array.isArray(res)) {
                setUserFirst(res);
            } else {
                setLoading(false);
                return res;
            }
    }
    console.log(userFirst, 'userFirst');
    console.log(userData, 'userData');
    const ListEl = useRef<NodeListOf<Element>>();
    const timeouts = useRef<NodeJS.Timeout[]>([]);
    function expire(eleDiv1s: NodeListOf<Element>) {
        for (let i = eleDiv1s.length - 1; i >= 0; i--) {
            const timeOut = setTimeout(() => {
                console.log('nooo');
                Array.from(eleDiv1s)[i].remove();
                return () => clearTimeout(timeOut);
            }, 5000);
            timeouts.current.push(timeOut);
        }
    }
    const [fileUrl, setFileUrl] = useState('');
    const { data } = useQuery({
        queryKey: ['getPersonalAbsolute'],
        staleTime: 5 * 60 * 1000,
        cacheTime: 6 * 60 * 1000,
        enabled: idAbsolute.length ? true : false,
        queryFn: async () => {
            const res: PropsUserPer[] = await userAPI.getById(
                dispatch,
                idAbsolute,
                {
                    id: true,
                    avatar: true,
                    background: true,
                    fullName: true,
                    address: true,
                    biography: true,
                    birthday: true,
                    gender: true,
                    active: true,
                    hobby: true,
                    skill: true,
                    occupation: true,
                    schoolName: true,
                    firstPage: true,
                    secondPage: true,
                    thirdPage: true,
                },
                {
                    position: true,
                    star: true,
                    loverAmount: true,
                    friendAmount: true,
                    visitorAmount: true,
                    followedAmount: true,
                    followingAmount: true,
                    relationship: true,
                    language: true,
                    createdAt: true,
                    privacy: true,
                },
            );
            return res;
        },
    });
    useEffect(() => {
        const search = async () => {
            const search = window.location.search;
            if (search) {
                const ids = search.split('id=').filter((r) => r !== '?');
                if (ids.length < 5 && ids.length > 0) {
                    //  const datas = await fetch(ids);
                    setIdAbsolute(ids);
                    // console.log(ids, 'idsids');
                }
            }
            if (openProfile.newProfile.length === 1) {
                const data = await fetchF(openProfile.newProfile);
                if (data)
                    if (userData.length) {
                        let check = false;
                        userData.forEach((da) => {
                            if (da.id === userId) check = true;
                        });
                        if (!check) {
                            setUsersData((pre) => [data[0], ...pre]);
                        } else {
                            const newD = userData.filter((us) => us.id !== data[0].id);
                            const r = newD.map((us) => (us.id === openProfile.currentId ? data[0] : us));
                            setUsersData([...r]);
                        }
                    } else {
                        setUsersData(data);
                    }
            }
        };
        if (userId && token && !handleCheck.current) search();
        handleCheck.current = false;
        // socket.on(`${userId}roomChat`, async (dt: string) => {
        //     const data: PropsRoomChat = JSON.parse(dt);
        //     console.log(data, 'datadata');
        //     const key = `chat_${data.room.secondary ? data.room.secondary : data._id}`;
        //     const eleDiv1 = document.createElement('div');
        //     const eleDiv2 = document.createElement('div');
        //     const eleImg = document.createElement('img');
        //     const eleH3 = document.createElement('h3');
        //     const eleDiv3 = document.createElement('div');
        //     const eleP = document.createElement('p');
        //     const elePState = document.createElement('p');
        //     eleDiv1.className = 'showChatDiv1';
        //     eleImg.className = 'showChatImg';
        //     eleImg.src = subImage(data.user.avatar, data.user.gender);
        //     eleImg.alt = data.user.fullName;
        //     eleDiv2.className = 'showChatDiv2';
        //     eleDiv2.style.color = colorText;
        //     eleH3.className = 'showChatName';
        //     eleH3.innerText = data.user.fullName;
        //     eleDiv3.className = 'showChatDiv3';
        //     eleP.className = 'showChatTitle';
        //     eleP.innerText = '... ' + decrypt(data.room.text.t, key);
        //     elePState.className = 'showChatPState';
        //     elePState.innerText = 'Vừa xong';
        //     //Add
        //     eleDiv3.appendChild(eleP);
        //     eleDiv3.appendChild(elePState);
        //     eleDiv2.appendChild(eleH3);
        //     eleDiv2.appendChild(eleDiv3);
        //     eleDiv1.appendChild(eleImg);
        //     eleDiv1.appendChild(eleDiv2);
        //     if (showChat.current) showChat.current.insertAdjacentElement('beforeend', eleDiv1);
        //     const eleDiv1s = document.querySelectorAll('.showChatDiv1');
        //     console.log('789', data);
        //     ListEl.current = eleDiv1s;
        //     expire(eleDiv1s);
        // });
    }, [openProfile]);
    const handleStopClearing = () => {
        // stop clearing the show message
        timeouts.current.forEach((t) => clearTimeout(t));
        console.log('Stop clearing', timeouts);
    };
    const handleClear = () => {
        if (ListEl.current) expire(ListEl.current);
    };
    const handleClick = (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        setUsersData([]);
        handleCheck.current = true;
        dispatch(setOpenProfile({ newProfile: [], currentId: '' }));
    };

    useEffect(() => {
        if (userId && token) {
            fetchF(userId, 'only');
        }
    }, [userId]);

    const leng = userData.length;
    const css = `
            position: absolute;
            right: 0;top: 0px;
            z-index: 999;
            overflow-y: overlay;
            &::-webkit-scrollbar {
                width: 0px;
                height: 0px;
                border-radius: 0;
            }

    `;
    // console.log('id_cookie', userId, userData, id_chats, chats);
    if (session === 'NeGA_off') return <ErrorBoundaries code={session} />;
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
                <Div
                    width="100%"
                    css={`
                        color: ${colorText};
                        input {
                            color: ${colorText};
                        }
                        justify-content: center;
                        position: relative;
                        @media (min-width: 2000px) {
                            width: 2000px;
                        }
                    `}
                >
                    {session === 'NeGA_ExcessiveRequest' && <ErrorBoundaries code={session} />}
                    {/* {userFirst ? ( */}
                    <>
                        <Website openProfile={openProfile.newProfile} dataUser={userFirst} setDataUser={setUserFirst} setId_chats={setId_chats} />
                        <Message dataUser={userFirst} userOnline={userOnline} setId_chats={setId_chats} id_chats={id_chats} />
                        {(setting || personalPage) && <DivOpacity onClick={handleClick} />}
                        <Div
                            width="240px"
                            wrap="wrap"
                            ref={showChat}
                            css={`
                                position: fixed;
                                top: 57px;
                                right: 50px;
                                z-index: 9998;
                                transition: all 1s linear;
                            `}
                            onMouseEnter={handleStopClearing}
                            onMouseLeave={handleClear}
                        ></Div>
                        {/* show message from messenger */}
                        {chats.length > 0 && userFirst.id && (
                            <Div css="position: fixed; overflow: overlay; max-width: 100%; bottom: 8px; left: 4px; z-index: 9999;@media(max-width: 500px){width: auto;} @media(max-width: 768px){width: 100%;left: 0;height:100%;}">
                                <Div css="position: relative; width: inherit;">
                                    {id_chats?.map((room, index) => {
                                        const permanent = { index: index + 1, id: room.conversationId || room.id_other };
                                        if (chats.some((c) => c.conversationId === room.conversationId && c.id_other === room.id_other))
                                            return (
                                                <Conversation
                                                    conversationText={ConversationText[lg]}
                                                    userOnline={userOnline}
                                                    key={index}
                                                    index={index}
                                                    colorText={colorText}
                                                    colorBg={colorBg}
                                                    id_chat={room}
                                                    currentPage={currentPage}
                                                    dataFirst={userFirst}
                                                    chat={chats}
                                                    id_chats={id_chats}
                                                    top={room.top}
                                                    left={room.left}
                                                    permanent={permanent}
                                                    setId_chats={setId_chats}
                                                    mm={mm}
                                                    balloon={balloon}
                                                />
                                                // </>
                                            );
                                    })}
                                </Div>
                            </Div>
                        )}
                        <Balloon userFirst={userFirst} colorText={colorText} balloon={balloon} setId_chats={setId_chats} dispatch={dispatch} established={established} />
                        {loading && (
                            <Div
                                width="100%"
                                css={`
                                    height: 100%;
                                    position: absolute;
                                    top: 0px;
                                    z-index: 888;
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
                        {data?.length && (
                            <DivContainer width="100%" height="99%" css={css} bg={`${colorBg === 1 ? '#272727' : 'white'}`} content={leng === 1 ? 'center' : 'start'} display="flex">
                                {data?.length > 1 && (
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
                                        {data?.map((rs) => {
                                            return (
                                                <A key={rs.id} href={`#profiles${rs.id}`}>
                                                    <Avatar src={rs.avatar} alt={rs.fullName} gender={rs.gender} radius="50%" id={userId} css=" width: 40px; height: 40px; cursor: var(--pointer);" />
                                                </A>
                                            );
                                        })}
                                    </Div>
                                )}
                                {data?.map((da, index, arr) => (
                                    <PersonalPage
                                        AllArray={data}
                                        setUsersData={setUsersData}
                                        setUserFirst={setUserFirst}
                                        userFirst={userFirst}
                                        colorText={colorText}
                                        colorBg={colorBg}
                                        user={da}
                                        online={userOnline}
                                        key={index}
                                        index={index}
                                        leng={leng}
                                        handleCheck={handleCheck}
                                        setId_chats={setId_chats}
                                    />
                                ))}

                                <DivPos position="absolute" size="30px" top="15px" right="15px" color={colorText} onClick={handleClick}>
                                    <UndoI />
                                </DivPos>
                            </DivContainer>
                        )}
                    </>
                    {/* ) : (
                    <Progress
                        title={{
                            vn: 'Đang tải dữ liệu...',
                            en: 'loading data...',
                        }}
                    />
                )} */}
                </Div>
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
            <Authentication setUserFirst={setUserFirst} dataLogin={{ en: login.en, vi: login.vi }} dataRegister={{ vi: register.vi, en: register.en }} />
        </Suspense>
    );
}

export default App;
