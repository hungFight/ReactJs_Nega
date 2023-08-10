import { memo, useEffect, useRef } from 'react';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, EffectCoverflow } from 'swiper';
import 'swiper/css/effect-coverflow';

import clsx from 'clsx';
import {
    CloseI,
    SendI,
    MoveI,
    UndoI,
    BeforeI,
    ProfileI,
    ProfileCircelI,
    LoadingI,
    MinusI,
    CheckI,
} from '~/assets/Icons/Icons';
import Hovertitle from '~/reUsingComponents/HandleHover/HoverTitle';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import useDebounce from '~/reUsingComponents/hook/useDebounce';
import { DivIconMs } from '../styleMessage';
import { DivResults, DivSend } from './styleSed';
import { Div, Input, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivPost } from '~/social_network/components/Header/layout/Home/styleHome';
import { DivLoading, DivPos, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import ListAccounts from './SendReults';
import MoreOption from './MoreOption';
import Conversation from './Conversation';
import sendChatAPi, { PropsRoomChat } from '~/restAPI/chatAPI';
import { useCookies } from 'react-cookie';
import CommonUtils from '~/utils/CommonUtils';
import { socket } from 'src/mainPage/nextWeb';
import { useDispatch, useSelector } from 'react-redux';
import { PropsReloadRD } from '~/redux/reload';
import { useQuery } from '@tanstack/react-query';
import gridFS from '~/restAPI/gridFS';
import { setOpenProfile } from '~/redux/hideShow';

const Send: React.FC<{
    colorText: string;
    colorBg: number;
    dataUser: { id: string; avatar: any; fullName: string; nickName: string; gender: number };
    userOline: string[];
}> = ({ colorBg, colorText, dataUser, userOline }) => {
    const dispatch = useDispatch();
    const roomChat = useSelector((state: PropsReloadRD) => state.reload.roomChat);
    const [send, setSend] = useState(false);
    const [cookies, setCookies] = useCookies(['k_user', 'tks']);
    const userId = cookies.k_user;
    const token = cookies.tks;
    const [searchUser, setSearchUser] = useState<string>('');
    const [resultSearch, setResultSearch] = useState<any>([]);
    const [rooms, setRooms] = useState<PropsRoomChat[]>([]);
    const [roomNew, setRoomNew] = useState<PropsRoomChat>();
    const [loading, setLoadind] = useState<boolean>(false);
    const [loadDel, setLoadDel] = useState<boolean>(false);
    const limit = 10;
    const offset = useRef<number>(0);

    const [moreBar, setMoreBar] = useState<{
        id_room: string;
        id: string;
        avatar: string;
        fullName: string;
        gender: number;
    }>({
        id_room: '',
        id: '',
        avatar: '',
        fullName: '',
        gender: 0,
    });
    const handleShowHide = () => {
        setSend(!send);
    };
    useEffect(() => {
        async function fetchRoom() {
            setLoadind(true);
            const res = await sendChatAPi.getRoom(token, limit, offset.current);
            if (res) setRooms(res);
            setLoadind(false);
            console.log(res, 'get Room');
        }
        fetchRoom();

        socket.on(`${userId}roomChat`, async (d: string) => {
            const data: PropsRoomChat = JSON.parse(d);
            const a = CommonUtils.convertBase64(data.user.avatar);
            data.user.avatar = a;
            data.users = [data.user];
            const newD = await new Promise<PropsRoomChat>(async (resolve, reject) => {
                try {
                    await Promise.all(
                        data.room.imageOrVideos.map(async (d, index) => {
                            const buffer = await gridFS.getFile(token, d.v);
                            const base64 = CommonUtils.convertBase64GridFS(buffer.file);
                            data.room.imageOrVideos[index].v = base64;
                        }),
                    );
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
            setRoomNew(newD);
        });
    }, []);
    useEffect(() => {
        if (roomNew) {
            const newR = rooms.filter((r) => r._id !== roomNew._id);
            setRooms([roomNew, ...newR]);
        }
    }, [roomNew]);
    useEffect(() => {
        if (roomChat) {
            const newR = rooms.filter((r) => r._id !== roomChat._id);
            setRooms([roomChat, ...newR]);
        }
    }, [roomChat]);
    const handleUndo = () => {};
    // const debounce = useDebounce(searchUser, 500);
    // useEffect(() => {
    //     if (!searchUser) {
    //         setResultSearch([]);
    //         return;
    //     }
    //     const fechApi = async () => {
    //         // const results = await userService.search(searchUser);
    //         // setResultSearch(results);
    //     };

    //     fechApi();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [debounce]);
    const handleSearch = (e: { target: { value: string } }) => {
        setSearchUser(e.target.value);
    };
    console.log(searchUser);
    const handleDelete = async () => {
        setLoadDel(true);
        const res = await sendChatAPi.delete(token, moreBar.id_room);
        if (res) setRooms((pre) => pre.filter((r) => r._id !== moreBar.id_room));
        setLoadDel(false);
    };
    const dataMore: {
        options: {
            id: number;
            load?: boolean;
            name: string;
            icon: JSX.Element;
            onClick: () => any;
        }[];
        id_room: string;
        id: string;
        avatar: string;
        fullName: string;
        gender: number;
    } = {
        ...moreBar,
        options: [
            {
                id: 1,
                name: 'View Profile',
                icon: <ProfileCircelI />,
                onClick: () => dispatch(setOpenProfile([moreBar.id])),
            },
        ],
    };
    if (rooms.some((r) => r._id === moreBar.id_room)) {
        dataMore.options.push({
            id: 2,
            name: 'Remove',
            load: loadDel,
            icon: loadDel ? (
                <DivLoading css="font-size: 12px; margin: 0;">
                    <LoadingI />
                </DivLoading>
            ) : rooms.some((r) => r._id === moreBar.id_room) ? (
                <MinusI />
            ) : (
                <CheckI />
            ),
            onClick: () => handleDelete(),
        });
    }

    return (
        <>
            {!send && (
                <Hovertitle Tags={DivIconMs} title="Send" size="23px" color={colorText} onClick={handleShowHide}>
                    <SendI />
                    <p className={clsx('miss')}>+</p>
                </Hovertitle>
            )}
            {send && (
                <DivSend onTouchMove={(e) => e.stopPropagation()}>
                    <Div
                        width="100%"
                        css={`
                            height: 40px;
                            align-items: center;
                            justify-content: space-evenly;
                            position: relative;
                            color: ${colorText};
                        `}
                    >
                        <Div
                            css="width: 40px; height: 100%; align-items: center; justify-content: center; font-size: 22px; "
                            onClick={handleShowHide}
                        >
                            <UndoI />
                        </Div>
                        <Input
                            type="text"
                            value={searchUser}
                            placeholder="Search"
                            onChange={handleSearch}
                            color={colorText}
                            border="0"
                            width="auto"
                            margin="0"
                        />
                        <DivPos width="35px" right="50px" onClick={() => setSearchUser('')}>
                            <CloseI />
                        </DivPos>
                        <Avatar
                            src={dataUser.avatar}
                            alt={dataUser.fullName}
                            gender={dataUser.gender}
                            radius="50%"
                            css="width: 35px; height: 35px;"
                        />
                    </Div>
                    <DivResults>
                        <Div css=".swiper{padding: 14px 2px;} .swiper-slide, swiper-slide{user-select: none;} .swiper-pagination{top: 70px !important; height: 1px !important;} padding: 5px 2px;">
                            <Swiper
                                slidesPerView={6}
                                spaceBetween={10}
                                pagination={{
                                    type: 'progressbar',
                                }}
                                modules={[Pagination]}
                                className="mySwiper"
                            >
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                        <Hname>Nguyen Trong Hung</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://hips.hearstapps.com/hmg-prod/images/cutest-dog-breeds-64358b34b2905.jpeg?crop=0.891xw:0.357xh;0,0.137xh&resize=1200:*"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                        <Hname>Nguyen Hung</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://www.brightstarbuddies.com.au/blog/wp-content/uploads/sites/8/bonniechessiegirl4-2.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                        <Hname>Ngoc Linh</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                        <Hname>MNgoc Phuong</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                        <Hname>Hiseper</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                        <Hname>Hiseper</Hname>
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                    </Div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Div>
                                        <Avatar
                                            src="https://pbs.twimg.com/media/DefM3PPXcAABTmm.jpg"
                                            gender={0}
                                            radius="50%"
                                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                                        />
                                    </Div>
                                </SwiperSlide>
                            </Swiper>
                        </Div>
                        {loading ? (
                            <DivLoading>
                                <LoadingI />
                            </DivLoading>
                        ) : (
                            rooms.map((r) => (
                                <ListAccounts
                                    key={r._id + r.room._id}
                                    data={r}
                                    userId={userId}
                                    colorText={colorText}
                                    colorBg={colorBg}
                                    setMoreBar={setMoreBar}
                                />
                            ))
                        )}
                        {moreBar.id && <MoreOption dataMore={dataMore} colorText={colorText} setMoreBar={setMoreBar} />}
                    </DivResults>
                </DivSend>
            )}
        </>
    );
};

export default memo(Send);
