import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import sendChatAPi, { PropsRoomChat } from '~/restAPI/chatAPI';
import sendChatAPI from '~/restAPI/chatAPI';
import CommonUtils from '~/utils/CommonUtils';

import DateTime from '~/reUsingComponents/CurrentDateTime';
import { setTrueErrorServer } from '~/redux/hideShow';
import fileGridFS from '~/restAPI/gridFS';
import { socket } from 'src/mainPage/nextWeb';
import Cookies from '~/utils/Cookies';
import { PropsReloadRD, setRoomChat, setSession } from '~/redux/reload';
import Languages from '~/reUsingComponents/languages';
import { gql, useQuery } from '@apollo/client';
import http from '~/utils/http';
import ServerBusy from '~/utils/ServerBusy';
import { useCookies } from 'react-cookie';

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
    room: {
        _id: string;
        text: {
            t: string;
            icon: string;
        };
        imageOrVideos: {
            v: string;
            type?: string;
            icon: string;
            _id: string;
        }[];
        sending?: boolean;
        seenBy: string[];
        createdAt: string;
    }[];
    deleted: {
        id: string;
        createdAt: string;
        show: boolean;
    }[];
    createdAt: string;
}
export default function LogicConversation(id_chat: { id_room: string | undefined; id_other: string }, id_you: string) {
    const dispatch = useDispatch();
    const { delIds } = useSelector((state: PropsReloadRD) => state.reload);

    const { userId, token } = Cookies();
    const { lg } = Languages();

    const ERef = useRef<any>();
    const del = useRef<HTMLDivElement | null>(null);
    const check = useRef<number>(0);
    const cRef = useRef<number>(0);
    const mRef = useRef<any>(0);
    const offset = useRef<number>(0);
    const fileRef = useRef<any>([]);
    const limit = 20;

    const [value, setValue] = useState<string>('');
    const [emoji, setEmoji] = useState<boolean>(false);
    const [option, setOption] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [opMore, setOpMore] = useState<boolean>(false);
    const [fileUpload, setFileUpload] = useState<any>([]);
    const [upload, setupload] = useState<{ link: any; type: string }[]>([]);
    const uploadRef = useRef<{ link: string; type: string }[]>([]);
    const chatRef = useRef<PropsChat>();

    const [conversation, setConversation] = useState<PropsChat>();
    const [dataSent, setDataSent] = useState<
        | {
              createdAt: string;
              imageOrVideos: any;
              seenBy: string[];
              text: { t: string; icon: string };
              _id: string;
          }
        | undefined
    >();
    const GET_Phrase = gql`
        query Get_Phrases($id: String!, $limit: Int!, $offset: Int!) {
            chats(id_room: $id, limit: $limit, offset: $offset) {
                _id
                text {
                    t
                    icon
                }
                imageOrVideos {
                    v
                    icon
                    _id
                }
                seenBy
                createdAt
            }
        }
    `;
    // const { data, client } = useQuery(GET_Phrase, {
    //     skip: conversation?._id ? false : true,
    //     variables: {
    //         id: conversation?._id,
    //         limit: limit,
    //         offset: offset.current,
    //     },
    // });
    // console.log(data, 'GET_PHRASE');

    async function fetchChat(moreChat?: boolean) {
        console.log('api');

        setLoading(true);
        cRef.current = 2;
        const res = await sendChatAPi.getChat(id_chat, limit, offset.current, moreChat);
        const data = ServerBusy(res, dispatch);

        if (res) {
            const newData = await new Promise<PropsChat>(async (resolve, reject) => {
                const modifiedData = { ...data };
                console.log(modifiedData, data, 'modifiedData');

                await Promise.all(
                    modifiedData.room.map(
                        async (rr: { imageOrVideos: { v: string; icon: string }[] }, index1: number) => {
                            await Promise.all(
                                rr.imageOrVideos.map(async (fl: { v: string; icon: string }, index2: number) => {
                                    const buffer = await fileGridFS.getFile(fl.v);
                                    const base64 = CommonUtils.convertBase64GridFS(buffer.file);
                                    modifiedData.room[index1].imageOrVideos[index2].v = base64;
                                }),
                            );
                        },
                    ),
                );
                resolve(modifiedData);
            });
            const a = CommonUtils.convertBase64(newData.user?.avatar);
            if (a) newData.user.avatar = a;

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

        setLoading(false);
    }
    const code = `${conversation?._id + '-' + conversation?.user.id}phrase`;
    useEffect(() => {
        if (code) {
            socket.on(code, async (d: string) => {
                console.log('yesss me');

                const data: PropsRoomChat = JSON.parse(d);
                const newD: any = await new Promise(async (resolve, reject) => {
                    await Promise.all(
                        data.room.imageOrVideos.map(async (d, index) => {
                            const buffer = await fileGridFS.getFile(d.v);
                            const base64 = CommonUtils.convertBase64GridFS(buffer.file);
                            data.room.imageOrVideos[index].v = base64;
                        }),
                    );
                    resolve(data.room);
                });
                const a = CommonUtils.convertBase64(data.user.avatar);
                data.user.avatar = a;
                data.users.push(data.user);
                dispatch(setRoomChat(data));
                setDataSent(newD);
                console.log(newD, 'be sent by others');
            });
        }
    }, [code]);
    useEffect(() => {
        fetchChat();
    }, []);

    useEffect(() => {
        if (dataSent) {
            conversation?.room.unshift(dataSent);
            setDataSent(undefined);
        }
    }, [dataSent]);
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
    const handleSend = async (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        id_room: string | undefined,
        id_other: string | undefined,
    ) => {
        if (value || upload.length > 0) {
            setValue('');
            const images = upload.map((i) => {
                return { v: i.link, type: 'image', icon: '', _id: String(Math.random()) };
            });
            const chat: any = {
                createdAt: DateTime(),
                imageOrVideos: images,
                seenBy: [],
                text: { t: value, icon: '' },
                sending: true,
                _id: userId,
            };
            if (conversation) conversation.room.unshift(chat);
            uploadRef.current = [];
            fileRef.current = [];
            const formData = new FormData();
            formData.append('value', value);
            if (id_room) formData.append('id_room', id_room);
            if (id_other) formData.append('id_others', id_other);
            console.log(id_room, 'id_room here ne!');

            for (let i = 0; i < fileUpload.length; i++) {
                formData.append('files', fileUpload[i]);
            }
            const res = await sendChatAPI.send(formData);
            const data: PropsRoomChat | undefined = ServerBusy(res, dispatch);

            if (data && conversation) {
                conversation.room.map((r) => {
                    if (r.sending) r.sending = false;
                });
                if (!conversation._id) conversation._id = data._id; // add id when id is empty
                data.users.push(conversation.user);
                dispatch(setRoomChat(data));
                setFileUpload([]);
            }
        }
    };

    const handleImageUpload = async (e: any) => {
        uploadRef.current = [];
        fileRef.current = [];
        const files = e.target.files;
        const options = {
            maxSizeMB: 10,
        };
        let fileAmount = 15;

        if (files.length > 0 && files.length < fileAmount) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (
                    file.type.includes('video/mp4') ||
                    file.type.includes('video/mov') ||
                    file.type.includes('video/x-matroska')
                ) {
                    const url = URL.createObjectURL(file);
                    const vid = document.createElement('video');
                    // create url to use as the src of the video
                    vid.src = url;
                    // wait for duration to change from NaN to the actual duration
                    // eslint-disable-next-line no-loop-func
                    vid.ondurationchange = function () {
                        console.log(vid.duration);

                        vid.duration <= 15
                            ? uploadRef.current.push({ link: url, type: 'video' })
                            : dispatch(setTrueErrorServer('Our length of the video must be less than 16 seconds!'));
                    };
                } else if (
                    file.type.includes('image/jpg') ||
                    file.type.includes('image/jpeg') ||
                    file.type.includes('image/png')
                ) {
                    try {
                        console.log((file.size / 1024 / 1024).toFixed(1), 'not compress');
                        if (Number((file.size / 1024 / 1024).toFixed(1)) <= 8) {
                            // const base64: any = await CommonUtils.getBase64(file);
                            fileRef.current.push(file);
                            uploadRef.current.push({ link: URL.createObjectURL(file), type: 'image' });
                        } else {
                            const compressedFile: any = await CommonUtils.compress(file);
                            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
                            console.log(`compressedFile size ${(compressedFile.size / 1024 / 1024).toFixed(1)} MB`); // smaller than maxSizeMB
                            const sizeImage = Number((compressedFile.size / 1024 / 1024).toFixed(1));
                            if (sizeImage <= 8) {
                                uploadRef.current.push({ link: URL.createObjectURL(compressedFile), type: 'image' });
                            } else {
                                dispatch(setTrueErrorServer(`${sizeImage}MB big than our limit is 8MB`));
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    dispatch(setTrueErrorServer('This format is not support!'));
                }
            }
            const time = setInterval(() => {
                if (uploadRef.current.length > 0) {
                    setFileUpload(fileRef.current);
                    setupload(uploadRef.current);
                }
                console.log('no');
            }, 1000);
            mRef.current = time;
        } else {
            dispatch(setTrueErrorServer(`You can only select ${fileAmount} file at most!`));
        }
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
    };
}
