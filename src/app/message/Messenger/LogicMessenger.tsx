import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingI, MinusI, ProfileCircelI } from '~/assets/Icons/Icons';
import { DivLoading } from '~/reUsingComponents/styleComponents/styleComponents';
import { setOpenProfile } from '~/redux/hideShow';
import { PropsReloadRD, setDelIds } from '~/redux/reload';
import sendChatAPi, { PropsRoomsChat } from '~/restAPI/chatAPI';
import CryptoJS from 'crypto-js';
import { PropsReMessengerRD } from '~/redux/messenger';
import { PropsUser } from '~/typescript/userType';
import useLanguages from '~/reUsingComponents/hook/useLanguage';
export interface PropsDataMore {
    [en: string]: {
        options: {
            id: number;
            load?: boolean;
            name: string;
            icon: JSX.Element;
            onClick: () => any;
        }[];
        conversationId: string;
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
        conversationId: string;
        id: string | undefined;
        avatar: string | undefined;
        fullName: string | undefined;
        gender: number | undefined;
    };
}
const LogicMessenger = (dataUser: PropsUser) => {
    const dispatch = useDispatch();
    const { lg } = useLanguages();
    const { delIds } = useSelector((state: PropsReloadRD) => state.reload);
    const { roomChat } = useSelector((state: PropsReMessengerRD) => state.messenger);

    const [cookies, setCookies, _del] = useCookies(['k_user', 'tks']);
    const [rooms, setRooms] = useState<PropsRoomsChat[]>([]);
    const [roomNew, setRoomNew] = useState<PropsRoomsChat>();
    const [resultSearch, setResultSearch] = useState<any>([]);
    const [searchUser, setSearchUser] = useState<string>('');

    const [send, setSend] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadDel, setLoadDel] = useState<boolean>(false);
    const limit = 10;
    const offset = useRef<number>(0);
    const preDelete = useRef<PropsRoomsChat[]>([]);
    const idDeleted = useRef<string[]>([]);

    const [moreBar, setMoreBar] = useState<{
        conversationId: string;
        id: string;
        avatar: string | undefined;
        fullName: string;
        gender: number;
    }>({
        conversationId: '',
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
            const res = await sendChatAPi.getRoom(dispatch, limit, offset.current);
            res?.map((d) => {
                const ro = d.rooms[0]?.filter[0]?.data[0];
                if (ro) {
                    // just one
                    if (ro?.secondary) {
                        const bytes = CryptoJS.AES.decrypt(ro.text?.t, `chat_${ro.secondary}`);
                        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                        ro.text.t = decryptedData;
                    } else {
                        const bytes = CryptoJS.AES.decrypt(ro.text?.t, `chat_${d?._id}`);
                        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                        ro.text.t = decryptedData;
                    }
                    d.rooms[0].filter[0].data[0] = ro;
                }
                return d;
            });
            if (res) {
                console.log('newD', res);
                setRooms(res);
                preDelete.current = res;
                setLoading(false);
            }
        }
        fetchRoom();

        // socket.on(`${dataUser.id}roomChat`, async (d: string) => {
        //     const data: PropsRoomsChat = JSON.parse(d);
        //     const a = CommonUtils.convertBase64(data.user.avatar);
        //     data.user.avatar = a;
        //     data.users = [data.user];
        //     const newD = await new Promise<PropsRoomsChat>(async (resolve, reject) => {
        //         try {
        //                 const ro = d.rooms[0].filter[0].data[0];
        //             if (data.room.text?.t) {
        //                 if (data.room?.secondary) {
        //                     const bytes = CryptoJS.AES.decrypt(data.room.text?.t, `chat_${data.room.secondary}`);
        //                     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        //                     data.room.text.t = decryptedData;
        //                 } else {
        //                     const bytes = CryptoJS.AES.decrypt(data.room.text?.t, `chat_${data?._id}`);
        //                     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        //                     data.room.text.t = decryptedData;
        //                 }
        //             }
        //             resolve(data);
        //         } catch (error) {
        //             reject(error);
        //         }
        //     });
        //     setRoomNew(newD);
        // });
    }, [dataUser.id]);
    useEffect(() => {
        if (roomNew) {
            const newR = rooms.filter((r) => r._id !== roomNew._id);
            setRooms([roomNew, ...newR]);
        }
    }, [roomNew]);
    useEffect(() => {
        // if (roomChat) {
        //     if (roomChat.room.text?.t) {
        //         if (roomChat.room?.secondary) {
        //             const bytes = CryptoJS.AES.decrypt(roomChat.room.text?.t, `chat_${roomChat.room.secondary}`);
        //             const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        //             const newR = rooms.filter((r) => r._id !== roomChat._id);
        //             setRooms([{ ...roomChat, room: { ...roomChat.room, text: { t: decryptedData, icon: '' } } }, ...newR]);
        //         } else {
        //             const bytes = CryptoJS.AES.decrypt(roomChat.room.text?.t, `chat_${roomChat?._id}`);
        //             const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        //             const newR = rooms.filter((r) => r._id !== roomChat._id);
        //             setRooms([{ ...roomChat, room: { ...roomChat.room, text: { t: decryptedData, icon: '' } } }, ...newR]);
        //         }
        //     }
        // }
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
        const res = await sendChatAPi.delete(dispatch, moreBar.conversationId);
        if (res) {
            dispatch(setDelIds(res));
            idDeleted.current.push(moreBar.conversationId);
            setRooms((pre) => pre.filter((r) => r._id !== moreBar.conversationId));
        }
        setLoadDel(false);
    };
    const handleUndo = async () => {
        setLoadDel(true);
        const res = await sendChatAPi.undo(dispatch, moreBar.conversationId);
        if (res) {
            dispatch(setDelIds(undefined));
            idDeleted.current = idDeleted.current.filter((i) => i !== moreBar.conversationId);
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

    if (rooms.some((r) => r._id === moreBar.conversationId) && delIds?._id !== moreBar.conversationId) {
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
        userId: dataUser.id,
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
