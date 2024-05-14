import moment from 'moment';
import { v4 as primaryKey } from 'uuid';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { PropsUser, PropsUserPer } from 'src/App';
import { DivLoading, DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div } from '~/reUsingComponents/styleComponents/styleDefault';
import { InitialStateHideShow, setTrueErrorServer } from '~/redux/hideShow';
import userAPI from '~/restAPI/userAPI';
import peopleAPI from '~/restAPI/socialNetwork/peopleAPI';
import CommonUtils from '~/utils/CommonUtils';
import ServerBusy from '~/utils/ServerBusy';
import { Buffer } from 'buffer';
import { ExpandI, LoadingI } from '~/assets/Icons/Icons';
import { onChats } from '~/redux/roomsChat';
import httpFile from '~/utils/httpFile';
import fileWorkerAPI from '~/restAPI/fileWorkerAPI';
import { socket } from '../NextWeb';
interface PropsLanguage {
    persistedReducer: {
        language: {
            sn: string;
            l: string;
            w: string;
        };
    };
}
export default function LogicView(
    user: PropsUserPer,
    userFirst: PropsUser,
    setUserFirst: React.Dispatch<React.SetStateAction<PropsUser>>,
    leng: number,
    online: string[],
    setId_chats: React.Dispatch<
        React.SetStateAction<
            {
                id_room?: string;
                id_other: string;
            }[]
        >
    >,
    setUsersData: React.Dispatch<React.SetStateAction<PropsUserPer[]>>,
    index: number,
    AllArray: PropsUserPer[],
    colorText: string,
    where?: string,
) {
    const dispatch = useDispatch();
    const [cookies, setCookies] = useCookies(['tks', 'k_user']);
    const [currentPage, setCurrentPage] = useState<number>(() => {
        return JSON.parse(localStorage.getItem('currentPage') || '{}').currentWeb;
    });
    const { openProfile } = useSelector((state: { hideShow: InitialStateHideShow }) => state.hideShow);
    const language = useSelector((state: PropsLanguage) => state.persistedReducer.language);

    const [more, setMore] = useState<boolean>(false);
    const [valueName, setValueName] = useState<string>('');
    const [valueNickN, setValueNickN] = useState<string>('');
    const [categories, setCategories] = useState<number>(0);
    const [errText, setErrText] = useState<string>('');
    const [resTitle, setResTitle] = useState<{
        star: number;
        love: number;
        visitor: number;
        followed: number;
        following: number;
    }>({ star: 0, love: 0, visitor: 0, followed: 0, following: 0 });

    const [room, setRoom] = useState<{ avatar: boolean; background: boolean }>({ avatar: false, background: false });
    const [edit, setEdit] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loads, setLoads] = useState<{ friend: boolean; follow: boolean }>({ friend: false, follow: false });

    const token = cookies.tks;
    const lg = currentPage === 1 ? language.sn : currentPage === 2 ? language.l : language.w;

    const userRequest = user.userRequest[0]?.idRequest || user.userIsRequested[0]?.idRequest;
    const userRequested = user.userRequest[0]?.idIsRequested || user.userIsRequested[0]?.idIsRequested;
    const level = user.userRequest[0]?.level || user.userIsRequested[0]?.level;

    const id_fl = user.followings[0]?.idFollowing || user.followed[0]?.idFollowing;
    const id_fled = user.followings[0]?.idIsFollowed || user.followed[0]?.idIsFollowed;
    const following = user.followings[0]?.following || user.followed[0]?.following;

    const follwed = user.followings[0]?.followed || user.followed[0]?.followed;
    const DivRef = useRef<HTMLDivElement | null>(null);
    console.log(user, 'userrrr');

    useEffect(() => {
        socket.on(
            `Request others?id=${userFirst.id}`,
            (res: {
                id_friend: string;
                user: {
                    id: string;
                    fullName: string;
                    avatar: string | null;
                    gender: number;
                };
                data: {
                    id: string;
                    idRequest: string;
                    idIsRequested: string;
                    level: number;
                    createdAt: Date;
                    updatedAt: Date;
                };
                follow: {
                    id: string;
                    idFollowing: string;
                    idIsFollowed: string;
                    following: number;
                    followed: number;
                    createdAt: Date;
                    updatedAt: Date;
                };
                quantity: number;
            }) => {
                console.log(res, 'resresres');
                res.data.idIsRequested = res.data.idRequest;
                if (res) {
                    setUsersData((pre) => {
                        const newD = pre.map((x) => {
                            if (x.id === res.data.idIsRequested) {
                                console.log(res, 'newData_88');
                                const userRequest = [
                                    {
                                        id: res.data.id,
                                        idRequest: res.data.idRequest,
                                        idIsRequested: res.data.idIsRequested,
                                        createdAt: res.data.createdAt,
                                        updatedAt: res.data.updatedAt,
                                        level: 1,
                                    },
                                ];
                                x.followed[0] = res.follow;
                                return { ...x, userRequest };
                            }

                            return x;
                        });
                        return newD;
                    });
                }
            },
        );
        return () => {
            socket.off(`Request others?id=${userFirst.id}`);
        };
    }, []);
    const handleChangeAvatar = async (e?: { target: { files: any } }, id?: number) => {
        const avBg = id === 0 ? user.background : user.avatar;
        setEdit(false);
        const data = e?.target.files;
        if (data?.length > 0) {
            const file: File = data[0];
            if (file) {
                if (file.type.includes('image/jpg') || file.type.includes('image/jpeg') || file.type.includes('image/png') || file.type.includes('image/webp')) {
                    const sizeImage = Number((file.size / 1024 / 1024).toFixed(1));
                    if (sizeImage <= 8) {
                        setLoading(true);
                        const formData = new FormData();
                        formData.append('file', file);
                        if (user.avatar || user.background) {
                            formData.append('old_id', avBg);
                        }
                        const fileUploaded = await fileWorkerAPI.addFiles(dispatch, formData);
                        console.log(fileUploaded, 'fileUploaded');
                        if (fileUploaded) {
                            const idF = fileUploaded[0]?.id;
                            const res = await userAPI.changesOne(dispatch, userFirst.id, id === 0 ? { background: 'background' } : { avatar: 'avatar' }, {
                                id_file: idF,
                                type: file.type.split('/')[0],
                                name: file.name,
                            });
                            const data = ServerBusy(res, dispatch);
                            if (data && typeof data === 'string') {
                                if (id === 0) {
                                    setUserFirst({ ...userFirst, background: data });
                                    setUsersData((pre) =>
                                        pre.map((us) => {
                                            if (us.id === userFirst.id) {
                                                us.background = data;
                                            }
                                            return us;
                                        }),
                                    );
                                } else {
                                    setUserFirst({ ...userFirst, avatar: data });
                                    setUsersData((pre) =>
                                        pre.map((us) => {
                                            if (us.id === userFirst.id) {
                                                us.avatar = data;
                                            }
                                            return us;
                                        }),
                                    );
                                }
                            }
                            setLoading(false);
                        }

                        //   uploadRef.current.push({ link: URL.createObjectURL(compressedFile), type: 'image' });
                    } else {
                        dispatch(setTrueErrorServer(`${sizeImage}MB big than our limit is 8MB`));
                    }
                }
            }
        } else {
            //delete
            console.log('delete', id, data, user);
            if (user.avatar || user.background) {
                const fileUploaded = await fileWorkerAPI.deleteFileImg(dispatch, [avBg]);
                if (fileUploaded) {
                    setLoading(true);
                    const data = await userAPI.changesOne(dispatch, userFirst.id, id === 0 ? { background: 'background' } : { avatar: 'avatar' }, { id_file: avBg });
                    if (data) {
                        setLoading(false);
                        if (id === 0) {
                            console.log('number', data, id);
                            setUserFirst({ ...userFirst, background: null });
                            setUsersData((pre) =>
                                pre.map((us) => {
                                    if (us.id === userFirst.id) {
                                        us.background = 'delete';
                                    }
                                    return us;
                                }),
                            );
                        } else {
                            setUserFirst({ ...userFirst, avatar: null });
                            setUsersData((pre) =>
                                pre.map((us) => {
                                    if (us.id === userFirst.id) {
                                        us.avatar = 'delete';
                                    }
                                    return us;
                                }),
                            );
                        }
                    }
                }
            }
        }
    };
    const handleNameU = async () => {
        if (valueName && valueName.length <= 30 && valueName !== userFirst.fullName) {
            setLoading(true);
            const res = await userAPI.changesOne(dispatch, userFirst.id, { fullName: 'fullName' }, valueName); // return new Name
            const data = ServerBusy(res, dispatch);
            setLoading(false);
            console.log(data, 'change');

            if (data === valueName) {
                setUserFirst({ ...userFirst, fullName: data });
                setUsersData((pre) =>
                    pre.map((us) => {
                        if (us.id === userFirst.id) {
                            us.fullName = data;
                        }
                        return us;
                    }),
                );
                setCategories(0);
            } else {
                const dateT = moment(data, 'HH:mm:ss DD-MM-YYYY').locale(lg).fromNow();
                const textEr: { [en: string]: string; vi: string } = {
                    en: `You changed about ${dateT}. After a month you can keep change your name`,
                    vi: `Bạn đã thay đổi ${dateT}. Sau 1 tháng bạn mới có thể đổi lại lần nữa`,
                };
                setErrText(textEr[lg]);
            }
        }
    };

    const handleEdit = () => {
        setEdit(!edit);
    };

    const handleChangeText = async (id: number) => {
        console.log('name', id);
        setEdit(false);
        setCategories(id);
    };
    const handleVName = (e: any) => {
        if (e.target.value.length <= 30) {
            setValueName(e.target.value);
        }
    };
    const loadsRef = useRef<boolean>(false);
    const handleAddF = async (id: string) => {
        setLoads({ ...loads, friend: true });
        const data: {
            id_friend: string;
            data: {
                createdAt: string;
                id: string;
                idIsRequested: string;
                idRequest: string;
                level: number;
                updatedAt: string;
            };
            count_flw: number;
            follow: {
                id: string;
                idFollowing: string;
                idIsFollowed: string;
                following: number;
                followed: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } = await peopleAPI.setFriend(dispatch, id, 'yes');
        user.userIsRequested[0] = {
            ...data.data,
        };
        user.followings[0] = data.follow;
        user.mores[0].followedAmount = data.count_flw;
        setUsersData((pre) =>
            pre.map((us) => {
                if (us.id === user.id) return user;
                return us;
            }),
        );
        setLoads({ ...loads, friend: false });
        console.log('addfriend');
    };

    const handleConfirm = async (id: string) => {
        if (id) {
            const data: {
                ok: {
                    createdAt: string;
                    id: string;
                    idIsRequested: string;
                    idRequest: string;
                    level: number;
                    updatedAt: string;
                    userRequest: {
                        address: string;
                        birthday: string;
                        biography: string;
                        gender: number;
                        hobby: string[];
                        skill: string[];
                        occupation: string;
                        schoolName: string;
                        mores: {
                            id: string;
                            position: string;
                            star: number;
                            loverAmount: number;
                            friendAmount: number;
                            visitorAmount: number;
                            followedAmount: number;
                            followingAmount: number;
                            relationship: string;
                            language: string[];
                            privacy: {
                                [position: string]: string;
                                address: string;
                                birthday: string;
                                relationship: string;
                                gender: string;
                                schoolName: string;
                                occupation: string;
                                hobby: string;
                                skill: string;
                                language: string;
                                subAccount: string;
                            };
                            createdAt: string;
                            updatedAt: string;
                        }[];
                    };
                };
            } = await peopleAPI.setConfirm(dispatch, id, 'friends', 'personal');
            if (data) {
                // du lieu chua chinh xac khi tra ve
                user.userRequest[0] = {
                    ...data.ok,
                };
                setUsersData((pre) =>
                    pre.map((us) => {
                        if (us.id === id) return { ...user, ...data.ok.userRequest };
                        return us;
                    }),
                );
            }
        }
    };
    const handleAbolish = async (id: string, kindOf: string = 'friends') => {
        setLoads({ ...loads, friend: true });

        const data = await peopleAPI.delete(dispatch, id, kindOf, 'personal');
        console.log('Abolish', kindOf, data);
        if (data) {
            setUsersData((pre) =>
                pre.map((us) => {
                    if (us.id === user.id) {
                        us.userIsRequested = [];
                        us.userRequest = [];
                        us.followings = [];
                        us.followed = [];
                        us.mores[0].followedAmount -= 1;
                        us.mores[0].friendAmount = us.mores[0].friendAmount - 1;
                    }
                    return us;
                }),
            );
        }
        setLoads({ ...loads, friend: false });
    };
    const handleMessenger = async (id: string) => {
        dispatch(onChats({ conversationId: undefined, id_other: id }));
        setId_chats((pre) => {
            if (!pre.some((p) => p.id_other === id)) {
                return [...pre, { id_other: id }];
            }
            return pre;
        });
        console.log('handleMessenger');
    };
    const handleFollower = async (id: string, follow?: string) => {
        setLoads({ ...loads, follow: true });
        console.log('handleFollowe', id);
        const data: {
            count_flwe: number;
            follow: string;
            id: string;
            id_fl: string;
            ok: number;
        } = await userAPI.follow(dispatch, id, follow);
        if (data?.ok === 1) {
            if (user.followings[0]?.following) {
                if (data.follow === 'following') {
                    user.followings[0].following = 2;
                    user.mores[0].followedAmount = data.count_flwe;
                    setUsersData((pre) =>
                        pre.map((us) => {
                            if (us.id === user.id) return user;
                            if (us.id === userFirst.id) {
                                us.mores[0].followingAmount = us.mores[0].followingAmount + 1;
                                return us;
                            }
                            return us;
                        }),
                    );
                } else {
                    user.followings[0].followed = 2;
                    user.mores[0].followedAmount = data.count_flwe;
                    setUsersData((pre) =>
                        pre.map((us) => {
                            if (us.id === user.id) return user;
                            if (us.id === userFirst.id) {
                                us.mores[0].followingAmount = us.mores[0].followingAmount + 1;
                                return us;
                            }
                            return us;
                        }),
                    );
                }
            } else if (user.followed[0]?.followed) {
                if (data.follow === 'following') {
                    user.followed[0].following = 2;
                    user.mores[0].followedAmount = data.count_flwe;
                    setUsersData((pre) =>
                        pre.map((us) => {
                            if (us.id === user.id) return user;
                            if (us.id === userFirst.id) {
                                us.mores[0].followingAmount = us.mores[0].followingAmount + 1;
                                return us;
                            }
                            return us;
                        }),
                    );
                } else {
                    user.followed[0].followed = 2;
                    user.mores[0].followedAmount = data.count_flwe;
                    setUsersData((pre) =>
                        pre.map((us) => {
                            if (us.id === user.id) return user;
                            if (us.id === userFirst.id) {
                                us.mores[0].followingAmount = us.mores[0].followingAmount + 1;
                                return us;
                            }
                            return us;
                        }),
                    );
                }
            } else {
                setUsersData((pre) =>
                    pre.map((us) => {
                        if (us.id === user.id) {
                            user.followed[0] = {
                                ...user.followed[0],
                                followed: 1,
                                following: 2,
                                idIsFollowed: data.id,
                                idFollowing: data.id_fl,
                            };
                            user.mores[0].followedAmount = data.count_flwe;
                            return user;
                        }
                        if (us.id === userFirst.id) {
                            us.mores[0].followingAmount = us.mores[0].followingAmount + 1;
                            return us;
                        }
                        return us;
                    }),
                );
            }
        }
        setLoads({ ...loads, follow: false });
    };

    const handleUnFollower = async (id: string, unfollow: string) => {
        setLoads({ ...loads, follow: true });
        const data: {
            count_flwe: number;
            id: string;
            id_fl: string;
            ok: number;
            unfollow: string;
        } = await userAPI.Unfollow(dispatch, id, unfollow);

        if (data.ok === 1) {
            if (user.followings[0]?.following) {
                if (data.unfollow === 'following') {
                    user.followings[0].following = 1;
                    user.mores[0].followedAmount = data.count_flwe;
                    setUsersData((pre) =>
                        pre.map((us) => {
                            if (us.id === user.id) return user;
                            if (us.id === userFirst.id) {
                                us.mores[0].followingAmount = us.mores[0].followingAmount - 1;
                                return us;
                            }
                            return us;
                        }),
                    );
                } else {
                    user.followings[0].followed = 1;
                    user.mores[0].followedAmount = data.count_flwe;
                    setUsersData((pre) =>
                        pre.map((us) => {
                            if (us.id === user.id) return user;
                            if (us.id === userFirst.id) {
                                us.mores[0].followingAmount = us.mores[0].followingAmount - 1;
                                return us;
                            }
                            return us;
                        }),
                    );
                }
            } else if (user.followed[0]?.followed) {
                if (data.unfollow === 'following') {
                    user.followed[0].following = 1;
                    user.mores[0].followedAmount = data.count_flwe;
                    setUsersData((pre) =>
                        pre.map((us) => {
                            if (us.id === user.id) return user;
                            if (us.id === userFirst.id) {
                                us.mores[0].followingAmount = us.mores[0].followingAmount - 1;
                                return us;
                            }
                            return us;
                        }),
                    );
                } else {
                    user.followed[0].followed = 1;
                    user.mores[0].followedAmount = data.count_flwe;
                    setUsersData((pre) =>
                        pre.map((us) => {
                            if (us.id === user.id) return user;
                            if (us.id === userFirst.id) {
                                us.mores[0].followingAmount = us.mores[0].followingAmount - 1;
                                return us;
                            }
                            return us;
                        }),
                    );
                }
            } else {
                setUsersData((pre) =>
                    pre.map((us) => {
                        if (us.id === user.id) {
                            user.followed[0].followed = 1;
                            user.mores[0].followedAmount = data.count_flwe;
                            return user;
                        }
                        if (us.id === userFirst.id) {
                            us.mores[0].followingAmount = us.mores[0].followingAmount - 1;
                            return us;
                        }

                        return us;
                    }),
                );
            }
        }
        setLoads({ ...loads, follow: false });
    };

    const handleFriend = async (e: string | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (typeof e !== 'string') {
            e.stopPropagation();
            if (!more) {
                setMore(true);
            } else {
                setMore(false);
            }
        }
    };
    const handleLoves = async () => {
        if (user.isLoved[0]?.userId !== userFirst.id) {
            const data = await userAPI.changesOne(dispatch, user.id, { mores: { loverAmount: 'love' } });
            if (typeof data === 'object' && data && data?.loverData) {
                const fff = data.loverData;
                setUsersData((pre) =>
                    pre.map((us) => {
                        if (us.id === user.id) {
                            return {
                                ...us,
                                mores: [{ ...us.mores[0], loverAmount: data.count_loves }],
                                isLoved: [fff],
                            };
                        }
                        return us;
                    }),
                );
                console.log('data loved', user);
            }
        } else {
            const data = await userAPI.changesOne(dispatch, user.id, { mores: { loverAmount: 'unLove' } });
            if (typeof data === 'object' && data)
                setUsersData((pre) =>
                    pre.map((us) => {
                        if (us.id === user.id) {
                            return {
                                ...us,
                                mores: [{ ...us.mores[0], loverAmount: data.count_loves }],
                                isLoved: [],
                            };
                        }
                        return us;
                    }),
                );
            console.log('data unloved', user);
        }
    };
    const editDataText: {
        [en: string]: { name: string; id: number; icon?: { id: number; name: string }[] }[];
        vi: { name: string; id: number; icon?: { id: number; name: string }[] }[];
    } = {
        en: [
            {
                name: 'Background',
                icon: [
                    { id: 1, name: 'Change' },
                    { id: 2, name: 'Delete' },
                ],
                id: 0,
            },
            {
                name: 'Avatar',
                icon: [
                    { id: 1, name: 'Change' },
                    { id: 2, name: 'Delete' },
                ],
                id: 1,
            },
            { name: 'Full name', id: 2 },
            { name: 'Biography', id: 3 },
            { name: 'Information', id: 4 },
        ],
        vi: [
            {
                name: 'Nền',
                icon: [
                    { id: 1, name: 'Thay đổi' },
                    { id: 2, name: 'Xoá' },
                ],
                id: 0,
            },
            {
                name: 'Ảnh đại diện',
                icon: [
                    { id: 1, name: 'Thay đổi' },
                    { id: 2, name: 'Xoá' },
                ],
                id: 1,
            },
            { name: 'Tên', id: 2 },
            { name: 'Dòng trạng thái', id: 3 },
            { name: 'Thông tin bên dưới', id: 4 },
        ],
    };
    const editDataTextOther: {
        [en: string]: { name: string; id: number; icon?: { id: number; name: string }[] }[];
        vi: { name: string; id: number; icon?: { id: number; name: string }[] }[];
    } = {
        en: [{ name: 'Information', id: 4 }],
        vi: [{ name: 'Thông tin bên dưới', id: 4 }],
    };
    const cssBg = `width: 100%;
            height: 230px;
            border-radius: 5px;
            background-color: #494949cf;
            position: relative;
            img {
                border-radius: 5px;
            }
            @media (min-width: 400px){
                 height: 250px;
            }
            @media (min-width: 600px){
                  height: ${300 / (leng > 1 ? leng - 0.7 : leng) + 'px'};
            }
            @media (min-width: 769px){
                  height: ${300 / (leng > 1 ? leng - 0.7 : leng) + 'px'};
            }
            @media (min-width: 1025px){
                  height: ${320 / (leng > 1 ? leng - 0.7 : leng) + 'px'};
            };
            @media (min-width: 1201px){
                  height: ${350 / (leng > 1 ? leng - 0.7 : leng) + 'px'};
            }
            @media (min-width: 1440px){
                width: 100%;
                margin: auto;
            }
            ${room.background ? 'position: fixed; width: 100%; height:  100% !important; background-color:#000000fa; top: 0; left: 0; z-index: 999; margin: 0;img{object-fit: contain;}' : ''}
            `;
    const cssName = ` 
            width: inherit;
            height: 30px;
            margin-bottom: 16px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: start;
            text-align: start;
            margin-left: 16px;
            margin-top: 24px;
            position: relative;
            @media (min-width: 600px){
                margin-bottom: 20px;
            }`;
    const css = `
            width: 100%;
            height: 100%;
            position: relative;
            ${where ? 'margin-top:50px;' : ''}
            &::-webkit-scrollbar {
                width: 0px;
            }
            @media (min-width: 768px) {
                &::-webkit-scrollbar {
                    width: 7px;
                }
            }
            @media (min-width: 1100px){
                width: 100%;
                ${leng === 1 && 'padding: 0 10%;'}
            }
            @media (max-width: 600px){
                min-width: 100%;
            }`;

    const cssBt = `
            width: 118px;
            justify-content: center;
            align-items: center;
            padding: 7px 5px;
            font-size: 1.3rem;
            margin: 0 5px;
            color:${colorText};
            background-color: #383838;
            @media(min-width: 678px){
                font-size: 1.5rem;
            }
    `;
    const cssDivPersonalPage = `
        position: relative;
    @media (min-width: 600px){
        height: 60px;
    }@media (min-width: 1000px){
        height: 80px;
    }
`;
    const cssAvatar = `min-width: 90px;
            width: 90px;
            height: 90px;
            border-radius: 50%;
            padding: 3px;
            position: relative;
            overflow: hidden;
            @media (min-width: 600px){
                min-width: ${130 / (leng > 1 ? leng - 0.5 : leng) + 'px;'}
                width: ${130 / (leng > 1 ? leng - 0.5 : leng) + 'px;'}
                height: ${130 / (leng > 1 ? leng - 0.5 : leng) + 'px;'}
            }@media (min-width: 1000px){
                min-width: ${150 / (leng > 1 ? leng - 0.7 : leng) + 'px;'}
                width: ${150 / (leng > 1 ? leng - 0.7 : leng) + 'px;'}
                height: ${150 / (leng > 1 ? leng - 0.7 : leng) + 'px;'}
            }
            ${
                room.avatar
                    ? 'position: fixed; width: 100% !important; height:  100% !important; background-color:#000000fa; border-radius: 0; border: 0; top: 0; left: 0; z-index: 999; margin: 0;img{object-fit: contain; border-radius: 0;}'
                    : ''
            }
            `;
    const empty = () => {};
    const tx = (
        <DivPos
            ref={DivRef}
            css={`
                width: 100%;
                left: 0;
                top: 40px;
                height: 0;
                border-radius: 5px;
                background-color: #383838;
                align-items: baseline;
                transition: all 0.2s linear;
                z-index: 2;
                ${more ? ' height: 200px; padding: 5px 0; div{display: flex}' : ''}
            `}
        >
            <Div>
                <Div
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAbolish(user.id);
                    }}
                    display="none"
                    css={`
                        width: 100%;
                        justify-content: center;
                        padding: 5px;
                        &:hover {
                            color: #e9e9e9;
                        }
                    `}
                >
                    Huỷ kết bạn
                </Div>
            </Div>
        </DivPos>
    );
    const buttons: {
        [en: string]: {
            name: string;
            onClick: (id: string | React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
        }[];
        vi: {
            name: string;
            onClick: (id: string | React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
        }[];
    } = {
        en: [
            {
                name: userRequest !== userFirst.id ? (level === 1 ? 'Confirm' : level === 2 ? 'Friend' : 'Add Friend') : level === 1 ? 'Abolish' : level === 2 ? 'Friend' : 'Add Friend',
                onClick: (e) =>
                    userRequest !== userFirst.id
                        ? level === 1
                            ? handleConfirm(user.id)
                            : level === 2
                            ? handleFriend(e)
                            : handleAddF(user.id)
                        : level === 1
                        ? handleAbolish(user.id)
                        : level === 2
                        ? handleFriend(e)
                        : handleAddF(user.id),
            },
            {
                name: 'Messenger',
                onClick: () => handleMessenger(user.id),
            },
            id_fl === userFirst.id
                ? following === 1
                    ? { name: 'Follow', onClick: () => handleFollower(user.id) }
                    : { name: 'UnFollow', onClick: () => handleUnFollower(user.id, 'following') }
                : id_fled === userFirst.id
                ? follwed === 1
                    ? { name: 'Follow', onClick: () => handleFollower(user.id) }
                    : { name: 'UnFollow', onClick: () => handleUnFollower(user.id, 'followed') }
                : { name: 'Follow', onClick: () => handleFollower(user.id) },
        ],
        vi: [
            {
                name: userRequest !== userFirst.id ? (level === 1 ? 'Chấp nhận' : level === 2 ? 'Bạn bè' : 'Kêt bạn') : level === 1 ? 'Thu hồi' : level === 2 ? 'Bạn bè' : 'Kêt bạn',
                onClick: (e) =>
                    userRequest !== userFirst.id
                        ? level === 1
                            ? handleConfirm(user.id)
                            : level === 2
                            ? handleFriend(e)
                            : handleAddF(user.id)
                        : level === 1
                        ? handleAbolish(user.id)
                        : level === 2
                        ? handleFriend(e)
                        : handleAddF(user.id),
            },
            {
                name: 'Nhắn tin',
                onClick: () => handleMessenger(user.id),
            },
            id_fl === userFirst.id
                ? following === 1
                    ? { name: 'Theo dõi', onClick: () => handleFollower(user.id, 'following') }
                    : { name: 'Bỏ theo dõi', onClick: () => handleUnFollower(user.id, 'following') }
                : id_fled === userFirst.id
                ? follwed === 1
                    ? { name: 'Theo dõi', onClick: () => handleFollower(user.id, 'followed') }
                    : { name: 'Bỏ theo dõi', onClick: () => handleUnFollower(user.id, 'followed') }
                : { name: 'Theo dõi', onClick: () => handleFollower(user.id) },
        ],
    };

    const btss = [
        {
            text: buttons[lg][0].name,
            css:
                cssBt +
                `position: relative; ${
                    ['Thu hồi', 'Abolish'].includes(buttons[lg][0].name)
                        ? 'background-color: #813737;'
                        : ['Chấp nhận', 'Confirm'].includes(buttons[lg][0].name)
                        ? 'background-color: #236164b3;'
                        : ['Friend', 'Bạn bè'].includes(buttons[lg][0].name)
                        ? 'background-color: #175089de;'
                        : ''
                }`,
            onClick: buttons[lg][0].onClick,
            tx: loads.friend ? (
                <DivLoading css="width: auto; font-size: 15px; margin: 0;">
                    <LoadingI />
                </DivLoading>
            ) : ['Friend', 'Bạn bè'].includes(buttons[lg][0].name) ? (
                <>
                    <Div css="font-size: 17px;">
                        <ExpandI />
                    </Div>
                    {tx}
                </>
            ) : (
                ''
            ),
        },
        {
            text: buttons[lg][1].name,
            css: cssBt,
            onClick: buttons[lg][1].onClick,
        },
        {
            text: buttons[lg][2].name,
            css: cssBt + `${['Bỏ theo dõi', 'UnFollow'].includes(buttons[lg][2].name) ? 'background-color:#156068;' : ''}`,
            onClick: buttons[lg][2].onClick,
            tx: loads.follow ? (
                <DivLoading css="width: auto; font-size: 15px; margin: 0;">
                    <LoadingI />
                </DivLoading>
            ) : null,
        },
    ];
    console.log(btss, 'here');

    const btName: { [en: string]: { del: string; ok: string }; vi: { del: string; ok: string } } = {
        en: { del: 'Cancel', ok: 'Change' },
        vi: { del: 'Huỷ bỏ', ok: 'Thay đổi' },
    };
    const id_loved = user.isLoved[0]?.userId;
    return {
        edit,
        setEdit,
        loading,
        setLoading,
        setCurrentPage,
        valueName,
        setValueName,
        valueNickN,
        categories,
        setCategories,
        errText,
        setErrText,
        room,
        setRoom,
        resTitle,
        handleChangeAvatar,
        handleNameU,
        handleLoves,
        handleEdit,
        handleChangeText,
        handleVName,
        editDataText,
        editDataTextOther,
        lg,
        cssBg,
        cssName,
        cssBt,
        css,
        cssDivPersonalPage,
        cssAvatar,
        btss,
        btName,
        id_loved,
        userRequest,
        userRequested,
        level,
        openProfile,
        dispatch,
        loads,
        setMore,
        more,
    };
}
