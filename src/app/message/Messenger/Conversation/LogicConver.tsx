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
import { useQuery } from '@tanstack/react-query';
import userAPI from '~/restAPI/userAPI';
import { PropsBgRD } from '~/redux/background';
import handleFileUpload from '~/utils/handleFileUpload';
import { decrypt, encrypt } from '~/utils/crypto';
import { setRoomChat } from '~/redux/messenger';
import { PropsId_chats } from 'src/App';
export interface PropsRooms {
    _id: string;
    id: string;
    text: {
        t: string;
        icon: string;
    };
    delete?: string;
    update?: string;
    secondary?: string;
    length?: number;
    imageOrVideos: {
        v: string;
        type: string;
        icon: string;
        link?: string;
        _id: string;
    }[];
    sending?: boolean;
    seenBy: string[];
    updatedAt: string;
    createdAt: string;
}
export interface PropsChat {
    _id: string;
    id_us: string[];
    user: {
        id: string;
        fullName: string;
        avatar: string | undefined;
        gender: number;
    };
    status: string;
    background: string;
    pins: { chatId: string; userId: string; createdAt: string }[];
    room: PropsRooms[];
    deleted: {
        id: string;
        createdAt: string;
        show: boolean;
    }[];
    createdAt: string;
}
export default function LogicConversation(id_chat: PropsId_chats, id_you: string, userOnline: string[]) {
    const dispatch = useDispatch();
    const { delIds } = useSelector((state: PropsReloadRD) => state.reload);

    const { userId } = Cookies();
    const { lg } = Languages();
    const textarea = useRef<HTMLTextAreaElement | null>(null);
    const ERef = useRef<HTMLDivElement | null>(null);
    const del = useRef<HTMLDivElement | null>(null);
    const check = useRef<number>(0);
    const cRef = useRef<number>(0);
    const mRef = useRef<any>(0);
    const offset = useRef<number>(0);
    const limit = 20;
    const emptyRef = useRef<boolean>(false);

    const [value, setValue] = useState<string>('');
    const [emoji, setEmoji] = useState<boolean>(false);
    const [option, setOption] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [opMore, setOpMore] = useState<boolean>(false);
    const [upload, setupload] = useState<{ pre: { _id: string; link: any; type: string }[]; up: any } | undefined>();
    const chatRef = useRef<PropsChat>();
    const [wch, setWch] = useState<string | undefined>('');
    const rr = useRef<string>('');
    // pin page
    const [choicePin, setChoicePin] = useState<string>('');

    const [conversation, setConversation] = useState<PropsChat>();
    const [dataSent, setDataSent] = useState<
        | {
              createdAt: string;
              updatedAt: string;
              imageOrVideos: any;
              seenBy: string[];
              text: { t: string; icon: string };
              _id: string;
              id: string;
          }
        | undefined
    >();
    // display conversation's one day
    const date1 = useRef<moment.Moment | null>(null);
    const [writingBy, setWritingBy] = useState<{ length: number; id: string } | undefined>();

    // if (date1.isBefore(date2)) {
    //     console.log('date1 is before date2');
    // }

    // if (date1.isAfter(date2)) {
    //     console.log('date1 is after date2');
    // }

    const { data } = useQuery({
        queryKey: [
            `getActiveStatus: ${conversation?.user.id}`,
            userOnline.includes(conversation?.user.id ?? 'default'),
        ],
        staleTime: 60 * 1000,
        queryFn: async () => {
            const res = await userAPI.getActiveStatus(conversation?.user.id);
            const da: string = ServerBusy(res, dispatch);
            return da;
        },
        enabled: !userOnline.includes(conversation?.user.id ?? 'default')
            ? conversation?.user.id
                ? true
                : false
            : false,
    });

    //get image
    const fetchChat = async (moreChat: boolean = false) => {
        if (!emptyRef.current && !loading) {
            setLoading(true);

            cRef.current = 2;
            const res = await sendChatAPi.getChat(id_chat, limit, offset.current, moreChat, chatRef.current?._id);
            const dataC = ServerBusy(res, dispatch);

            if (!dataC.room.length) emptyRef.current = true;
            if (dataC) {
                const newData = await new Promise<PropsChat>(async (resolve, reject) => {
                    const modifiedData = { ...dataC };
                    await Promise.all(
                        modifiedData.room?.map(
                            async (
                                rr: {
                                    imageOrVideos: { _id: string; v: string; icon: string; type: string }[];
                                    text: { t: string };
                                    secondary?: string;
                                },
                                index1: number,
                            ) => {
                                console.log(rr, 'rr');

                                if (rr.text.t) {
                                    modifiedData.room[index1].text.t = decrypt(
                                        rr.text.t,
                                        `chat_${rr.secondary ? rr.secondary : modifiedData._id}`,
                                    );
                                }

                                await Promise.all(
                                    rr.imageOrVideos.map(
                                        async (
                                            fl: { _id: string; v: string; icon: string; type: string },
                                            index2: number,
                                        ) => {
                                            const data = await fileGridFS.getFile(fl.v, fl?.type);
                                            const buffer = ServerBusy(data, dispatch);
                                            if (data?.message === 'File not found') {
                                                modifiedData.room[index1].imageOrVideos[index2].v =
                                                    data?.type?.search('image/') >= 0
                                                        ? "Image doesn't exist"
                                                        : "Video doesn't exist";
                                            } else {
                                                const base64 = CommonUtils.convertBase64GridFS(buffer);
                                                modifiedData.room[index1].imageOrVideos[index2].v = base64;
                                            }
                                        },
                                    ),
                                );
                            },
                        ),
                    );
                    resolve(modifiedData);
                });
                const a = CommonUtils.convertBase64(newData.user?.avatar);
                if (a) newData.user.avatar = a;
                console.log(conversation, 'await');

                if (newData) {
                    if (moreChat) {
                        cRef.current = 8;
                        if (newData.room.length > 0 && chatRef.current) {
                            chatRef.current = {
                                ...chatRef.current,
                                room: [...chatRef.current.room, ...newData.room],
                            };
                        }
                    } else {
                        chatRef.current = newData;
                        cRef.current = 7;
                    }
                    offset.current += limit;
                }
                setConversation(chatRef.current);
            }
            date1.current = moment(conversation?.room[0]?.createdAt); // first element
        }

        setLoading(false);
    };
    const code = `${
        conversation?._id ? conversation._id + '-' + conversation?.user.id : conversation?.user.id + '-' + id_you
    }phrase_chatRoom`;
    useEffect(() => {
        console.log('eeeee');

        if (code) {
            socket.on(`phrase_chatRoom_response_${conversation?._id}_${id_you}`, (res) => {
                console.log('in_roomChat_personal_receive_and_saw con');
                setWch(res);
            });
            socket.on(
                `user_${conversation?.user.id}_in_roomChat_${conversation?._id}_personal_receive`,
                (res: { length: number; id: string }) => {
                    setWritingBy(res);
                },
            );
            socket.on(code, async (d: string) => {
                const { id, data }: { id: string; data: PropsRoomChat } = JSON.parse(d);
                const codeS = `user_${id}_in_roomChat_personal_receive_and_saw`;
                console.log(data, 'ddd');

                socket.emit(codeS, {
                    userIdReceived: id_you,
                    idSent: id,
                    idChat: data.room._id,
                });
                const newD: any = await new Promise(async (resolve, reject) => {
                    // room
                    // if (data.room.text.t)
                    //     data.room.text.t = decrypt(
                    //         data.room.text.t,
                    //         `chat_${data.room.secondary ? data.room.secondary : data.room._id}`,
                    //     );
                    await Promise.all(
                        data.room.imageOrVideos.map(async (d, index) => {
                            console.log('hey');

                            const buffer = await fileGridFS.getFile(d._id);
                            const base64 = CommonUtils.convertBase64GridFS(buffer);
                            data.room.imageOrVideos[index].v = base64;
                        }),
                    );
                    resolve(data.room);
                });
                if (newD.text?.t) {
                    if (newD?.secondary) {
                        const bytes = CryptoJS.AES.decrypt(newD.text?.t, `chat_${newD.secondary}`);
                        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                        newD.text.t = decryptedData;
                    } else {
                        const bytes = CryptoJS.AES.decrypt(newD.text?.t, `chat_${conversation?._id}`);
                        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                        newD.text.t = decryptedData;
                    }
                }
                const a = CommonUtils.convertBase64(data.user.avatar);
                data.user.avatar = a;
                data.users.push(data.user);
                if (!conversation?._id && conversation) {
                    setConversation({ ...conversation, _id: data._id });
                    console.log('eyeye');
                }
                dispatch(setRoomChat(data));
                setDataSent(newD);
                setWritingBy(undefined);
            });
        }
        return () => {
            socket.off(`phrase_chatRoom_response_${conversation?._id}_${id_you}`);
            socket.off(`user_${conversation?.user.id}_in_roomChat_${conversation?._id}_personal_receive`);
            socket.off(code);
        };
    }, [code, conversation]);
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
        const re = document.getElementById(`chat_to_scroll_${choicePin}`);
        if (choicePin) {
            if (!conversation?.room.some((r) => r._id === choicePin)) {
                fetchChat(true);
            } else {
                const container = ERef.current;
                if (container && re) {
                    const childRect = re.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    // Kiểm tra nếu phần tử con đang ở trên tầm nhìn của phần tử cha
                    container.scrollTo({
                        top: container.scrollTop + (childRect.top - containerRect.top - 100), // calculate top's coordinate of child and parents
                        behavior: 'smooth',
                    });
                }
            }
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setChoicePin('');

                    console.log('Child element is now visible in the container', entry, ERef.current?.scrollTop);
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
        if (dataSent && !writingBy) {
            if (conversation?.room.some((r) => r.length)) {
                conversation?.room.map((r) => {
                    if (r.length) {
                        // other is writing
                        r._id = dataSent._id;
                        r.id = dataSent.id;
                        r.text = dataSent.text;
                        r.seenBy = dataSent.seenBy;
                        r.imageOrVideos = dataSent.imageOrVideos;
                        r.createdAt = dataSent.createdAt;
                        r.length = undefined;
                    }
                });
            } else {
                conversation?.room.unshift(dataSent);
            }

            setDataSent(undefined);
        }
        if (writingBy && !conversation?.room.some((r) => r.length)) {
            const chat: any = {
                createdAt: DateTime(),
                imageOrVideos: [],
                seenBy: [],
                length: writingBy.length,
                id: writingBy.id,
                _id: '',
            };
            conversation?.room.unshift(chat);
        }
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
    const handleSend = async (id_room: string | undefined, id_other: string | undefined) => {
        if ((value.trim() || (upload && upload?.up?.length > 0)) && conversation) {
            textarea.current?.setAttribute('style', 'height: 33px');
            setValue('');
            const images = upload
                ? upload?.pre.map((i) => {
                      return { _id: i._id, v: i.link, type: i.type, icon: '' }; // get key for _id
                  })
                : [];
            const id_ = uuidv4();
            const chat: any = {
                createdAt: DateTime(),
                imageOrVideos: images,
                seenBy: [],
                text: { t: value, icon: '' },
                sending: true,
                id: userId,
                _id: id_,
            };
            if (conversation) conversation.room.unshift(chat);
            const formData = new FormData();
            const id_s = uuidv4();
            formData.append('value', encrypt(value, `chat_${conversation._id ? conversation._id : id_s}`));
            if (id_room) formData.append('id_room', id_room);
            if (id_) formData.append('id_', id_); // id of the room
            if (id_s && !conversation._id) formData.append('id_s', id_s); // first it have no id of the room then id_s is replace
            if (id_other) formData.append('id_others', id_other);

            for (let i = 0; i < upload?.up.length; i++) {
                formData.append('files', upload?.up[i], upload?.up[i]._id); // assign file and _id of the file upload
            }

            const res = await sendChatAPI.send(formData);
            const data: PropsRoomChat | undefined = ServerBusy(res, dispatch);
            const ciphertext = CryptoJS.AES.encrypt(JSON.stringify([1, 5]), 'hello').toString();
            console.log(ciphertext, 'ciphertext');
            const bytes = CryptoJS.AES.decrypt(ciphertext, 'hello');
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            console.log(JSON.parse(decryptedData), 'decryptedData');
            if (data && conversation) {
                rr.current = '';
                conversation.room.map((r) => {
                    if (r.sending) r.sending = false;
                });
                if (!conversation._id) conversation._id = data._id; // add id when id is empty
                data.users.push(conversation.user);
                setupload(undefined);
                dispatch(setRoomChat(data));
            }
        }
    };

    const handleImageUpload = async (e: any) => {
        const files = e.target.files;
        const { upLoad, getFilesToPre } = await handleFileUpload(files, 15, 8, 15, dispatch, 'chat');
        setupload({ pre: getFilesToPre, up: upLoad });
    };

    return {
        handleImageUpload,
        upload,
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
        check,
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
    };
}
