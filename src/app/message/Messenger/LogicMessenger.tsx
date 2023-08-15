import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from 'src/mainPage/nextWeb';
import { ClockCirclesI, LoadingI, MinusI, ProfileCircelI } from '~/assets/Icons/Icons';
import { DivLoading } from '~/reUsingComponents/styleComponents/styleComponents';
import { setOpenProfile } from '~/redux/hideShow';
import { PropsReloadRD, setSession } from '~/redux/reload';
import sendChatAPi, { PropsRoomChat } from '~/restAPI/chatAPI';
import gridFS from '~/restAPI/gridFS';
import CommonUtils from '~/utils/CommonUtils';

const LogicMessenger = () => {
    const dispatch = useDispatch();
    const roomChat = useSelector((state: PropsReloadRD) => state.reload.roomChat);
    const [cookies, setCookies] = useCookies(['k_user', 'tks']);
    const userId = cookies.k_user;
    const token = cookies.tks;

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
    const [delIds, setDelIds] = useState<{
        _id: string;
        deleted: {
            id: string;
            createdAt: string;
            _id: string;
        }[];
    }>();

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
            setLoading(true);
            const res = await sendChatAPi.getRoom(limit, offset.current);
            if (typeof res === 'string' && res === 'NeGA_off') {
                dispatch(setSession('The session expired! Please login again'));
            } else {
                if (res) {
                    setRooms(res);
                    preDelete.current = res;
                }
                setLoading(false);
            }
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
                            const buffer = await gridFS.getFile(d.v);
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
        if (res) {
            setDelIds(res);
            idDeleted.current.push(moreBar.id_room);
            setRooms((pre) => pre.filter((r) => r._id !== moreBar.id_room));
        }
        setLoadDel(false);
    };
    const handleUndo = async () => {
        console.log('Undo');
        setLoadDel(true);
        const res = await sendChatAPi.undo(moreBar.id_room);
        if (res) {
            setDelIds(undefined);
            idDeleted.current = idDeleted.current.filter((i) => i !== moreBar.id_room);
            setRooms(() => preDelete.current.filter((p) => !idDeleted.current.includes(p._id)));
        }
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
        id: string | undefined;
        avatar: string | undefined;
        fullName: string | undefined;
        gender: number | undefined;
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
    if (rooms.some((r) => r._id === moreBar.id_room) && !delIds) {
        dataMore.options.push({
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
        });
    } else {
        dataMore.options.push({
            id: 3,
            name: 'Undo',
            load: loadDel,
            icon: loadDel ? (
                <DivLoading css="font-size: 12px; margin: 0;">
                    <LoadingI />
                </DivLoading>
            ) : (
                <ClockCirclesI />
            ),

            onClick: () => handleUndo(),
        });
    }

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
    };
};

export default LogicMessenger;
