/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { memo, useState, useRef, useLayoutEffect, useEffect, Suspense } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Buffer } from 'buffer';

import Avatar from '~/reUsingComponents/Avatars/Avatar';
import Button from '~/reUsingComponents/Buttoms/ListButton/Buttons';
import ListWebBar from './listWebBar/listWebBar';
import {
    BalloonI,
    BookI,
    DotI,
    EarthI,
    FriendI,
    GridDotI,
    HomeI,
    NewI,
    PeopleI,
    ProfileI,
    WebsiteI,
    WorkI,
} from '~/assets/Icons/Icons';
import Background from 'src/backbround/background';
import { onPersonalPage, setTrueErrorServer } from '~/redux/hideShow';
import HttpRequestUser from '~/restAPI/userAPI';
import CurrentPageL from './CurrentPage';
import {
    DivAvatar,
    DivPersonalPage,
    DivListWebProfile,
    DivMainPage,
    HfullName,
    Pstatus,
    DivChangeColorBG,
    Apage,
    DivContainer,
    DivOptions,
    PtitleOptions,
    DivDate,
    DivElements,
    DivContainerChangeC,
    DivContainerChangeP,
} from './styleNextWeb';
import Time from './DateTime/DateTime';
import { changeThree } from '~/redux/languageRD';
import Progress from '~/reUsingComponents/Progress/Progress';
import { io } from 'socket.io-client';
import Tools from './Tools/Tools';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import Profile from './profiles/profile';
import NextListWeb from './listWebs/ListWebs';
import PeopleRequest from '~/restAPI/socialNetwork/peopleAPI';
import WarningBrowser from '~/reUsingComponents/ErrorBoudaries/Warning_browser';
import CommonUtils from '~/utils/CommonUtils';
import { PropsUser, PropsUserPer } from 'src/App';
import { PropsBgRD } from '~/redux/background';
import { PropsReloadRD, setOnline } from '~/redux/reload';
export const socket = io('http://localhost:3001', { transports: ['websocket'] });

const Website: React.FC<{
    openProfile: string[];
    dataUser: PropsUser;
    setDataUser: React.Dispatch<React.SetStateAction<PropsUser | undefined>>;
    setId_chats: React.Dispatch<
        React.SetStateAction<
            {
                id_room: string | undefined;
                id_other: string;
            }[]
        >
    >;
}> = ({ openProfile, dataUser, setDataUser, setId_chats }) => {
    const dispatch = useDispatch();
    const { colorText, colorBg } = useSelector((state: PropsBgRD) => state.persistedReducer.background);
    const userOnline = useSelector((state: PropsReloadRD) => state.reload.userOnline);

    const [cookies, setCookie] = useCookies(['tks', 'k_user']);
    const [friendsOnline, setFriendsOnline] = useState<number>(0);
    const [friends, setFriends] = useState<{ idFriend: string; idCurrentUser: string }[]>([]);
    const [warningBrs, setWarningBrs] = useState<
        | {
              dateTime: string;
              err: number;
              prohibit: boolean;
          }
        | undefined
    >();
    const userId = cookies.k_user;
    useEffect(() => {
        const browserId = navigator.userAgent;
        socket.on(userId + browserId + 'browserId', (data) => {
            console.log(JSON.parse(data));
            setWarningBrs(JSON.parse(data));
        });
    }, []);
    useEffect(() => {
        if (dataUser.active) {
            socket.emit('sendId', userId);
            socket.on('user connectedd', (re) => {
                console.log(`connected`, JSON.parse(re));
                dispatch(setOnline(JSON.parse(re)));
            });
            socket.on('user disconnected', (re) => {
                dispatch(setOnline(JSON.parse(re)));
                console.log('user disconnected', JSON.parse(re));
            });
        } else {
            socket.emit('offline', userId);
        }
    }, [dataUser]);
    useEffect(() => {
        const am = friends?.reduce((total, value) => {
            return (userOnline.includes(value.idFriend) && !value.idFriend.includes(userId)) ||
                (userOnline.includes(value.idCurrentUser) && !value.idCurrentUser.includes(userId))
                ? total + 1
                : total;
        }, 0);
        setFriendsOnline(am);
        console.log(userOnline, 'dd');
    }, [friends, userOnline.length]);
    const [optionWebsite, setOptionWebsite] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(() => {
        return JSON.parse(localStorage.getItem('currentPage') || '{}').currentWeb;
    });

    const [hrefState, setHrefState] = useState<string>('');
    function reTap() {
        if (
            window.location.pathname.includes('SN') &&
            !window.location.pathname.includes('SD') &&
            !window.location.pathname.includes('W')
        ) {
            hanNextWebsite1();
        } else if (
            window.location.pathname.includes('SD') &&
            !window.location.pathname.includes('SN') &&
            !window.location.pathname.includes('W')
        ) {
            hanNextWebsite2();
        } else if (
            window.location.pathname.includes('W') &&
            !window.location.pathname.includes('SD') &&
            !window.location.pathname.includes('SN')
        ) {
            hanNextWebsite3();
        } else {
            setCurrentPage(0);
            setOptionWebsite(false);
        }
    }
    useEffect(() => {
        localStorage.setItem('currentPage', JSON.stringify({ currentWeb: currentPage }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);
    window.addEventListener('popstate', reload);
    function reload() {
        setHrefState(document.location.href);
        reTap();
    }
    const handleNextStart = () => {
        setOptionWebsite(false);
        setCurrentPage(0);
    };
    const hanNextWebsite1 = () => {
        setOptionWebsite(true);
        setCurrentPage(1);
    };
    const hanNextWebsite2 = () => {
        setOptionWebsite(true);
        setCurrentPage(2);
    };
    const hanNextWebsite3 = () => {
        setOptionWebsite(true);
        setCurrentPage(3);
    };
    useLayoutEffect(() => {
        reTap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hrefState]);

    const props2 = {
        handleNextStart,
        hanNextWebsite1,
        hanNextWebsite2,
        hanNextWebsite3,
    };
    const buttonPage = [
        {
            Tag: Apage,
            link: '/SN',
            next: hanNextWebsite1,
            name: 'News',
            icon: <NewI />,
        },
        {
            Tag: Apage,
            link: '/SD',
            next: hanNextWebsite2,
            name: 'Study',
            icon: <BookI />,
        },
        {
            Tag: Apage,
            link: '/W',
            next: hanNextWebsite3,
            name: 'Work',
            icon: <WorkI />,
        },
    ];
    const [option, setOption] = useState<React.ReactNode>(<NextListWeb data={buttonPage} />);

    const handleProfile = () => {
        setOption(<Profile />);
    };
    const handleWebsite = () => {
        setOption(<NextListWeb data={buttonPage} />);
    };
    const handleProfileMain = () => {
        dispatch(onPersonalPage());
    };
    const onli = userOnline.includes(userId) ? 'border: 1px solid #418a7a;' : 'border: 1px solid #696969;';
    console.log('userrrrrr', dataUser);

    const elRef = useRef<any>();
    const xRef = useRef<number | null>(null);
    const yRef = useRef<number | null>(null);

    const handleTouchMove = (e: any) => {
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const elementRect = elRef.current.getBoundingClientRect();
        console.log(x, y, viewportWidth, viewportHeight, elementRect);
        if (elRef.current) {
            if (viewportWidth - 10 >= x && x >= 19) {
                xRef.current = x - 20;
                elRef.current.style.left = `${x - 20}px`;
            }
            if (viewportHeight - 10 >= y && y >= 24) {
                yRef.current = y - 20;
                elRef.current.style.top = `${y - 20}px`;
            }
        }
        // Đặt vị trí cho phần tử
    };

    return (
        <>
            <DivMainPage>
                {warningBrs && (
                    <WarningBrowser currentPage={currentPage} warningBros={warningBrs} setWarningBrs={setWarningBrs} />
                )}
                {dataUser ? (
                    <>
                        <Suspense>
                            {!openProfile.includes(userId) && (
                                <Avatar
                                    ref={elRef}
                                    profile
                                    src={dataUser.avatar}
                                    alt={dataUser.fullName}
                                    gender={dataUser.gender}
                                    radius="50%"
                                    id={dataUser.id}
                                    onTouchMove={handleTouchMove}
                                    css={`
                                        width: 40px;
                                        height: 40px;
                                        position: absolute;
                                        top: ${(yRef.current || 134) + 'px'};
                                        left: ${(xRef.current || 'unset') + 'px'};
                                        right: 7px;
                                        z-index: 88;
                                        border-radius: 50%;
                                        cursor: var(--pointer);
                                        ${onli}
                                    `}
                                />
                            )}
                            <Div
                                css={`
                                    width: 50px;
                                    height: 50px;
                                    position: fixed;
                                    top: 195px;
                                    right: 5px;
                                    font-size: 50px;
                                    z-index: 88;
                                    cursor: var(--pointer);
                                    color: ${colorText};
                                `}
                            >
                                <Div
                                    css={`
                                        position: relative;
                                        img {
                                            width: 57%;
                                            height: 59%;
                                            position: absolute;
                                            top: 2px;
                                            right: 10px;
                                        }
                                    `}
                                >
                                    <BalloonI />
                                    <Img src={dataUser.avatar} alt={dataUser.fullName} radius="50%" />
                                </Div>
                            </Div>
                            <CurrentPageL
                                currentPage={currentPage}
                                listPage={optionWebsite}
                                dataUser={{
                                    avatar: dataUser.avatar,
                                    fullName: dataUser.fullName,
                                    gender: dataUser.gender,
                                }}
                                setId_chats={setId_chats}
                            />
                        </Suspense>
                        {!optionWebsite && (
                            <DivListWebProfile backgr={colorBg}>
                                <DivDate color={colorText}>
                                    <Time />
                                </DivDate>
                                <DivPersonalPage
                                    width="430px"
                                    height="150px"
                                    margin="10px"
                                    wrap="wrap"
                                    content="center"
                                >
                                    <DivAvatar
                                        css={`
                                            ${onli}
                                        `}
                                    >
                                        <Avatar
                                            profile
                                            src={dataUser.avatar}
                                            alt={dataUser.fullName}
                                            gender={dataUser.gender}
                                            radius="50%"
                                            id={cookies.k_user}
                                        />
                                    </DivAvatar>
                                    <HfullName color={colorText}>{dataUser.fullName}</HfullName>
                                    <Pstatus color={colorText}>{dataUser.biography}</Pstatus>
                                </DivPersonalPage>
                                <DivChangeColorBG>
                                    <Background dispatch={dispatch} />
                                </DivChangeColorBG>
                                <DivContainerChangeP>
                                    <DivContainerChangeC>
                                        <DivOptions>
                                            <DivElements color={colorText} onClick={handleWebsite}>
                                                <WebsiteI />
                                            </DivElements>
                                            <DivElements color={colorText} onClick={handleProfile}>
                                                <ProfileI />
                                            </DivElements>
                                            <DivElements
                                                color={colorText}
                                                onClick={() =>
                                                    setOption(
                                                        <Tools
                                                            dataUser={dataUser}
                                                            setDataUser={setDataUser}
                                                            userId={userId}
                                                            colorText={colorText}
                                                            colorBg={colorBg}
                                                            active={dataUser.active}
                                                        />,
                                                    )
                                                }
                                            >
                                                <GridDotI />
                                            </DivElements>
                                            <Div
                                                css={`
                                                    position: absolute;
                                                    top: 139px;
                                                    flex-direction: column;
                                                    font-size: 22px;
                                                    left: 18px;
                                                    color: ${colorText};
                                                `}
                                            >
                                                <Div>
                                                    <EarthI /> <P>{userOnline.length}</P>
                                                </Div>
                                                <Div>
                                                    <FriendI /> <P>{friendsOnline}</P>
                                                </Div>
                                            </Div>
                                        </DivOptions>
                                    </DivContainerChangeC>
                                    <DivContainer bg={colorBg}>{option}</DivContainer>
                                </DivContainerChangeP>
                            </DivListWebProfile>
                        )}
                        {optionWebsite && <ListWebBar {...props2} colorBg={colorBg} colorText={colorText} />}
                    </>
                ) : (
                    <Progress
                        title={{
                            vn: 'Đang tải dữ liệu...',
                            en: 'loading data...',
                        }}
                    />
                )}
            </DivMainPage>
        </>
    );
};

export default memo(Website);
