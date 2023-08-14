import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';

import userAPI from '~/restAPI/userAPI';
import sendChatAPi, { PropsRoomChat } from '~/restAPI/chatAPI';
import sendChatAPI from '~/restAPI/chatAPI';
import CommonUtils from '~/utils/CommonUtils';

import DateTime from '~/reUsingComponents/CurrentDateTime';
import { setTrueErrorServer } from '~/redux/hideShow';
import fileGridFS from '~/restAPI/gridFS';
import { socket } from 'src/mainPage/nextWeb';
import Cookies from '~/utils/Cookies';
import moment from 'moment';
import { setRoomChat, setSession } from '~/redux/reload';

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
    }[];
    createdAt: string;
}
export default function LogicConversation(id_chat: { id_room: string | undefined; id_other: string }, id_you: string) {
    const dispatch = useDispatch();
    const { userId, token } = Cookies();

    const cRef = useRef<number>(0);
    const mRef = useRef<any>(0);
    const offset = useRef<number>(0);
    const fileRef = useRef<any>([]);
    const limit = 20;

    const [value, setValue] = useState<string>('');
    const [emoji, setEmoji] = useState<boolean>(false);
    const [option, setOption] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

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
    async function fetchChat(of?: boolean) {
        console.log('api');

        setLoading(true);
        cRef.current = 2;
        const res = await sendChatAPi.getChat(id_chat, limit, offset.current, of);
        if (typeof res === 'string' && res === 'NeGA_off') {
            dispatch(setSession('The session expired! Please login again'));
        } else {
            if (res) {
                const newData = await new Promise<PropsChat>(async (resolve, reject) => {
                    const modifiedData = { ...res };
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
                    if (of) {
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
        }

        setLoading(false);
    }
    useEffect(() => {
        fetchChat();
        socket.on(`${id_chat.id_room + '-' + id_chat.id_other}phrase`, async (d: string) => {
            const data: PropsRoomChat = JSON.parse(d);
            const newD: any = await new Promise(async (resolve, reject) => {
                try {
                    await Promise.all(
                        data.room.imageOrVideos.map(async (d, index) => {
                            const buffer = await fileGridFS.getFile(d.v);
                            const base64 = CommonUtils.convertBase64GridFS(buffer.file);
                            data.room.imageOrVideos[index].v = base64;
                        }),
                    );
                    resolve(data.room);
                } catch (error) {
                    reject(error);
                }
            });
            const a = CommonUtils.convertBase64(data.user.avatar);
            data.user.avatar = a;
            data.users.push(data.user);
            dispatch(setRoomChat(data));
            setDataSent(newD);
            console.log(newD, 'be sent by others');
        });
    }, []);
    console.log(conversation, 'con');

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
            for (let i = 0; i < fileUpload.length; i++) {
                formData.append('files', fileUpload[i]);
            }
            const res = await sendChatAPI.send(formData);
            if (res && conversation) {
                conversation.room[0].sending = false;
                res.users.push(conversation.user);
                dispatch(setRoomChat(res));
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
        userId,
        fetchChat,
        loading,
        cRef,
    };
}