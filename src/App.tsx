/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from 'react-redux';
import Cookies from '~/utils/Cookies';

import { Buffer } from 'buffer';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import React, { RefObject, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { InitialStateHideShow, setCurrentIdProfile, setOpenProfile } from './app/redux/hideShow';
import PersonalPage from './mainPage/personalPage/PersonalPage';
import { login } from './dataMark/dataLogin';
import { register } from './dataMark/dataRegister';
import { DivContainer, DivLoading, DivPos, Hname } from './app/reUsingComponents/styleComponents/styleComponents';
import styled from 'styled-components';
import { A, Div, P } from './app/reUsingComponents/styleComponents/styleDefault';
import Progress from './app/reUsingComponents/Progress/Progress';
import ErrorBoundaries from './app/reUsingComponents/ErrorBoudaries/ErrorBoudaries';
import { socket } from './mainPage/nextWeb';
import { DotI, LoadingI, TyOnlineI, UndoI } from '~/assets/Icons/Icons';
import CommonUtils from '~/utils/CommonUtils';
import userAPI from '~/restAPI/userAPI';
import { PropsMores } from './mainPage/personalPage/layout/TitleOfPers/Title';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import Conversation from '~/Message/Messenger/Conversation/Conversation';
import { PropsReloadRD, setRoomChat, setSession } from '~/redux/reload';
import { PropsBgRD } from '~/redux/background';
import Images from '~/assets/images';
import { PropsRoomChat } from '~/restAPI/chatAPI';
import { useNavigate } from 'react-router-dom';
import refreshToken from '~/refreshToken/refreshToken';
import http from '~/utils/http';
import { useQuery, gql } from '@apollo/client';
import { PropsChat } from '~/Message/Messenger/Conversation/LogicConver';
import ServerBusy from '~/utils/ServerBusy';
import { useCookies } from 'react-cookie';

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
    biography: string;
    firstPage: string;
    secondPage: string;
    thirdPage: string;
    active: boolean;
}
export interface PropsUserPer {
    id: string;
    avatar: any;
    fullName: string;
    nickName: string;
    address: string;
    gender: number;
    birthday: string;
    background: any;
    biography: string;
    active: string;
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
              createdAt: string;
              updatedAt: string;
          }[]
        | [];
    userIsRequested:
        | {
              id: number;
              idRequest: string;
              idIsRequested: string;
              level: number;
              createdAt: string;
              updatedAt: string;
          }[]
        | [];
    isLoved:
        | {
              id: string;
              userId: string;
              idIsLoved: string;
              createdAt: string;
          }[]
        | [];
    loved:
        | {
              id: string;
              userId: string;
              idIsLoved: string;
              createdAt: string;
          }[]
        | [];
    followings:
        | {
              id: string;
              idFollowing: string;
              idIsFollowed: string;
              following: number;
              followed: number;
              createdAt: string;
          }[]
        | [];
    followed:
        | {
              id: string;
              idFollowing: string;
              idIsFollowed: string;
              following: number;
              followed: number;
              createdAt: string;
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
const Authentication = React.lazy(() => import('~/Authentication/Auth'));
const Website = React.lazy(() => import('./mainPage/nextWeb'));
const Message = React.lazy(() => import('~/Message/Message'));
function App() {
    const [currentPage, setCurrentPage] = useState<number>(() => {
        return JSON.parse(localStorage.getItem('currentPage') || '{}').currentWeb;
    });
    const [_c, _set, _del] = useCookies(['tks', 'k_user']);

    const dispatch = useDispatch();
    const { userId, token, removeCookies } = Cookies(); // customs hook
    const { openProfile, errorServer } = useSelector((state: { hideShow: InitialStateHideShow }) => state.hideShow);
    const { colorText, colorBg, chats } = useSelector((state: PropsBgRD) => state.persistedReducer.background);

    const { setting, personalPage } = useSelector((state: { hideShow: InitialStateHideShow }) => state.hideShow);
    const { userOnline, session, delIds } = useSelector((state: PropsReloadRD) => state.reload);
    const [userData, setUsersData] = useState<PropsUserPer[]>([]);

    const [userFirst, setUserFirst] = useState<PropsUser>();
    const [loading, setLoading] = useState<boolean>(false);
    // messenger
    const [id_chats, setId_chats] = useState<{ id_room: string | undefined; id_other: string }[]>(chats);
    const showChat = useRef<HTMLInputElement | null>(null);
    const GET_USERDATA = gql`
        query Get_dataWarning($id: String!) {
            warningData(id: $id) {
                id
                message
            }
        }
    `;
    const { data } = useQuery(GET_USERDATA, {
        variables: {
            id: userId,
        },
        skip: !userId || !token,
    });
    console.log(data, 'GraphQL dat');
    const handleCheck = useRef<boolean>(false);
    async function fetch(id: string | string[], first?: string) {
        if (!first) setLoading(true);
        const res: PropsUserPer[] | PropsUser = await userAPI.getById(
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

            first,
        );
        const data: typeof res = ServerBusy(res, dispatch);
        console.log(data, 'dfaf');

        if (!Array.isArray(data)) {
            setUserFirst(data);
        } else {
            setLoading(false);
            return data;
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
            if (search && openProfile.newProfile.length === 0) {
                console.log('2222');

                const ids = search.split('id=');
                if (ids.length < 5 && ids.length > 0) {
                    const datas = await fetch(ids);
                    console.log('personal', ids, datas);
                    if (datas) setUsersData(datas);
                }
            } else {
                if (openProfile.newProfile.length === 1) {
                    const data = await fetch(openProfile.newProfile);
                    if (data)
                        if (userData.length) {
                            let check = false;
                            userData.forEach((da) => {
                                if (da.id === userId) check = true;
                            });
                            if (!check) {
                                console.log('voos', data, userData);

                                setUsersData((pre) => [data[0], ...pre]);
                            } else {
                                setUsersData((pre) => {
                                    const newD = pre.filter((us) => us.id !== data[0].id);
                                    return newD.map((us) => {
                                        if (us.id === openProfile.currentId) {
                                            return data[0];
                                        } else {
                                            return us;
                                        }
                                    });
                                });
                                console.log(userData, 'uuu');
                            }
                        } else {
                            setUsersData(data);
                        }
                }
            }
        };
        if (userId && token && !handleCheck.current) search();
        handleCheck.current = false;
        socket.on(`${userId}roomChat`, async (dt: string) => {
            const data: PropsRoomChat = JSON.parse(dt);
            const eleDiv1 = document.createElement('div');
            const eleDiv2 = document.createElement('div');
            const eleImg = document.createElement('img');
            const eleH3 = document.createElement('h3');
            const eleDiv3 = document.createElement('div');
            const eleP = document.createElement('p');
            const elePState = document.createElement('p');
            eleDiv1.className = 'showChatDiv1';
            eleImg.className = 'showChatImg';
            eleImg.src = data.user.avatar
                ? CommonUtils.convertBase64(Buffer.from(data.user.avatar))
                : data.user.gender === 0
                ? Images.defaultAvatarMale
                : data.user.gender === 1
                ? Images.defaultAvatarFemale
                : Images.defaultAvataLgbt;
            eleImg.alt = data.user.fullName;
            eleDiv2.className = 'showChatDiv2';
            eleDiv2.style.color = colorText;
            eleH3.className = 'showChatName';
            eleH3.innerText = data.user.fullName;
            eleDiv3.className = 'showChatDiv3';
            eleP.className = 'showChatTitle';
            eleP.innerText = data.room.text.t;
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
            expire(eleDiv1s);
        });
    }, [openProfile]);

    const handleClick = (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        setUsersData([]);
        handleCheck.current = true;
        dispatch(setOpenProfile({ newProfile: [], currentId: '' }));
    };

    useEffect(() => {
        if (userId && token) {
            fetch(userId, 'only');
        }
    }, [userId]);

    const leng = userData.length;
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
    console.log('id_cookie', userId);

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
                {session ? <ErrorBoundaries message={session} /> : ''}
                {userFirst ? (
                    <>
                        <Website openProfile={openProfile.newProfile} dataUser={userFirst} setDataUser={setUserFirst} />
                        <Message
                            dataUser={userFirst}
                            userOnline={userOnline}
                            setId_chats={setId_chats}
                            id_chats={id_chats}
                        />
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
                        ></Div>

                        <Div
                            wrap="wrap"
                            className="containChat"
                            css="position: fixed; bottom: 0; right: 360px; z-index: 103; height: 93%; justify-content: space-around; overflow-y: overlay  "
                        >
                            {/* <Swiper
                                    slidesPerView={2}
                                    spaceBetween={30}
                                    centeredSlides={true}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    modules={[Pagination]}
                                    className="mySwiper"
                                > */}
                            {id_chats?.map((room, index) => (
                                // <SwiperSlide key={index}>
                                <Conversation
                                    key={index}
                                    index={index}
                                    colorText={colorText}
                                    colorBg={colorBg}
                                    id_chat={room}
                                    currentPage={currentPage}
                                    dataFirst={userFirst}
                                    chat={chats}
                                    id_chats={id_chats}
                                />
                                // </SwiperSlide>
                            ))}
                            {/* </Swiper> */}
                        </Div>
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
                                {userData?.map((data, index, arr) => (
                                    <PersonalPage
                                        AllArray={userData}
                                        setUsersData={setUsersData}
                                        setUserFirst={setUserFirst}
                                        userFirst={userFirst}
                                        colorText={colorText}
                                        colorBg={colorBg}
                                        user={data}
                                        online={userOnline}
                                        key={index}
                                        index={index}
                                        leng={leng}
                                        handleCheck={handleCheck}
                                        setId_chats={setId_chats}
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
                setUserFirst={setUserFirst}
                dataLogin={{ en: login.en, vi: login.vi }}
                dataRegister={{ vi: register.vi, en: register.en }}
            />
        </Suspense>
    );
}

export default App;
