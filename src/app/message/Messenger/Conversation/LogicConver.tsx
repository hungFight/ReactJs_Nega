import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Buffer } from 'buffer';
import sendChatAPi, { PropsRoomChat } from '~/restAPI/chatAPI';
import sendChatAPI from '~/restAPI/chatAPI';
import CommonUtils from '~/utils/CommonUtils';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

import DateTime from '~/reUsingComponents/CurrentDateTime';
import { setTrueErrorServer } from '~/redux/hideShow';
import fileGridFS from '~/restAPI/gridFS';
import { socket } from 'src/mainPage/nextWeb';
import Cookies from '~/utils/Cookies';
import { PropsReloadRD } from '~/redux/reload';
import Languages from '~/reUsingComponents/languages';
import ServerBusy from '~/utils/ServerBusy';
import moment from 'moment';
import { useMutation, useQuery } from '@tanstack/react-query';
import userAPI from '~/restAPI/userAPI';
import { PropsBgRD } from '~/redux/background';
import handleFileUpload from '~/utils/handleFileUpload';
import { decrypt, encrypt } from '~/utils/crypto';
import { setRoomChat } from '~/redux/messenger';
import { PropsId_chats } from 'src/App';
import gridFS from '~/restAPI/gridFS';
import fileWorkerAPI from '~/restAPI/fileWorkerAPI';
import { queryClient } from 'src';
export interface PropsPinC {
    chatId: string;
    userId: string;
    createdAt: string;
    latestChatId: string;
    _id: string;
}
export interface PropsRooms {
    rooms: PropsItemRoom[];
}
export interface PropsImageOrVideos {
    type: string;
    tail: string;
    link?: string;
    icon: string;
    _id: string;
}
export interface PropsItemsData {
    _id: string;
    userId: string;
    text: {
        t: string;
        icon: string;
    };
    delete?: string;
    update?: string;
    secondary?: string;
    length?: number;
    imageOrVideos: PropsImageOrVideos[];
    sending?: boolean;
    seenBy: string[];
    updatedAt: string;
    createdAt: string;
    reply: {
        id_room: string;
        id_reply: string;
        id_replied: string;
        text: string;
        imageOrVideos: PropsImageOrVideos[];
    };
}

export interface PropsItemRoom {
    _id: string;
    chatId: string;
    full: boolean;
    index: number;
    createdAt: string | Date;
    count: number;
    filter: {
        _id: string;
        count: number;
        full: boolean;
        index: number;
        indexQuery: number;
        createdAt: string | Date;
        data: PropsItemsData[];
    }[];
}
export interface PropsRoom {
    room: PropsItemRoom;
}
export interface PropsBackground_chat {
    v: string;
    type: string;
    id: string;
    userId: string;
    latestChatId: string;
}
export interface PropsConversationCustoms {
    _id: string;
    id_us: string[];
    miss?: number;
    user: {
        id: string;
        fullName: string;
        avatar: string | undefined;
        gender: number;
    };
    users: {
        id: string;
        fullName: string;
        avatar: string | undefined;
        gender: number;
    }[];
    status: string;
    background?: PropsBackground_chat;
    pins: PropsPinC[];
    deleted: {
        id: string;
        createdAt: string;
        show?: boolean;
    }[];
    createdAt: string;
}
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
export default function LogicConversation(id_chat: PropsId_chats, id_you: string, userOnline: string[]) {
    const dispatch = useDispatch();
    const { delIds } = useSelector((state: PropsReloadRD) => state.reload);
    const [loadingChat, setLoadingChat] = useState<string>('');
    const { userId } = Cookies();
    const { lg } = Languages();
    const textarea = useRef<HTMLTextAreaElement | null>(null);
    const ERef = useRef<HTMLDivElement | null>(null);
    const del = useRef<HTMLDivElement | null>(null);
    const cRef = useRef<number>(0);
    const mRef = useRef<any>(0);
    const offset = useRef<number>(installOffset);
    const offsetState = useRef<number>(1);
    const indexRef = useRef<number>(1);
    const limit = 30;
    const emptyRef = useRef<boolean>(false);

    const [value, setValue] = useState<string>('');
    const [emoji, setEmoji] = useState<boolean>(false);
    const [option, setOption] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [opMore, setOpMore] = useState<boolean>(false);
    const [uploadIn, setupload] = useState<{ pre: { _id: string; link: any; type: string }[]; up: any } | undefined>();

    const chatRef = useRef<PropsChat>();
    const [wch, setWch] = useState<string | undefined>('');
    const rr = useRef<string>('');
    // pin page
    const [choicePin, setChoicePin] = useState<string>('');
    const [itemPin, setItemPin] = useState<PropsPinC>();
    const itemPinData = useRef<PropsItemRoom[]>([]);

    const [conversation, setConversation] = useState<PropsChat>();
    const [dataSent, setDataSent] = useState<PropsItemRoom | undefined>();
    // display conversation's each day
    const date1 = useRef<moment.Moment | null>(null);
    const [writingBy, setWritingBy] = useState<{ length: number; id: string } | undefined>();

    // if (date1.isBefore(date2)) {
    //     console.log('date1 is before date2');
    // }

    // if (date1.isAfter(date2)) {
    //     console.log('date1 is after date2');
    // }
    const { data } = useQuery({
        queryKey: [`getActiveStatus: ${conversation?.user.id}`, userOnline.includes(conversation?.user.id ?? 'default')],
        staleTime: 60 * 1000,
        queryFn: async () => {
            const res = await userAPI.getActiveStatus(conversation?.user.id);
            const da: string = ServerBusy(res, dispatch);
            return da;
        },
        enabled: conversation?.user.id ? true : false,
    });
    const upPin = useMutation(
        // update data in useQuery
        async (newData: { _id: string; chatId: string; data: { file: PropsImageOrVideos[]; text: string } }) => {
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
                //     oldData.map((t: { _id: string; imageOrVideos: PropsImageOrVideos[]; text: { t: string } }) => {
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
    //get image
    const fetchChat = async (moreChat: boolean = false) => {
        if (!emptyRef.current && !loading) {
            setLoading(true);

            cRef.current = 2;
            const res = await sendChatAPi.getChat(
                id_chat,
                limit,
                offset.current,
                moreChat,
                indexRef.current,
                chatRef.current?._id,
                chatRef.current ? chatRef.current.rooms[chatRef.current.rooms.length - 1]._id : undefined,
            );
            const dataC: PropsConversationCustoms & PropsRooms = ServerBusy(res, dispatch);
            console.log(dataC, 'chatRef.current');

            if (dataC) {
                if (!dataC.rooms.length) emptyRef.current = true;
                dataC.rooms?.map((rr, index1: number) => {
                    if (!rr.filter.length) {
                        indexRef.current += 1;
                        offset.current = 1;
                    }
                    rr.filter.map((d) => {
                        date1.current = moment(d.data[0]?.createdAt);
                        d.data.map((rr) => {
                            if (rr.text.t) {
                                rr.text.t = decrypt(rr.text.t, `chat_${rr.secondary ? rr.secondary : dataC._id}`);
                                rr.text.t = regexCus(rr.text.t);
                            }
                            if (rr?.reply && rr.reply) {
                                if (rr.reply.text) {
                                    rr.reply.text = decrypt(rr.reply?.text, `chat_${rr.secondary ? rr.secondary : dataC._id}`);
                                }
                            }
                        });
                        d.data.sort((a, b) => {
                            const dateA = new Date(a.createdAt);
                            const dateB = new Date(b.createdAt);
                            // Compare `dateB` with `dateA` for descending order
                            // If `dateB` is greater (newer) than `dateA`, it should come first
                            if (dateB > dateA) {
                                return 1; // `b` comes before `a` (newest first)
                            } else if (dateB < dateA) {
                                return -1; // `a` comes before `b` (older first)
                            } else {
                                return 0; // Dates are equal
                            }
                        });
                    });
                });
                if (dataC.rooms.length) {
                    indexRef.current = dataC.rooms[0]?.index;
                    offset.current = dataC.rooms[0]?.filter[0]?.indexQuery;
                }
                if (moreChat) {
                    cRef.current = 8;
                    if (dataC.rooms.length > 0 && chatRef.current) {
                        chatRef.current = {
                            ...chatRef.current,
                            rooms: [...chatRef.current.rooms, ...dataC.rooms],
                        };
                    }
                } else {
                    chatRef.current = dataC;

                    cRef.current = 7;
                }
            }
            setConversation(chatRef.current);
        }
        // first element
        setLoading(false);
    };
    const code = `${conversation?._id ? conversation._id + '-' + conversation?.user.id : conversation?.user.id + '-' + id_you}roomChat_personal_receive_and_saw`;
    useEffect(() => {
        console.log('eeeee');
        if (code && conversation) {
            socket.on(`conversation_deleteBG_room_${conversation._id}`, () => {
                setConversation((pre) => {
                    if (pre) return { ...pre, background: undefined };
                    return pre;
                });
            });
            socket.on(`conversation_changeBG_room_${conversation._id}`, async (dataBG: PropsBackground_chat) => {
                if (dataBG && dataBG.userId !== id_you) {
                    setConversation((pre) => {
                        if (pre) return { ...pre, background: dataBG };
                        return pre;
                    });
                }
            });

            // socket.on(`Conversation_chat_deleteAll_${conversation._id}`, (deleteData: { chatId: string; userId: string; updatedAt: string }) => {
            //     if (deleteData && deleteData.userId !== id_you) {
            //         setConversation((pre) => {
            //             if (pre)
            //                 return {
            //                     ...pre,
            //                     room: pre.room.map((r) => {
            //                         if (r._id === deleteData.chatId) {
            //                             r.text.t = '';
            //                             r.imageOrVideos = [];
            //                             r.delete = 'all';
            //                             r.updatedAt = deleteData.updatedAt;
            //                         }
            //                         return r;
            //                     }),
            //                 };
            //             return pre;
            //         });
            //     }
            // });
            // socket.on(`Conversation_chat_update_${conversation._id}`, async (updateData: { chatId: string; data: PropsItemRoom; userId: string }) => {
            //     console.log(updateData, 'updateData');
            //     upPin.mutate({
            //         _id: conversation._id,
            //         chatId: updateData.chatId,
            //         data: { file: updateData.data.imageOrVideos, text: updateData.data.text.t },
            //     });
            //     if (updateData.userId !== id_you && conversation) {
            //         const newR: PropsItemRoom = await new Promise(async (resolve, reject) => {
            //             const d = updateData.data;
            //             if (d.text.t) {
            //                 d.text.t = decrypt(d.text.t, `chat_${d?.secondary ? d.secondary : conversation._id}`);
            //                 d.text.t = regexCus(d.text.t);
            //             }

            //             resolve(d);
            //         });
            //         setConversation((pre) => {
            //             if (pre)
            //                 return {
            //                     ...pre,
            //                     room: pre.room.map((r) => {
            //                         if (r._id === updateData.chatId) {
            //                             r = newR;
            //                         }
            //                         return r;
            //                     }),
            //                 };
            //             return pre;
            //         });
            //     }
            // });

            // socket.on(`phrase_chatRoom_response_${conversation._id}_${id_you}`, (res) => {
            //     console.log('in_roomChat_personal_receive_and_saw con');
            //     setWch(res);
            // });
            // socket.on(`user_${conversation?.user.id}_in_roomChat_${conversation._id}_personal_receive`, (res: { length: number; id: string }) => {
            //     setWritingBy(res);
            // });
            // socket.on(code, async (d: string) => {
            //     const { id, data }: { id: string; data: PropsRoomChat } = JSON.parse(d);
            //     const codeS = `user_${id}_in_roomChat_personal_receive_and_saw`;
            //     console.log(data, 'ddd');

            //     // socket.emit(codeS, {
            //     //     userIdReceived: id_you,
            //     //     idSent: id,
            //     //     idChat: data.room._id,
            //     // });
            //     const newD: any = await new Promise(async (resolve, reject) => {
            //         if (data.room?.reply) {
            //             if (data.room.reply.text) {
            //                 data.room.reply.text = decrypt(data.room.reply?.text, `chat_${data.room.secondary ? data.room.secondary : data._id}`);
            //             }
            //         }
            //         resolve(data.room);
            //     });
            //     if (newD.text?.t) {
            //         if (newD?.secondary) {
            //             const decryptedData = decrypt(newD.text?.t, `chat_${newD.secondary}`);
            //             newD.text.t = decryptedData;
            //             newD.text.t = regexCus(newD.text.t);
            //         } else {
            //             const bytdecryptedDatas = decrypt(newD.text?.t, `chat_${conversation?._id}`);
            //             newD.text.t = bytdecryptedDatas;
            //             newD.text.t = regexCus(newD.text.t);
            //         }
            //     }
            //     data.users.push(data.user);
            //     if (!conversation?._id && conversation) {
            //         setConversation({ ...conversation, _id: data._id });
            //         console.log('eyeye');
            //     }
            //     dispatch(setRoomChat(data));
            //     setDataSent(newD);
            //     setWritingBy(undefined);
            // });
        }
        return () => {
            socket.off(`phrase_chatRoom_response_${conversation?._id}_${id_you}`);
            socket.off(`user_${conversation?.user.id}_in_roomChat_${conversation?._id}_personal_receive`);
            socket.off(code);
            socket.off(`Conversation_chat_deleteAll_${conversation?._id}`);
            socket.off(`Conversation_chat_update_${conversation?._id}`);
        };
    }, [code, conversation]);
    console.log(writingBy, 'writingBy');

    useEffect(() => {
        fetchChat();
        socket.on(
            `user_${id_you}_in_roomChat_personal_receive_and_saw_other`, // display that user has been received and seen
            (data: { userIdReceived: string; idSent: string; idChat: string }) => {
                console.log(data, 'userIdReceived');
                setWch(data.idChat);
            },
        );
    }, []);
    const targetChild = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const re = document.getElementById(`chat_to_scroll_${choicePin}`); // auto scroll when click into pin button
        // if (choicePin) {
        //     if (!conversation?.room.some((r) => r._id === choicePin)) {
        //         fetchChat(true);
        //     } else {
        //         const container = ERef.current;
        //         if (container && re) {
        //             const childRect = re.getBoundingClientRect();
        //             const containerRect = container.getBoundingClientRect();
        //             // Kiểm tra nếu phần tử con đang ở trên tầm nhìn của phần tử cha
        //             container.scrollTo({
        //                 top: container.scrollTop + (childRect.top - containerRect.top - 100), // calculate top's coordinate of child and parents
        //                 behavior: 'smooth',
        //             });
        //             // if (ERef.current) ERef.current.scrollTop = -check.current;
        //         }
        //     }
        // }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                console.log('Child element is now visible in the container', entry, ERef.current?.scrollTop);
                if (entry.isIntersecting) {
                    setChoicePin('');
                }
                // You can perform actions when the child element becomes visible here
            });
        });

        if (re) observer.observe(re);
        return () => {
            if (re) observer.unobserve(re);
        };
    }, [choicePin, conversation]);
    useEffect(() => {
        chatRef.current = conversation;
    }, [conversation]);
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
    }, [dataSent, writingBy]);
    useEffect(() => {
        return clearInterval(mRef.current);
    }, [mRef.current]);
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
        if ((value.trim() || (uploadIn && uploadIn?.up?.length > 0)) && conversation) {
            textarea.current?.setAttribute('style', 'height: 33px');
            if (ERef.current) ERef.current.scrollTop = 0;
            setValue('');

            //
            const formDataFile = new FormData();
            for (let i = 0; i < uploadIn?.up.length; i++) {
                formDataFile.append('file', uploadIn?.up[i], uploadIn?.up[i].name + '@_id_***_get_$' + uploadIn?.up[i]._id); // assign file and _id of the file upload
            }

            const urlS = uploadIn?.up.length ? await fileWorkerAPI.addFiles(formDataFile) : [];
            const id_ = uuidv4();
            const images = urlS.map((i) => {
                return { _id: i.id, v: i.id, icon: '', type: i.type }; // get key for _id
            });
            const id_s = uuidv4();
            setLoadingChat(id_);
            const chat: any = {
                createdAt: DateTime(),
                imageOrVideos: images,
                seenBy: [],
                text: { t: regexCus(value), icon: '' },
                userId: userId,
                _id: id_,
            };
            const con = conversation.rooms[conversation.rooms.length - 1];
            if (con && con.count < 10) {
                if (con.filter[con.filter.length - 1].count < 2) {
                    con.filter[con.filter.length - 1].count += 1;
                    con.filter[con.filter.length - 1].data.unshift(chat);
                } else {
                    con.filter[con.filter.length - 1].full = true;
                    con.filter.unshift({ _id: id_s, count: 1, full: false, index: 1, data: [chat], indexQuery: installOffset, createdAt: new Date() });
                }
            } else {
                conversation.rooms.unshift({
                    chatId: conversation._id,
                    count: 1,
                    full: false,
                    index: (con?.index ?? 0) + 1,
                    filter: [{ _id: id_s, count: 1, full: false, index: 1, data: [chat], indexQuery: installOffset, createdAt: new Date() }],
                    _id: id_s,
                    createdAt: new Date(),
                });
            }
            console.log(conversation.rooms, 'conversation.rooms');

            const formData = new FormData();
            const fda: any = {};
            if (value) fda.value = encrypt(value, `chat_${conversation._id ? conversation._id : id_s}`);
            if (conversationId) formData.append('conversationId', conversationId); // conversation._id
            if (id_) fda.id_room = id_; // id of the room
            if (id_s && !conversation._id) fda.id_s = id_s; // first it have no _id of the conversationId then id_s is replaced
            if (id_other) fda.id_others = id_other;
            fda.valueInfoFile = urlS;
            fda.conversationId = conversation._id;
            fda.indexRoom = conversation.rooms[conversation.rooms.length - 1].index ?? 0;

            const res = await sendChatAPI.send(fda);
            const data: PropsRoomChat | undefined = ServerBusy(res, dispatch);
            if (data) {
                rr.current = '';
                if (!conversation._id) conversation._id = data._id; // add id when id is empty
                data.users.push(conversation.user);
                setupload(undefined);
                setLoadingChat('');
                dispatch(setRoomChat(data));
            }
        }
    };

    const handleImageUpload = async (e: any) => {
        const files = e.target.files;
        const { upLoad, getFilesToPre } = await handleFileUpload(files, 15, 8, 15, dispatch, 'chat', true);
        setupload({ pre: getFilesToPre, up: upLoad });
    };

    return {
        handleImageUpload,
        uploadIn,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        option,
        handleSend,
        value,
        setValue,
        emoji,
        setEmoji,
        handleEmojiSelect,
        dispatch,
        conversation,
        setConversation,
        userId,
        fetchChat,
        loading,
        cRef,
        opMore,
        setOpMore,
        delIds,
        lg,
        ERef,
        del,
        textarea,
        date1,
        data,
        emptyRef,
        wch,
        setWch,
        rr,
        writingBy,
        setWritingBy,
        choicePin,
        setChoicePin,
        targetChild,
        itemPin,
        setItemPin,
        itemPinData,
        loadingChat,
    };
}
