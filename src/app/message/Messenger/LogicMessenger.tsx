import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from 'src/mainPage/nextWeb';
import { ClockCirclesI, LoadingI, MinusI, ProfileCircelI } from '~/assets/Icons/Icons';
import { DivLoading } from '~/reUsingComponents/styleComponents/styleComponents';
import { setOpenProfile } from '~/redux/hideShow';
import { PropsReloadRD, setDelIds, setSession } from '~/redux/reload';
import sendChatAPi, { PropsRoomChat } from '~/restAPI/chatAPI';
import gridFS from '~/restAPI/gridFS';
import CommonUtils from '~/utils/CommonUtils';
import ServerBusy from '~/utils/ServerBusy';
import CryptoJS from 'crypto-js';
import Languages from '~/reUsingComponents/languages';
import { PropsReMessengerRD } from '~/redux/messenger';
import { PropsUser } from 'src/App';
export interface PropsDataMore {
    [en: string]: {
        options: {
            id: number;
            load?: boolean;
            name: string;
            icon: JSX.Element;
            onClick: () => any;
        }[];
        id_room: string;
        id: string | undefined;
        avatar: string | undefined;
        fullName: string | undefined;
        gender: number | undefined;
    };
    vi: {
        options: {
            id: number;
            load?: boolean;
            name: string;
            icon: JSX.Element;
            onClick: () => any;
        }[];
        id_room: string;
        id: string | undefined;
        avatar: string | undefined;
        fullName: string | undefined;
        gender: number | undefined;
    };
}
const LogicMessenger = (dataUser: PropsUser) => {
    const dispatch = useDispatch();
    const { lg } = Languages();
    const { delIds } = useSelector((state: PropsReloadRD) => state.reload);
    const { roomChat } = useSelector((state: PropsReMessengerRD) => state.messenger);

    const [cookies, setCookies, _del] = useCookies(['k_user', 'tks']);
    const userId = cookies.k_user;

    const [rooms, setRooms] = useState<PropsRoomChat[]>([]);
    const [roomNew, setRoomNew] = useState<PropsRoomChat>();
    const [resultSearch, setResultSearch] = useState<any>([]);
    const [searchUser, setSearchUser] = useState<string>('');

    const [send, setSend] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadDel, setLoadDel] = useState<boolean>(false);
    const limit = 10;
    const offset = useRef<number>(0);
    const preDelete = useRef<PropsRoomChat[]>([]);
    const idDeleted = useRef<string[]>([]);

    const [moreBar, setMoreBar] = useState<{
        id_room: string;
        id: string;
        avatar: string | undefined;
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
            setLoading(true);
            const res = await sendChatAPi.getRoom(limit, offset.current);
            const data: PropsRoomChat[] = ServerBusy(res, dispatch);
            const newD: typeof data = await new Promise((resolve, reject) => {
                const newRR = Promise.all(
                    data?.map(async (d) => {
                        if (d.room.text?.t) {
                            if (d.room?.secondary) {
                                const bytes = CryptoJS.AES.decrypt(d.room.text?.t, `chat_${d.room.secondary}`);
                                const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                                d.room.text.t = decryptedData;
                            } else {
                                const bytes = CryptoJS.AES.decrypt(d.room.text?.t, `chat_${d?._id}`);
                                const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                                d.room.text.t = decryptedData;
                            }
                        }
                        return d;
                    }),
                );
                resolve(newRR);
            });
            console.log(newD, 'newD', data);

            setRooms(newD);
            preDelete.current = newD;
            setLoading(false);
        }
        fetchRoom();

        socket.on(`${userId}roomChat`, async (d: string) => {
            const data: PropsRoomChat = JSON.parse(d);
            const a = CommonUtils.convertBase64(data.user.avatar);
            data.user.avatar = a;
            data.users = [data.user];
            const newD = await new Promise<PropsRoomChat>(async (resolve, reject) => {
                try {
                    if (data.room.text?.t) {
                        if (data.room?.secondary) {
                            const bytes = CryptoJS.AES.decrypt(data.room.text?.t, `chat_${data.room.secondary}`);
                            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                            data.room.text.t = decryptedData;
                        } else {
                            const bytes = CryptoJS.AES.decrypt(data.room.text?.t, `chat_${data?._id}`);
                            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                            data.room.text.t = decryptedData;
                        }
                    }
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
            setRoomNew(newD);
        });
    }, [dataUser.id]);
    useEffect(() => {
        if (roomNew) {
            const newR = rooms.filter((r) => r._id !== roomNew._id);
            setRooms([roomNew, ...newR]);
        }
    }, [roomNew]);
    useEffect(() => {
        if (roomChat) {
            if (roomChat.room.text?.t) {
                if (roomChat.room?.secondary) {
                    const bytes = CryptoJS.AES.decrypt(roomChat.room.text?.t, `chat_${roomChat.room.secondary}`);
                    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                    const newR = rooms.filter((r) => r._id !== roomChat._id);
                    setRooms([
                        { ...roomChat, room: { ...roomChat.room, text: { t: decryptedData, icon: '' } } },
                        ...newR,
                    ]);
                } else {
                    const bytes = CryptoJS.AES.decrypt(roomChat.room.text?.t, `chat_${roomChat?._id}`);
                    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                    const newR = rooms.filter((r) => r._id !== roomChat._id);
                    setRooms([
                        { ...roomChat, room: { ...roomChat.room, text: { t: decryptedData, icon: '' } } },
                        ...newR,
                    ]);
                }
            }
        }
    }, [roomChat]);
    useEffect(() => {
        if (delIds) {
            setRooms((pre) => pre.filter((p) => p._id !== delIds._id));
        }
    }, [delIds]);
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
        const res = await sendChatAPi.delete(moreBar.id_room);
        const data:
            | {
                  _id: string;
                  deleted: {
                      id: string;
                      createdAt: string;
                      _id: string;
                  }[];
              }
            | undefined = ServerBusy(res, dispatch);

        if (data) {
            dispatch(setDelIds(data));
            idDeleted.current.push(moreBar.id_room);
            setRooms((pre) => pre.filter((r) => r._id !== moreBar.id_room));
        }
        setLoadDel(false);
    };
    const handleUndo = async () => {
        setLoadDel(true);
        const res = await sendChatAPi.undo(moreBar.id_room);
        const data = ServerBusy(res, dispatch);

        if (data) {
            dispatch(setDelIds(undefined));
            idDeleted.current = idDeleted.current.filter((i) => i !== moreBar.id_room);
            setRooms(() => preDelete.current.filter((p) => !idDeleted.current.includes(p._id)));
        }
        setLoadDel(false);
    };

    const dataMore: PropsDataMore = {
        en: {
            ...moreBar,
            options: [
                {
                    id: 1,
                    name: 'View Profile',
                    icon: <ProfileCircelI />,
                    onClick: () => dispatch(setOpenProfile({ newProfile: [moreBar.id] })),
                },
            ],
        },
        vi: {
            ...moreBar,
            options: [
                {
                    id: 1,
                    name: 'Trang cá nhân',
                    icon: <ProfileCircelI />,
                    onClick: () => dispatch(setOpenProfile({ newProfile: [moreBar.id] })),
                },
            ],
        },
    };

    if (rooms.some((r) => r._id === moreBar.id_room) && delIds?._id !== moreBar.id_room) {
        const dd: {
            [en: string]: {
                id: number;
                name: string;
                load: boolean;
                icon: JSX.Element;
                onClick: () => Promise<void>;
            };
            vi: {
                id: number;
                name: string;
                load: boolean;
                icon: JSX.Element;
                onClick: () => Promise<void>;
            };
        } = {
            en: {
                id: 2,
                name: 'Delete',
                load: loadDel,
                icon: loadDel ? (
                    <DivLoading css="font-size: 12px; margin: 0;">
                        <LoadingI />
                    </DivLoading>
                ) : (
                    <MinusI />
                ),

                onClick: () => handleDelete(),
            },
            vi: {
                id: 2,
                name: 'Xoá',
                load: loadDel,
                icon: loadDel ? (
                    <DivLoading css="font-size: 12px; margin: 0;">
                        <LoadingI />
                    </DivLoading>
                ) : (
                    <MinusI />
                ),

                onClick: () => handleDelete(),
            },
        };
        dataMore[lg].options.push(dd[lg]);
    } else {
        const undo: {
            [en: string]: {
                id: number;
                name: string;
                load: boolean;
                icon: JSX.Element;
                onClick: () => Promise<void>;
            };
            vi: {
                id: number;
                name: string;
                load: boolean;
                icon: JSX.Element;
                onClick: () => Promise<void>;
            };
        } = {
            en: {
                id: 2,
                name: 'Undo',
                load: loadDel,
                icon: loadDel ? (
                    <DivLoading css="font-size: 12px; margin: 0;">
                        <LoadingI />
                    </DivLoading>
                ) : (
                    <MinusI />
                ),

                onClick: () => handleDelete(),
            },
            vi: {
                id: 2,
                name: 'Thu hồi',
                load: loadDel,
                icon: loadDel ? (
                    <DivLoading css="font-size: 12px; margin: 0;">
                        <LoadingI />
                    </DivLoading>
                ) : (
                    <MinusI />
                ),

                onClick: () => handleDelete(),
            },
        };
        dataMore[lg].options.push(undo[lg]);
    }
    console.log('in a chat');

    return {
        userId,
        rooms,
        searchUser,
        setSearchUser,
        send,
        loading,
        moreBar,
        setMoreBar,
        handleShowHide,
        handleSearch,
        dataMore,
        lg,
    };
};

export default LogicMessenger;
