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
import { PropsDataFileUpload } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/FormUpNews';
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
export interface PropsImageOrVideosAtMessenger {
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
    delete?: string | 'all';
    update?: string;
    secondary?: string;
    length?: number;
    imageOrVideos: PropsImageOrVideosAtMessenger[];
    sending?: boolean;
    seenBy: string[];
    updatedAt: string;
    createdAt: string;
    reply: {
        id_room: string;
        id_reply: string;
        id_replied: string;
        text: string;
        imageOrVideos: PropsImageOrVideosAtMessenger[];
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
    rooms: PropsItemRoom;
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
    lastElement: { roomId: string; filterId: string };
}
type PropsItemQueryChat = { indexRef: number; indexQuery: number; data: PropsChat; load: { id: string; status: string }[] } | undefined;
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
    console.log(id_you, 'id_you', id_chat);

    const dispatch = useDispatch();
    const { delIds } = useSelector((state: PropsReloadRD) => state.reload);
    //action
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
    const moreAction = useRef<{ prevent: boolean; moreChat: boolean }>({ prevent: true, moreChat: false });

    const [value, setValue] = useState<string>('');
    const [emoji, setEmoji] = useState<boolean>(false);
    const [option, setOption] = useState<boolean>(false);
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
    // enabled:conversation?.user.id ? true : false, queryKey: [`getActiveStatus: ${conversation?.user.id}`, userOnline.includes(conversation?.user.id ?? 'default')],
    const {
        data: converData,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['getItemChats', `${id_chat.id_other}_${id_you}`],
        staleTime: 60 * 60 * 1000,
        cacheTime: 1 * 60 * 60 * 1000,
        enabled: !emptyRef.current && cRef.current !== 2,
        queryFn: async ({ queryKey }) => {
            cRef.current = 2;
            const preData: PropsItemQueryChat = queryClient.getQueryData(queryKey);
            const res = await sendChatAPi.getChat(id_chat, preData?.indexQuery ?? 0, moreAction.current.moreChat, preData?.indexRef ?? 0, preData?.data._id);
            const dataC: PropsConversationCustoms & PropsRooms = ServerBusy(res, dispatch);
            console.log(dataC, 'chatRef.current', indexRef.current);
            if (dataC) {
                if (!dataC.rooms.length) emptyRef.current = true;
                dataC.rooms?.map((rr, index1: number) => {
                    if (!rr.filter.length) {
                        indexRef.current += 1;
                        offset.current = 1;
                    }
                    rr.filter.map((d) => {
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
                        d.data.sort((a, b) => (new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1));
                    });
                });
                if (moreAction.current.moreChat) {
                    cRef.current = 8;
                    const preData: PropsItemQueryChat = queryClient.getQueryData(['getItemChats', id_chat.id_other + '_' + id_you]);
                    if (dataC.rooms.length > 0 && preData) if (preData) preData.data.rooms = [...preData.data.rooms, ...dataC.rooms];
                    moreAction.current.moreChat = false;
                    return {
                        load: preData?.load ?? [],
                        indexQuery: dataC.rooms[0] ? dataC.rooms[0]?.filter[0]?.indexQuery : preData?.indexQuery,
                        data: preData?.data,
                        indexRef: dataC.rooms[0] ? dataC.rooms[0]?.index : preData?.indexRef,
                    };
                } else {
                    cRef.current = 7;
                    return {
                        load: [],
                        indexQuery: dataC.rooms[0] ? dataC.rooms[0]?.filter[0]?.indexQuery : preData?.indexQuery,
                        data: dataC,
                        indexRef: dataC.rooms[0] ? dataC.rooms[0]?.index : preData?.indexRef,
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
    //get image
    useEffect(() => {
        if (data) {
            const code = `${data?._id ? data._id : data?.user.id + '-' + id_you}phrase_chatRoom`;
            console.log('eeeee', code);
            // socket.on(`conversation_deleteBG_room_${data._id}`, () => {
            //     setConversation((pre) => {
            //         if (pre) return { ...pre, background: undefined };
            //         return pre;
            //     });
            // });
            // socket.on(`conversation_changeBG_room_${data._id}`, async (dataBG: PropsBackground_chat) => {
            //     if (dataBG && dataBG.userId !== id_you) {
            //         setConversation((pre) => {
            //             if (pre) return { ...pre, background: dataBG };
            //             return pre;
            //         });
            //     }
            // });

            // socket.on(`Conversation_chat_deleteAll_${data._id}`, (deleteData: { roomId: string; filterId: string; dataId: string; userId: string; updatedAt: string }) => {
            //     if (deleteData && deleteData.userId !== id_you) {
            //         setConversation((pre) => {
            //             if (pre)
            //                 return {
            //                     ...pre,
            //                     rooms: pre.rooms.map((r) => {
            //                         if (r._id === deleteData.roomId) {
            //                             r.filter.map((f) => {
            //                                 if (f._id === deleteData.filterId) {
            //                                     f.data.map((d) => {
            //                                         if (d._id === deleteData.dataId) {
            //                                             d.text.t = '';
            //                                             d.imageOrVideos = [];
            //                                             d.delete = 'all';
            //                                             d.updatedAt = deleteData.updatedAt;
            //                                         }
            //                                         return d;
            //                                     });
            //                                 }
            //                                 return f;
            //                             });
            //                         }
            //                         return r;
            //                     }),
            //                 };
            //             return pre;
            //         });
            //     }
            // });
            // socket.on(
            //     `Conversation_chat_update_${conversation._id}`,
            //     async (updateData: {
            //         updatedBy: string;
            //         roomId: string;
            //         filterId: string;
            //         dataId: string;
            //         data: { value: string | undefined; imageOrVideos: PropsImageOrVideosAtMessenger[] };
            //         userId: string;
            //     }) => {
            //         console.log(updateData, 'updateData');
            //         // upPin.mutate({
            //         //     _id: conversation._id,
            //         //     chatId: updateData.chatId,
            //         //     data: { file: updateData.data.imageOrVideos, text: updateData.data.text.t },
            //         // });
            //         // upPin.mutate({
            //         //     file: fileUpload?.up.length && data.imageOrVideos ? data.imageOrVideos : undefined,
            //         //     text: data.text.t ? data.text.t : '',
            //         // });
            //         if (updateData.userId !== id_you && conversation) {
            //             setConversation((pre) => {
            //                 return pre
            //                     ? {
            //                           ...(pre ?? {}),
            //                           rooms: conversation.rooms.map((r) => {
            //                               if (r._id === updateData.roomId) {
            //                                   r.filter.map((f) => {
            //                                       if (f._id === updateData.filterId) {
            //                                           f.data.map((d) => {
            //                                               if (d._id === updateData.dataId) {
            //                                                   if (updateData.data.imageOrVideos.length) {
            //                                                       d.imageOrVideos = updateData.data.imageOrVideos;
            //                                                   }
            //                                                   if (updateData.data.value) {
            //                                                       d.text.t = decrypt(updateData.data.value, `chat_${d?.secondary ? d.secondary : conversation._id}`);
            //                                                   }
            //                                                   d.update = updateData.updatedBy;
            //                                               }
            //                                               return d;
            //                                           });
            //                                       }
            //                                       return f;
            //                                   });
            //                               }

            //                               return r;
            //                           }),
            //                       }
            //                     : pre;
            //             });
            //         }
            //     },
            // );

            // socket.on(`phrase_chatRoom_response_${conversation._id}_${id_you}`, (res) => {
            //     console.log('in_roomChat_personal_receive_and_saw con');
            //     setWch(res);
            // });
            // socket.on(`user_${conversation?.user.id}_in_roomChat_${conversation._id}_personal_receive`, (res: { length: number; id: string }) => {
            //     setWritingBy(res);
            // });
            socket.on(code, async (d) => {
                const { userId, data: dataSocket }: { userId: string; data: PropsRoomChat } = d;
                const codeS = `user_${userId}_in_roomChat_personal_receive_and_saw`;
                if (userId !== id_you) {
                    console.log(dataSocket, 'ddd');
                    // socket.emit(codeS, {
                    //     userIdReceived: id_you,
                    //     idSent: id,
                    //     idChat: data.room._id,
                    // });
                    queryClient.setQueryData(['getItemChats', id_chat.id_other + '_' + id_you], (preData: PropsItemQueryChat) => {
                        let roomPo = false;
                        let filterPo = false;
                        const DataIn = dataSocket.rooms.filter[0].data[0];
                        if (DataIn.text?.t) {
                            if (DataIn?.secondary) {
                                dataSocket.rooms.filter[0].data[0].text.t = decrypt(DataIn.text?.t, `chat_${DataIn.secondary}`);
                            } else {
                                dataSocket.rooms.filter[0].data[0].text.t = decrypt(DataIn.text?.t, `chat_${data._id}`);
                            }
                        }
                        preData?.data.rooms.map((r) => {
                            if (r._id === dataSocket.rooms._id) {
                                roomPo = true;
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
                            preData?.data.rooms.unshift(dataSocket.rooms);
                        }
                        console.log('changed', preData);
                        return preData;
                    });
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
            return () => {
                socket.off(`phrase_chatRoom_response_${conversation?._id}_${id_you}`);
                socket.off(`user_${conversation?.user.id}_in_roomChat_${conversation?._id}_personal_receive`);
                socket.off(code);
                socket.off(`Conversation_chat_deleteAll_${conversation?._id}`);
                socket.off(`Conversation_chat_update_${conversation?._id}`);
            };
        }
    }, [data]);
    console.log(writingBy, 'writingBy', isFetching);

    useEffect(() => {
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
        if ((value.trim() || (uploadIn && uploadIn?.up?.length > 0)) && data) {
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
            converData.load = [...(converData.load ?? []), { id: id_, status: 'loading' }];
            const chat: any = {
                createdAt: DateTime(),
                imageOrVideos: images,
                seenBy: [],
                text: { t: value, icon: '' },
                userId: userId,
                _id: id_,
            };
            const con = data.rooms.find((r) => r._id === data.lastElement.roomId);
            console.log(con, 'connn');

            if (con && con.count < 50) {
                const filter = con.filter.find((f) => f._id === data.lastElement.filterId) ?? con.filter[con.filter.length - 1];
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
            const res = await sendChatAPI.send(fda);
            const dataSent: typeof res | undefined = ServerBusy(res, dispatch);
            queryClient.setQueryData(['getItemChats', id_chat.id_other + '_' + id_you], (preData: PropsItemQueryChat) => {
                if (preData) {
                    if (dataSent) {
                        dataSent.rooms.filter[0].data[0].text.t = value;
                        data?.rooms.map((r) => {
                            if (r._id === 'new') {
                                r = dataSent.rooms;
                            } else if (r._id === dataSent.rooms._id) {
                                r.count = dataSent.rooms.count;
                                r.index = dataSent.rooms.index;
                                r.full = dataSent.rooms.full;
                                r.filter.map((f) => {
                                    if (f._id === 'new') {
                                        f = dataSent.rooms.filter[0];
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
                        return { ...preData, data, load: converData?.load.filter((r) => r.id === dataSent.rooms.filter[0].data[0]._id) };
                        // dispatch(setRoomChat(dataSent));
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
            setupload(undefined);
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
        cRef,
        opMore,
        setOpMore,
        delIds,
        lg,
        ERef,
        del,
        textarea,
        date1,
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
        loadingChat: converData?.load,
        isFetching,
        refetch,
        moreAction,
        data,
    };
}
