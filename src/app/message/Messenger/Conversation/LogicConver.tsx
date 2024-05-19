import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import sendChatAPi, { PropsRoomChat } from '~/restAPI/chatAPI';
import sendChatAPI from '~/restAPI/chatAPI';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

import DateTime from '~/reUsingComponents/CurrentDateTime';
import { socket } from 'src/mainPage/NextWeb';
import { PropsReloadRD, setDelIds } from '~/redux/reload';
import Languages from '~/reUsingComponents/languages';
import ServerBusy from '~/utils/ServerBusy';
import { useMutation, useQuery } from '@tanstack/react-query';
import handleFileUpload from '~/utils/handleFileUpload';
import { decrypt, encrypt } from '~/utils/crypto';
import { PropsId_chats } from 'src/App';
import fileWorkerAPI from '~/restAPI/fileWorkerAPI';
import { queryClient } from 'src';
import {
    PropsBackground_chat,
    PropsConversationCustoms,
    PropsDataMoreConversation,
    PropsImageOrVideosAtMessenger,
    PropsItemOperationsCon,
    PropsItemQueryChat,
    PropsItemRoom,
    PropsOldSeenBy,
    PropsPinC,
    PropsRooms,
} from '~/typescript/messengerType';
import { DivLoading } from '~/reUsingComponents/styleComponents/styleComponents';
import { BackgroundI, BalloonI, ClockCirclesI, GarbageI, LoadingI, MoveI, ProfileCircelI } from '~/assets/Icons/Icons';
import { Div, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { Label } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';
import { setOpenProfile } from '~/redux/hideShow';
import { PropsConversionText } from 'src/dataText/DataMessenger';
import chatAPI from '~/restAPI/chatAPI';
import { removeBalloon, setBalloon, setTopLeft } from '~/redux/roomsChat';
import { setRoomChat } from '~/redux/messenger';

export function regexCus(val: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hashTagRegex = /#([^]+?)\s*#@/g;
    const hashs: string[] = val.match(hashTagRegex) ?? [];
    val = val.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (val) {
        function getMatches(regex: RegExp, input: string) {
            let match;
            const texts = [];
            while ((match = regex.exec(input)) !== null) {
                texts.push({
                    text: `<a href='${match[0]}' target='_blank' class='regexCus' style='color: #68b1f1;text-decoration: underline;'>${match[0]}</a>`,
                    start: match.index,
                    end: match.index + match[0].length,
                });
            }
            let one = false;
            texts.map((t) => {
                if (one) {
                    const ff = /(?<!<a[^>]*>)(https?:\/\/[^\s<]+)(?![^<]*<\/a>)/g.exec(val);
                    if (ff)
                        val =
                            val.substring(0, ff.index) +
                            `<a href='${ff[0]}' target='_blank' class='regexCus' style='color: #68b1f1;text-decoration: underline;'>${ff[0]}</a>` +
                            val.substring(ff.index + ff[0].length);
                } else {
                    val = val.substring(0, t.start) + t.text + val.substring(t.end);
                    console.log('ffs val', t, val);
                    one = true;
                }
            });
        }
        getMatches(urlRegex, val);
        hashs.map((u) => {
            const protoType = u.split(/#|#@/);
            val = val.replace(u, `<a href='/sn/hashTags/${'#' + protoType[1]}' class='regexCus' style="color: #68b1f1;text-decoration: underline;">${'#' + protoType[1]}</a>`);
        });
    }
    return val;
}
const installOffset = 10;
export type PropsChat = PropsConversationCustoms & PropsRooms;
export default function LogicConversation(id_chat: PropsId_chats, id_you: string, userOnline: string[], colorText: string, conversationText: PropsConversionText, balloon: string[]) {
    console.log(id_you, 'id_you', id_chat);

    const dispatch = useDispatch();
    const { delIds } = useSelector((state: PropsReloadRD) => state.reload);
    //action
    const { lg } = Languages();
    const textarea = useRef<HTMLTextAreaElement | null>(null);
    const ERef = useRef<HTMLDivElement | null>(null);
    const del = useRef<HTMLDivElement | null>(null);
    const cRef = useRef<number>(0);
    const mRef = useRef<any>(0);
    const offset = useRef<number>(installOffset);
    const indexRef = useRef<number>(1);
    const emptyRef = useRef<boolean>(false);
    const moreAction = useRef<{ prevent: boolean; moreChat: boolean }>({ prevent: true, moreChat: false });

    const [value, setValue] = useState<string>('');
    const [emoji, setEmoji] = useState<boolean>(false);
    const [option, setOption] = useState<boolean>(false); // not yet
    const [opMore, setOpMore] = useState<boolean>(false);
    const [uploadIn, setupload] = useState<{ pre: { _id: string; link: any; type: string }[]; up: any } | undefined>();
    // loading
    const [loadDel, setLoadDel] = useState<boolean>(false);
    const [loading, setLoading] = useState<string>('');
    const [roomImage, setRoomImage] = useState<{ id_room: string; id_file: string } | undefined>(undefined);
    // scroll
    const [moves, setMoves] = useState<string[]>([]);
    const [mouse, setMouse] = useState<string[]>([]);
    const xRef = useRef<number | null>(null);
    const yRef = useRef<number | null>(null);
    const scrollCheck = useRef<boolean>(true);
    const isIntersecting = useRef<PropsOldSeenBy[]>([]);

    const [wch, setWch] = useState<string | undefined>('');
    const rr = useRef<string>('');
    // pin page
    const [choicePin, setChoicePin] = useState<string>('');
    const [itemPin, setItemPin] = useState<PropsPinC>();
    const itemPinData = useRef<PropsItemRoom[]>([]);

    const [conversation, setConversation] = useState<PropsChat>();
    // display conversation's each day
    const date1 = useRef<moment.Moment | null>(null);
    const [writingBy, setWritingBy] = useState<{ length: number; id: string } | undefined>();
    const {
        data: converData,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['getItemChats', `${id_chat.id_other}_${id_you}`],
        staleTime: 60 * 60 * 1000,
        cacheTime: 1 * 60 * 60 * 1000,
        enabled: !emptyRef.current && cRef.current !== 2 && !!id_you,
        queryFn: async ({ queryKey }) => {
            cRef.current = 2;
            const preData: PropsItemQueryChat = queryClient.getQueryData(queryKey);
            const res = await sendChatAPi.getChat(dispatch, id_chat, preData?.indexQuery ?? 0, moreAction.current.moreChat, preData?.indexRef ?? 0, preData?.data._id);
            console.log(res, 'chatRef.current', indexRef.current);
            if (res) {
                if (!res.rooms.length) emptyRef.current = true;
                res.rooms?.map((rr, index1: number) => {
                    if (!rr.filter.length) {
                        indexRef.current += 1;
                        offset.current = 1;
                    }
                    rr.filter.map((d) => {
                        d.data.map((rr) => {
                            if (rr.text.t) {
                                rr.text.t = decrypt(rr.text.t, `chat_${rr.secondary ? rr.secondary : res._id}`);
                                rr.text.t = regexCus(rr.text.t);
                            }
                            if (rr?.reply && rr.reply) {
                                if (rr.reply.text) {
                                    rr.reply.text = decrypt(rr.reply?.text, `chat_${rr.secondary ? rr.secondary : res._id}`);
                                }
                            }
                        });
                        d.data.sort((a, b) => (new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1));
                    });
                });
                const latestRoom = res.rooms[res.rooms.length - 1];
                if (moreAction.current.moreChat) {
                    cRef.current = 8;
                    const preData: PropsItemQueryChat = queryClient.getQueryData(['getItemChats', id_chat.id_other + '_' + id_you]);
                    if (res.rooms.length > 0 && preData) if (preData) preData.data.rooms = [...preData.data.rooms, ...res.rooms];
                    moreAction.current.moreChat = false;
                    return {
                        load: preData?.load ?? [],
                        indexQuery: latestRoom ? latestRoom?.filter[0]?.indexQuery : preData?.indexQuery,
                        data: preData?.data,
                        indexRef: latestRoom ? latestRoom?.index : preData?.indexRef,
                        oldSeenBy: preData?.oldSeenBy,
                    };
                } else {
                    cRef.current = 7;
                    return {
                        load: [],
                        indexQuery: latestRoom ? latestRoom?.filter[0]?.indexQuery : preData?.indexQuery,
                        data: res,
                        oldSeenBy: [],
                        indexRef: latestRoom ? latestRoom?.index : preData?.indexRef,
                    };
                }
            }
        },
    });
    const data = converData?.data;
    const upPin = useMutation(
        // update data in useQuery
        async (newData: { _id: string; chatId: string; data: { file: PropsImageOrVideosAtMessenger[]; text: string } }) => {
            return newData;
        },
        {
            onMutate: (newData) => {
                // Trả về dữ liệu cũ trước khi thêm mới để lưu trữ tạm thời
                const previousData = itemPinData.current ?? [];
                // Cập nhật cache tạm thời với dữ liệu mới
                // queryClient.setQueryData(['Pins chat', newData._id], (oldData: any) => {
                //     //PropsItemRoom[]
                //     console.log(itemPinData.current, 'itemPind', newData, oldData);
                //     oldData.map((t: { _id: string; imageOrVideos: PropsImageOrVideosAtMessenger[]; text: { t: string } }) => {
                //         if (t._id === newData.chatId) {
                //             if (newData.data.file) t.imageOrVideos = newData.data.file;
                //             if (newData.data.text)
                //                 t.text.t = decrypt(
                //                     newData.data.text,
                //                     `chat_${conversation?.room.find((r) => r._id === t._id)?.secondary ? conversation?.room.find((r) => r._id === t._id)?.secondary : conversation?._id}`,
                //                 );
                //         }
                //         return t;
                //     });
                //     return oldData; //PropsRooms[]
                // });
                return { previousData };
            },
            onError: (error, newData, context) => {
                // Xảy ra lỗi, khôi phục dữ liệu cũ từ cache tạm thời
                queryClient.setQueryData(['Pins chat', newData._id], context?.previousData);
            },
            onSettled: (newData) => {
                // Dọn dẹp cache tạm thời sau khi thực hiện mutation
                if (newData) queryClient.invalidateQueries(['Pins chat', newData._id]);
            },
        },
    );
    const handleEmojiSelect = (e: any) => {
        console.log(e);
        setValue(value + e.native);
    };
    let time: string | number | NodeJS.Timeout | undefined;
    const handleTouchStart = () => {
        time = setTimeout(() => {
            setOption(true);
        }, 500);
    };
    const handleTouchMove = () => {
        clearTimeout(time);
    };
    const handleTouchEnd = () => {
        clearTimeout(time);
    };
    const handleSend = async (conversationId: string | undefined, id_other: string | undefined) => {
        if ((value.trim() || (uploadIn && uploadIn?.up?.length > 0)) && data) {
            textarea.current?.setAttribute('style', 'height: 33px');
            if (ERef.current) ERef.current.scrollTop = 0;
            setValue('');

            //
            const formDataFile = new FormData();
            for (let i = 0; i < uploadIn?.up.length; i++) {
                formDataFile.append('file', uploadIn?.up[i], uploadIn?.up[i].name + '@_id_***_get_$' + uploadIn?.up[i]._id); // assign file and _id of the file upload
            }

            const urlS = uploadIn?.up.length ? await fileWorkerAPI.addFiles(dispatch, formDataFile) : [];
            const onData: { id: string; width?: string; height?: string; type: string; tail: string; title?: string; id_sort?: string; id_client: string }[] | null = ServerBusy(urlS, dispatch);
            const id_ = uuidv4();
            const imageOrVideos = onData?.map((i) => {
                return { _id: i.id, v: i.id, icon: '', type: i.type }; // get key for _id
            });
            const id_s = uuidv4();
            converData.load = [...(converData.load ?? []), { id: id_, status: 'loading' }];
            const chat: any = {
                createdAt: DateTime(),
                imageOrVideos,
                seenBy: [],
                text: { t: value, icon: '' },
                userId: id_you,
                _id: id_,
            };
            console.log(data, 'conn_1');

            const con = data.rooms.find((r) => r._id === data.lastElement.roomId);
            console.log(con, 'connn');

            if (con && con.count < 50) {
                const filter = con.filter.find((f) => !f.full);
                if (filter)
                    if (filter.count < 10 * filter.index && filter.data.length < 10) {
                        filter.count += 1;
                        filter.data.unshift(chat);
                    } else {
                        filter.full = true;
                        con.filter.unshift({
                            _id: 'new',
                            count: 1,
                            full: false,
                            index: filter.index + 1,
                            data: [chat],
                            indexQuery: filter.indexQuery - 1,
                            createdAt: new Date(),
                        });
                    }
            } else {
                data.rooms.unshift({
                    chatId: data._id,
                    count: 1,
                    full: false,
                    index: con?.index ?? 0,
                    filter: [{ _id: id_s, count: 1, full: false, index: 1, data: [chat], indexQuery: installOffset, createdAt: new Date() }],
                    _id: 'new',
                    createdAt: new Date(),
                });
            }
            console.log(data.rooms, 'data.rooms');

            const formData = new FormData();
            const fda: any = {};
            if (value) fda.value = encrypt(value, `chat_${data._id ? data._id : id_s}`);
            if (conversationId) formData.append('conversationId', conversationId); // conversation._id
            if (id_) fda.id_data = id_; // id of the room
            if (id_s && !data._id) fda.id_secondary = id_s; // first it have no _id of the conversationId then id_s is replaced
            if (id_other) fda.id_others = id_other;
            fda.valueInfoFile = urlS;
            fda.conversationId = data._id;
            fda.indexRoom = data.rooms[data.rooms.length - 1].index ?? 0;
            const res = await sendChatAPI.send(dispatch, fda);
            const dataSent: PropsRoomChat = ServerBusy(res, dispatch);
            queryClient.setQueryData(['getItemChats', id_chat.id_other + '_' + id_you], (preData: PropsItemQueryChat) => {
                if (preData) {
                    if (dataSent) {
                        data.lastElement = dataSent.lastElement;
                        dataSent.rooms.filter[0].data[0].text.t = value;
                        data?.rooms.map((r) => {
                            if (r._id === 'new') {
                                r._id = dataSent.rooms._id;
                                r.count = dataSent.rooms.count;
                                r.createdAt = dataSent.rooms.createdAt;
                                r.index = dataSent.rooms.index;
                                r.full = dataSent.rooms.full;
                                r.filter = dataSent.rooms.filter;
                            } else if (r._id === dataSent.rooms._id) {
                                r.count = dataSent.rooms.count;
                                r.index = dataSent.rooms.index;
                                r.full = dataSent.rooms.full;
                                r.filter.map((f) => {
                                    if (f._id === 'new') {
                                        f._id = dataSent.rooms.filter[0]._id;
                                        f.count = dataSent.rooms.filter[0].count;
                                        f.createdAt = dataSent.rooms.filter[0].createdAt;
                                        f.index = dataSent.rooms.filter[0].index;
                                        f.full = dataSent.rooms.filter[0].full;
                                        f.indexQuery = dataSent.rooms.filter[0].indexQuery;
                                    } else if (f._id === dataSent.rooms.filter[0]._id) {
                                        f.data.map((d) => {
                                            if (d._id === dataSent.rooms.filter[0].data[0]._id) {
                                                d = dataSent.rooms.filter[0].data[0];
                                            }
                                            return d;
                                        });
                                        f = { ...dataSent.rooms.filter[0], data: f.data };
                                    }
                                    return f;
                                });
                            }
                            return r;
                        });
                        rr.current = '';
                        if (!data._id) data._id = dataSent._id; // add id when id is empty
                        data.users.push(data.user);
                        dispatch(setRoomChat(dataSent));
                        return { ...preData, data, load: converData?.load.filter((r) => r.id !== dataSent.rooms.filter[0].data[0]._id) };
                    } else {
                        return {
                            ...preData,
                            load: converData.load.map((r) => {
                                if (r.id === id_) r.status = 'error';
                                return r;
                            }),
                        };
                    }
                } else {
                    return preData;
                }
            });
            setLoading('send');
            setupload(undefined);
        }
    };
    const handleImageUpload = async (e: any) => {
        const files = e.target.files;
        const { upLoad, getFilesToPre } = await handleFileUpload(files, 15, 8, 15, dispatch, 'chat', true);
        setupload({ pre: getFilesToPre, up: upLoad });
    };
    const handleScroll = () => {
        if (scrollCheck.current) scrollCheck.current = false;
        if (!emptyRef.current && ERef.current) {
            const { scrollTop, clientHeight, scrollHeight } = ERef.current;
            const scrollBottom = -scrollTop + clientHeight;
            console.log('more chat', isFetching, scrollBottom >= scrollHeight - 250, cRef, emptyRef);
            if (scrollBottom >= scrollHeight - 250) {
                if (cRef.current !== 2) {
                    // wait for another request
                    moreAction.current.moreChat = true;
                    moreAction.current.prevent = true;
                    refetch();
                }
            }
        }
    };
    const handleProfile = () => {
        const id_oth: string[] = [];
        data?.id_us.forEach((id) => {
            if (id !== id_you) id_oth.push(id);
        });
        dispatch(setOpenProfile({ newProfile: id_oth, currentId: '' }));
    };
    const handleDelete = async () => {
        setLoadDel(true);
        if (data) {
            const res = await sendChatAPi.delete(dispatch, data._id);
            if (res) {
                setConversation({ ...data, rooms: [], deleted: res.deleted });
                dispatch(setDelIds(res));
            }
        }

        setLoadDel(false);
    };
    const handleUndo = async () => {
        console.log('Undo');
        // setLoadDel(true);
        // if (data?._id) {
        //     emptyRef.current = false;
        //     const res = await sendChatAPi.undo(data._id);
        //     const dataV: PropsChat | null = ServerBusy(res, dispatch);
        //     if (dataV) {
        //                 dataV.rooms?.map(
        //                      (
        //                         rr: {
        //                             imageOrVideos: { _id: string; v: string; icon: string; type: string }[];
        //                             text: { t: string };
        //                             secondary?: string;
        //                         },
        //                         index1: number,
        //                     ) => {
        //                         if (rr.text.t) {
        //                             dataV.rooms[index1].text.t = decrypt(rr.text.t, `chat_${rr.secondary ? rr.secondary : modifiedData._id}`);
        //                         }
        //                     },
        //                 )
        //         cRef.current = 0;
        //         dispatch(setDelIds(undefined));
        //         console.log(newData, 'newDataBG');
        //         setConversation(newData);
        //     }
        // }
        setLoadDel(false);
    };
    const ye = !moves.some((m) => m === data?._id || m === data?.user.id); //stop action when moving
    const handleImageUploadBg = async (e: any) => {
        if (!ye) e.preventDefault();
        if (data && ye) {
            const files = e.target.files;
            const { upLoad, getFilesToPre } = await handleFileUpload(files, 15, 8, 15, dispatch, 'chat', false);
            const fileC: any = upLoad[0];
            const formData = new FormData();
            if (fileC) {
                formData.append('file', fileC); // assign file and _id of the file upload
                if (data.background) formData.append('old_id', data.background.id);
                const re = await fileWorkerAPI.addFiles(dispatch, formData);
                const AddOk = ServerBusy(re, dispatch);
                if (re?.length) {
                    const res = await chatAPI.setBackground(dispatch, {
                        conversationId: data._id,
                        dataId: data.rooms[0].filter[0].data[0]._id,
                        id_file: re.map((f) => ({ id: f.id, type: f.type }))[0],
                    });
                    if (res)
                        queryClient.setQueryData(['getItemChats', id_chat.id_other + '_' + id_you], (preData: PropsItemQueryChat) => {
                            if (preData) {
                                data.background = {
                                    id: res.ids_file.id,
                                    v: res.ids_file.id,
                                    type: res.ids_file.type,
                                    userId: res.operation.userId,
                                };
                                data.statusOperation.push(res.operation);
                                return { ...preData, data };
                            }
                            return preData;
                        });
                }
            }
            setLoading('change_background');
            e.target.value = '';
        }
    };
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (data?._id && moves.includes(data._id) && del.current)
            if (moves.some((m) => m === data?._id || m === data?.user.id)) {
                const ls = document.querySelectorAll('.ofChats');
                Array.from(ls).forEach((s) => {
                    console.log(s.getAttribute('id') === del.current?.getAttribute('id'));

                    if (s.getAttribute('id') === del.current?.getAttribute('id')) {
                        s.setAttribute('style', 'z-index: 999');
                    } else {
                        s.setAttribute('style', 'z-index: 99');
                    }
                });
                del.current.style.top = `${del.current.getBoundingClientRect().top}px`;
                del.current.style.left = `${del.current.getBoundingClientRect().left}px`;
                if (!mouse.some((m) => m === data._id)) {
                    setMouse([...mouse, data._id]);
                }
            }
    };
    const handleMouseUp = () => {
        if (data && moves.includes(data._id)) {
            if (yRef.current && xRef.current) dispatch(setTopLeft({ ...id_chat, top: yRef.current, left: xRef.current }));
            setMouse((pre) => pre.filter((m) => m !== data._id));
        }
    };
    useEffect(() => {
        const code = `${data?._id ? data._id : id_chat.id_other + '-' + id_you}phrase_chatRoom`;
        if (data) {
            socket.on(`conversation_see_chats_${data._id}`, (resSee: { param: PropsOldSeenBy[]; userId: string; createdAt: string }) => {
                queryClient.setQueryData(['getItemChats', id_chat.id_other + '_' + id_you], (preData: PropsItemQueryChat) => {
                    resSee.param.forEach((dr) => {
                        preData?.data.rooms.map((r) => {
                            if (r._id === dr.roomId) {
                                dr.data.forEach((fr) => {
                                    r.filter.map((ff) => {
                                        if (ff._id === fr.filterId) {
                                            fr.data.forEach((dd) => {
                                                ff.data.map((df) => {
                                                    if (df._id === dd.dataId) {
                                                        const ddd = { id: resSee.userId, createdAt: resSee.createdAt };
                                                        console.log(df, dd, 'seeeeeennn', resSee, df.seenBy, ddd);
                                                        df.seenBy = [...(df.seenBy ?? []), ddd];
                                                    }
                                                    return df;
                                                });
                                            });
                                        }
                                        return ff;
                                    });
                                });
                            }
                            return r;
                        });
                    });

                    return preData;
                });
                setLoading('receive_see');
                console.log('conversation_see_', resSee);
            });
            socket.on(`conversation_deleteBG_room_${data._id}`, (dataOper: PropsItemOperationsCon) => {
                queryClient.setQueryData(['getItemChats', id_chat.id_other + '_' + id_you], (preData: PropsItemQueryChat) => {
                    if (preData) {
                        data.background = undefined;
                        data.statusOperation.push(dataOper);
                        return { ...preData, data };
                    }
                    return preData;
                });
                setLoading('delete_background');
            });
            socket.on(
                `conversation_changeBG_room_${data._id}`,
                async (dataBG: {
                    operation: PropsItemOperationsCon;
                    ids_file: {
                        type: string;
                        v: string;
                        id: string;
                        userId: string;
                    };
                }) => {
                    if (dataBG && dataBG.operation.userId !== id_you) {
                        queryClient.setQueryData(['getItemChats', id_chat.id_other + '_' + id_you], (preData: PropsItemQueryChat) => {
                            if (preData) {
                                data.background = dataBG.ids_file;
                                data.statusOperation.push(dataBG.operation);
                                return { ...preData, data };
                            }
                            return preData;
                        });
                        setLoading('change_background');
                    }
                },
            );

            socket.on(`Conversation_chat_deleteAll_${data._id}`, (deleteData: { roomId: string; filterId: string; dataId: string; userId: string; updatedAt: string }) => {
                console.log('Conversation_chat_dele', deleteData);

                if (deleteData && deleteData.userId !== id_you) {
                    queryClient.setQueryData(['getItemChats', id_chat.id_other + '_' + id_you], (preData: PropsItemQueryChat) => {
                        if (preData) {
                            data.rooms.map((r) => {
                                if (r._id === deleteData.roomId) {
                                    r.filter.map((f) => {
                                        if (f._id === deleteData.filterId) {
                                            f.data.map((d) => {
                                                if (d._id === deleteData.dataId) {
                                                    d.text.t = '';
                                                    d.imageOrVideos = [];
                                                    d.delete = 'all';
                                                    d.updatedAt = deleteData.updatedAt;
                                                }
                                                return d;
                                            });
                                        }
                                        return f;
                                    });
                                }
                                return r;
                            });
                            return { ...preData, data };
                        }
                        return preData;
                    });
                    setLoading('receive_del');
                }
            });
            socket.on(
                `Conversation_chat_update_${data._id}`,
                async (updateData: {
                    updatedBy: string;
                    roomId: string;
                    filterId: string;
                    dataId: string;
                    data: { value: string | undefined; imageOrVideos: PropsImageOrVideosAtMessenger[] };
                    userId: string;
                }) => {
                    console.log(updateData, 'updateData');

                    if (updateData.userId !== id_you && data) {
                        queryClient.setQueryData(['getItemChats', id_chat.id_other + '_' + id_you], (preData: PropsItemQueryChat) => {
                            if (preData) {
                                data.rooms.map((da) => {
                                    if (da._id === updateData.roomId) {
                                        da.filter.map((fl) => {
                                            if (fl._id === updateData.filterId) {
                                                fl.data.map((r) => {
                                                    if (r._id === updateData.dataId) {
                                                        if (updateData.data.value) r.text.t = decrypt(updateData.data.value, `chat_${r?.secondary ? r.secondary : data._id}`);
                                                        if (updateData.data.imageOrVideos.length) r.imageOrVideos = updateData.data.imageOrVideos;
                                                    }
                                                    return r;
                                                });
                                            }
                                            return fl;
                                        });
                                    }
                                    return da;
                                });
                                return { ...preData, data };
                            }
                            return preData;
                        });
                        setLoading('receive_update');
                    }
                },
            );

            // socket.on(`phrase_chatRoom_response_${conversation._id}_${id_you}`, (res) => {
            //     console.log('in_roomChat_personal_receive_and_saw con');
            //     setWch(res);
            // });
            // socket.on(`user_${conversation?.user.id}_in_roomChat_${conversation._id}_personal_receive`, (res: { length: number; id: string }) => {
            //     setWritingBy(res);
            // });
            socket.on(code, async (d) => {
                const { userId, data: dataSocket }: { userId: string; data: PropsRoomChat } = d;
                if (userId !== id_you) {
                    socket.emit(`user_${userId}_in_roomChat_personal_receive_and_saw`, {
                        userIdReceived: id_you,
                        conversationId: dataSocket._id,
                        idChat: dataSocket.rooms.filter[0]?.data[0]._id,
                    });
                    queryClient.setQueryData(['getItemChats', id_chat.id_other + '_' + id_you], (preData: PropsItemQueryChat) => {
                        const DataIn = dataSocket.rooms.filter[0].data[0];
                        if (DataIn.text?.t) {
                            if (DataIn?.secondary) {
                                dataSocket.rooms.filter[0].data[0].text.t = decrypt(DataIn.text?.t, `chat_${DataIn.secondary}`);
                            } else {
                                dataSocket.rooms.filter[0].data[0].text.t = decrypt(DataIn.text?.t, `chat_${data._id}`);
                            }
                        }
                        if (preData?.data && !preData?.data._id) {
                            preData.data = { ...dataSocket, rooms: [dataSocket.rooms] };
                        } else {
                            let roomPo = false;
                            preData?.data.rooms.map((r) => {
                                if (r._id === dataSocket.rooms._id) {
                                    roomPo = true;
                                    let filterPo = false;
                                    r.filter.map((f) => {
                                        if (f._id === dataSocket.rooms.filter[0]._id) {
                                            filterPo = true;
                                            f.data.unshift(dataSocket.rooms.filter[0].data[0]);
                                        }
                                        return f;
                                    });
                                    if (!filterPo) r.filter.unshift(dataSocket.rooms.filter[0]);
                                }
                                return r;
                            });
                            if (!roomPo) {
                                console.log(preData, 'preData_ 3');

                                preData?.data.rooms.unshift(dataSocket.rooms);
                            }
                        }
                        if (preData?.data) preData.data.lastElement = dataSocket.lastElement;
                        return preData;
                    });
                    setLoading('receive');
                    // const newD: any = await new Promise(async (resolve, reject) => {
                    //     // if (data.room?.reply) {
                    //     //     if (data.room.reply.text) {
                    //     //         data.room.reply.text = decrypt(data.room.reply?.text, `chat_${data.room.secondary ? data.room.secondary : data._id}`);
                    //     //     }
                    //     // }
                    //     // resolve(data.room);
                    // });

                    // // data.users.push(data.user);
                    // // if (!conversation?._id && conversation) {
                    // //     setConversation({ ...conversation, _id: data._id });
                    // //     console.log('eyeye');
                    // // }
                    // // dispatch(setRoomChat(data));
                    // setDataSent(newD);
                }
            });
            socket.on(
                `user_${data._id}_in_roomChat_personal_receive_and_saw_other`, // display that user has been received and seen
                (data: { userIdReceived: string; conversationId: string; idChat: string }) => {
                    console.log(data, 'userIdReceived');
                    setWch(data.idChat);
                },
            );
            return () => {
                socket.off(`phrase_chatRoom_response_${conversation?._id}_${id_you}`);
                socket.off(`user_${conversation?.user.id}_in_roomChat_${conversation?._id}_personal_receive`);
                socket.off(code);
                socket.off(`Conversation_chat_deleteAll_${conversation?._id}`);
                socket.off(`Conversation_chat_update_${conversation?._id}`);
            };
        }
    }, [data?._id]);
    const targetChild = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        // const re = document.getElementById(`chat_to_scroll_${choicePin}`); // auto scroll when click into pin button
        // // if (choicePin) {
        // //     if (!conversation?.room.some((r) => r._id === choicePin)) {
        // //         fetchChat(true);
        // //     } else {
        // //         const container = ERef.current;
        // //         if (container && re) {
        // //             const childRect = re.getBoundingClientRect();
        // //             const containerRect = container.getBoundingClientRect();
        // //             // Kiểm tra nếu phần tử con đang ở trên tầm nhìn của phần tử cha
        // //             container.scrollTo({
        // //                 top: container.scrollTop + (childRect.top - containerRect.top - 100), // calculate top's coordinate of child and parents
        // //                 behavior: 'smooth',
        // //             });
        // //             // if (ERef.current) ERef.current.scrollTop = -check.current;
        // //         }
        // //     }
        // // }
        // const observer = new IntersectionObserver((entries) => {
        //     entries.forEach((entry) => {
        //         console.log('Child element is now visible in the container', entry, ERef.current?.scrollTop);
        //         if (entry.isIntersecting) {
        //             setChoicePin('');
        //         }
        //         // You can perform actions when the child element becomes visible here
        //     });
        // });
        // if (re) observer.observe(re);
        // return () => {
        //     if (re) observer.unobserve(re);
        // };
    }, [choicePin, conversation]);
    useEffect(() => {
        // if (dataSent && !writingBy) {
        //     if (conversation?.room.some((r) => r.length)) {
        //         conversation?.room.map((r) => {
        //             if (r.length) {
        //                 // other is writing
        //                 r._id = dataSent._id;
        //                 r.id = dataSent.id;
        //                 r.text = dataSent.text;
        //                 r.seenBy = dataSent.seenBy;
        //                 r.imageOrVideos = dataSent.imageOrVideos;
        //                 r.createdAt = dataSent.createdAt;
        //                 r.length = undefined;
        //             }
        //         });
        //     } else {
        //         conversation?.room.unshift(dataSent);
        //     }
        //     setDataSent(undefined);
        // }
        // if (writingBy && !conversation?.room.some((r) => r.length)) {
        //     const chat: any = {
        //         createdAt: DateTime(),
        //         imageOrVideos: [],
        //         seenBy: [],
        //         length: writingBy.length,
        //         id: writingBy.id,
        //         _id: '',
        //     };
        //     conversation?.room.unshift(chat);
        // }
    }, [writingBy]);
    useEffect(() => {
        return clearInterval(mRef.current);
    }, [mRef.current]);
    const removeBall = useMutation(
        async (xd: string) => {
            return xd;
        },
        {
            onMutate: (xd) => {
                // Trả về dữ liệu cũ trước khi thêm mới để lưu trữ tạm thời
                const previousData = data;
                // Cập nhật cache tạm thời với dữ liệu mới
                queryClient.setQueryData(['getBalloonChats', 1], (oldData: any) => {
                    // Thêm newData vào mảng dữ liệu cũ (oldData)
                    return oldData.filter((od: { _id: string }) => od._id !== xd); //PropsRooms[]
                });

                return { previousData };
            },
            onError: (error, newData, context) => {
                // Xảy ra lỗi, khôi phục dữ liệu cũ từ cache tạm thời
                queryClient.setQueryData(['getBalloonChats', 1], context?.previousData);
            },
            onSettled: () => {
                // Dọn dẹp cache tạm thời sau khi thực hiện mutation
                queryClient.invalidateQueries(['getBalloonChats', 1]);
            },
        },
    );
    const dataMore: PropsDataMoreConversation = {
        conversationId: data?._id,
        id: data?.user.id,
        avatar: data?.user.avatar,
        fullName: data?.user.fullName,
        gender: data?.user.gender,
        options: [
            {
                id: 1,
                name: conversationText.optionRoom.personal,
                icon: <ProfileCircelI />,
                color: '#2880cc',
                onClick: () => {
                    if (data?.user.id && ye) dispatch(setOpenProfile({ newProfile: [data?.user.id] }));
                },
            },
            {
                id: 2,
                name: '',
                icon: (
                    <>
                        <Div
                            width="100%"
                            wrap="wrap"
                            css={`
                                align-items: center;
                                justify-content: left;
                                cursor: var(--pointer);
                                svg {
                                    margin-right: 5px;
                                }
                                form {
                                    ${data?.background ? 'margin-bottom: 12px;' : ''}
                                }
                            `}
                        >
                            <form method="post" encType="multipart/form-data" style={{ width: '100%' }}>
                                <input id={data?._id + 'uploadCon_BG'} type="file" name="file" onChange={handleImageUploadBg} hidden />
                                <Label
                                    htmlFor={data?._id + 'uploadCon_BG'}
                                    color={colorText}
                                    css="width: 100%;align-items: center; justify-content:left; font-size: 1.5rem; @media(min-width: 768px){font-size: 1.3rem}"
                                >
                                    <Div css="font-size: 25px; color: #eedec8; @media(min-width: 768px){font-size: 20px}">
                                        <BackgroundI />
                                    </Div>{' '}
                                    {conversationText.optionRoom.background}
                                </Label>
                            </form>
                            {data?.background && (
                                <Div
                                    css="width: 100%; align-items: center; display: flex; svg{margin-right: 3px;} "
                                    onClick={async () => {
                                        if (data && data.background) {
                                            const fileDed = await fileWorkerAPI.deleteFileImg(dispatch, [data.background.id]);
                                            const delOk = ServerBusy(fileDed, dispatch);
                                            if (delOk) {
                                                const res = await chatAPI.delBackground(dispatch, data._id, data.rooms[0].filter[0].data[0]._id);
                                                const resOk = ServerBusy(res, dispatch);
                                                if (resOk)
                                                    queryClient.setQueryData(['getItemChats', id_chat.id_other + '_' + id_you], (preData: PropsItemQueryChat) => {
                                                        if (preData) {
                                                            data.background = undefined;
                                                            data.statusOperation.push(resOk);
                                                            return { ...preData, data };
                                                        }
                                                        return preData;
                                                    });
                                                setLoading('delete_background');
                                            }
                                        }
                                    }}
                                >
                                    <Div css="font-size: 25px; color: #e46969c9; @media(min-width: 768px){font-size: 20px}">
                                        <GarbageI />{' '}
                                    </Div>
                                    <P z="1.5rem" css="@media(min-width: 768px){font-size: 1.3rem}">
                                        Remove background
                                    </P>
                                </Div>
                            )}
                        </Div>
                    </>
                ),
                load: loading === 'change_background',
                onClick: () => {},
            },
            {
                id: 3,
                name: (balloon.some((b) => b === data?._id) ? conversationText.optionRoom.balloonDel + ' ' : '') + conversationText.optionRoom.balloon,
                icon: <BalloonI />,
                color: '#e489a2',
                onClick: () => {
                    if (data?._id && ye)
                        if (!balloon.some((b) => b === data._id)) {
                            dispatch(setBalloon(data?._id));
                        } else {
                            removeBall.mutate(data._id);
                            dispatch(removeBalloon(data?._id));
                        }
                },
            },
            {
                id: 4,
                name: `${conversationText.optionRoom.move} ${moves.some((m) => m === data?._id || m === data?.user.id) ? ' stop' : ''}`,
                icon: <MoveI />,
                device: 'mobile',
                onClick: () => {
                    let checkM = false;
                    if (data?._id) {
                        moves.forEach((m) => {
                            if (m === data?._id) checkM = true;
                        });
                        if (checkM) {
                            setMoves((pre) => pre.filter((m) => m !== data._id));
                        } else {
                            setMoves([...moves, data?._id]);
                        }
                    } else if (data?.user.id) {
                        moves.forEach((m) => {
                            if (m === data.user.id) checkM = true;
                        });
                        if (checkM) {
                            setMoves((pre) => pre.filter((m) => m !== data.user.id));
                        } else {
                            setMoves([...moves, data.user.id]);
                        }
                    }
                },
            },
        ],
    };

    if (data?.deleted?.some((c) => c.id === id_you)) {
        dataMore.options.push({
            id: 6,
            name: conversationText.optionRoom.undo,
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
        handleImageUpload,
        uploadIn,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleSend,
        value,
        setValue,
        emoji,
        setEmoji,
        handleEmojiSelect,
        dispatch,
        conversation,
        setConversation,
        opMore,
        setOpMore,
        lg,
        ERef,
        del,
        textarea,
        date1,
        wch,
        setWch,
        rr,
        writingBy,
        choicePin,
        setChoicePin,
        targetChild,
        itemPin,
        setItemPin,
        itemPinData,
        loadingChat: converData?.load,
        isFetching,
        data,
        xRef,
        yRef,
        isIntersecting,
        mouse,
        roomImage,
        setRoomImage,
        handleScroll,
        handleProfile,
        handleMouseDown,
        handleMouseUp,
        dataMore,
        scrollCheck,
    };
}
