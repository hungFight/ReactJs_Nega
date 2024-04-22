import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivConversation, DivResultsConversation } from '../styleSed';
import { DotI, CameraI, ProfileCircelI, SendOPTI, UndoI, LoadingI, MinusI, ClockCirclesI, BalloonI, MoveI, TyOnlineI, PenI, EraserI, PinI, BackgroundI, GarbageI } from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { DivLoading, DivPos, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import dataEmoji from '@emoji-mart/data/sets/14/facebook.json';
import Picker from '@emoji-mart/react';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { Label, Textarea } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';
import LogicConversation, { PropsChat, PropsPinC } from './LogicConver';
import { Player } from 'video-react';
import { PropsId_chats, PropsUser } from 'src/App';
import moment from 'moment';
import 'moment/locale/vi';
import { setOpenProfile } from '~/redux/hideShow';
import ItemsRoom from './ItemsConvers';
import { PropsBgRD } from '~/redux/background';
import MoreOption from '../MoreOption';
import { setDelIds } from '~/redux/reload';
import sendChatAPi from '~/restAPI/chatAPI';
import ServerBusy from '~/utils/ServerBusy';
import { useSelector } from 'react-redux';
import OptionForItem, { PropsOptionForItem } from './OptionForItems/OptionForItem';
import moments from '~/utils/moment';
import { socket } from 'src/mainPage/nextWeb';
import { PropsConversionText } from 'src/dataText/DataMessenger';
import { decrypt } from '~/utils/crypto';
import PinChat from './PinChat';
import { offChats, removeBalloon, setBalloon, setTopLeft } from '~/redux/roomsChat';
import handleFileUpload from '~/utils/handleFileUpload';
import chatAPI from '~/restAPI/chatAPI';
import gridFS from '~/restAPI/gridFS';
import CommonUtils from '~/utils/CommonUtils';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'src';
import fileWorkerAPI from '~/restAPI/fileWorkerAPI';
export interface PropsDataMoreConversation {
    options: {
        id: number;
        load?: boolean;
        name: string;
        device?: string;
        color?: string;
        icon: JSX.Element;
        onClick: (e?: any) => void;
    }[];
    id_room: string | undefined;

    id: string | undefined;
    avatar: string | undefined;
    fullName: string | undefined;
    gender: number | undefined;
}
const Conversation: React.FC<{
    index: number;
    colorText: string;
    colorBg: number;
    id_chat: { id_room?: string; id_other: string };
    dataFirst: PropsUser;
    currentPage: number;
    chat: PropsId_chats[];
    id_chats: PropsId_chats[];
    css?: string;
    top?: number;
    left?: number;
    permanent: {
        index: number;
        id: string;
    };
    setId_chats: React.Dispatch<
        React.SetStateAction<
            {
                id_room?: string;
                id_other: string;
                top?: number | undefined;
                left?: number | undefined;
            }[]
        >
    >;
    userOnline: string[];
    conversationText: PropsConversionText;
    mm: React.MutableRefObject<
        {
            index: number;
            id: string;
        }[]
    >;
    balloon: string[];
}> = ({ index, colorText, colorBg, dataFirst, id_chat, currentPage, chat, id_chats, css, top, left, permanent, setId_chats, userOnline, conversationText, mm, balloon }) => {
    const {
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
    } = LogicConversation(id_chat, dataFirst.id, userOnline);
    if (conversation?._id) {
        if (!mm.current.some((m) => m.id === conversation?._id && index === m.index)) {
            mm.current.push({ id: conversation._id, index });
        }
    }
    const [moves, setMoves] = useState<string[]>([]);
    const [mouse, setMouse] = useState<string[]>([]);
    const one = useRef<boolean>(true);
    const [roomImage, setRoomImage] = useState<{ id_room: string; id_file: string } | undefined>(undefined);

    const xRef = useRef<number | null>(null);
    const yRef = useRef<number | null>(null);
    const scrollCheck = useRef<boolean>(true);
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (conversation?._id && moves.includes(conversation._id) && del.current)
            if (moves.some((m) => m === conversation?._id || m === conversation?.user.id)) {
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
                if (!mouse.some((m) => m === conversation._id)) {
                    setMouse([...mouse, conversation._id]);
                }
            }
    };
    const handleMouseUp = () => {
        if (conversation && moves.includes(conversation._id)) {
            if (yRef.current && xRef.current) dispatch(setTopLeft({ ...id_chat, top: yRef.current, left: xRef.current }));
            setMouse((pre) => pre.filter((m) => m !== conversation._id));
        }
    };
    console.log(left, 'left');

    const handleTouchMoveRoomChat = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (conversation?._id && mouse.includes(conversation?._id ?? '') && del.current) {
            const x = e.clientX;
            const y = e.clientY;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            if (del.current) {
                del.current.style.transition = 'none';
                if (viewportWidth - 10 >= x && x >= 19) {
                    xRef.current = x - 200;
                    del.current.style.left = `${x - 200}px`;
                }
                if (viewportHeight - 10 >= y && y >= 24) {
                    yRef.current = y - 200;
                    del.current.style.top = `${y - 200}px`;
                }
            }
        }
        // Đặt vị trí cho phần tử
    };
    const [loadDel, setLoadDel] = useState<boolean>(false);
    useEffect(() => {
        if (ERef.current) ERef.current.addEventListener('scroll', handleScroll);
        return () => {
            ERef.current?.removeEventListener('scroll', handleScroll);
        };
        // Optional: Call the observer's callback function immediately to get the initial scroll height
    }, []);

    const handleTime = (dateTime: string, type: string) => {
        if (type === 'hour') {
            const newDateTime = moment(dateTime).locale(lg).format('LT');
            return newDateTime;
        } else {
            const newDateTime = moment(dateTime)
                .locale(lg)
                .format(lg === 'vi' ? 'dddd, LL' : 'MMMM Do YYYY');
            return newDateTime;
        }
    };
    const handleWatchMore = (e: any) => {
        // e.stopPropagation();
        console.log(e);

        if (e) {
            if (e?.getAttribute('class').includes('chatTime')) {
                e.classList.remove('chatTime');
            } else {
                e.classList.add('chatTime');
            }
        }
    };

    const handleScroll = () => {
        if (scrollCheck.current) scrollCheck.current = false;
        if (!emptyRef.current && ERef.current) {
            const { scrollTop, clientHeight, scrollHeight } = ERef.current;
            const scrollBottom = -scrollTop + clientHeight;
            if (scrollBottom >= scrollHeight - 250 && !loading) {
                if (cRef.current !== 2) {
                    // wait for another request
                    fetchChat(true);
                }
            }
        }
    };

    const handleProfile = () => {
        const id_oth: string[] = [];
        conversation?.id_us.forEach((id) => {
            if (id !== userId) id_oth.push(id);
        });
        dispatch(setOpenProfile({ newProfile: id_oth, currentId: '' }));
    };
    const handleDelete = async () => {
        setLoadDel(true);
        if (conversation) {
            const res = await sendChatAPi.delete(conversation._id);
            const data:
                | {
                      _id: string;
                      deleted: {
                          id: string;
                          createdAt: string;
                          _id: string;
                          show: boolean;
                      }[];
                  }
                | undefined = ServerBusy(res, dispatch);

            if (data) {
                setConversation({ ...conversation, rooms: [], deleted: data.deleted });
                dispatch(setDelIds(data));
            }
        }

        setLoadDel(false);
    };
    const handleUndo = async () => {
        console.log('Undo');
        setLoadDel(true);
        if (conversation?._id) {
            emptyRef.current = false;
            const res = await sendChatAPi.undo(conversation._id);
            const dataV: PropsChat | undefined = ServerBusy(res, dispatch);
            if (dataV) {
                const newData = await new Promise<PropsChat>(async (resolve, reject) => {
                    const modifiedData: any = { ...dataV };
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
                                if (rr.text.t) {
                                    modifiedData.room[index1].text.t = decrypt(rr.text.t, `chat_${rr.secondary ? rr.secondary : modifiedData._id}`);
                                }
                            },
                        ),
                    );
                    resolve(modifiedData);
                });
                cRef.current = 0;
                dispatch(setDelIds(undefined));
                console.log(newData, 'newDataBG');
                setConversation(newData);
            }
        }
        setLoadDel(false);
    };
    const ye = !moves.some((m) => m === conversation?._id || m === conversation?.user.id);

    const handleImageUploadBg = async (e: any) => {
        // if (!ye) e.preventDefault();
        // if (conversation && ye) {
        //     const files = e.target.files;
        //     const { upLoad, getFilesToPre } = await handleFileUpload(files, 15, 8, 15, dispatch, 'chat', false);
        //     const fileC: any = upLoad[0];
        //     const formData = new FormData();
        //     if (fileC) {
        //         formData.append('file', fileC); // assign file and _id of the file upload
        //         if (conversation.background) formData.append('old_id', conversation.background.id);
        //         const re = await fileWorkerAPI.addFiles(formData);
        //         if (re?.length) {
        //             const res: { userId: string; latestChatId: string } = await chatAPI.setBackground({
        //                 latestChatId: conversation.room[0]._id,
        //                 conversationId: conversation._id,
        //                 id_file: re.map((f) => ({ id: f.id, type: f.type }))[0],
        //             });
        //             if (res)
        //                 setConversation((pre) => {
        //                     if (pre)
        //                         return {
        //                             ...pre,
        //                             background: {
        //                                 id: fileC._id,
        //                                 v: getFilesToPre[0].link,
        //                                 type: getFilesToPre[0].type,
        //                                 userId: res.userId,
        //                                 latestChatId: res.latestChatId,
        //                             },
        //                         };
        //                     return pre;
        //                 });
        //         }
        //     }
        //     e.target.value = '';
        // }
    };
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
        id_room: conversation?._id,
        id: conversation?.user.id,
        avatar: conversation?.user.avatar,
        fullName: conversation?.user.fullName,
        gender: conversation?.user.gender,
        options: [
            {
                id: 1,
                name: conversationText.optionRoom.personal,
                icon: <ProfileCircelI />,
                color: '#2880cc',
                onClick: () => {
                    if (conversation?.user.id && ye) dispatch(setOpenProfile({ newProfile: [conversation?.user.id] }));
                },
            },
            {
                id: 2,
                name: '',
                icon: (
                    <>
                        <Div
                            wrap="wrap"
                            css={`
                                align-items: center;
                                justify-content: left;
                                cursor: var(--pointer);
                                svg {
                                    margin-right: 5px;
                                }
                                form {
                                    ${conversation?.background ? 'margin-bottom: 12px;' : ''}
                                }
                            `}
                        >
                            <form method="post" encType="multipart/form-data">
                                <input id={conversation?._id + 'uploadCon_BG'} type="file" name="file" onChange={handleImageUploadBg} hidden />
                                <Label htmlFor={conversation?._id + 'uploadCon_BG'} color={colorText} css="align-items: center; font-size: 1.5rem; @media(min-width: 768px){font-size: 1.3rem}">
                                    <Div css="font-size: 25px; color: #eedec8; @media(min-width: 768px){font-size: 20px}">
                                        <BackgroundI />
                                    </Div>{' '}
                                    {conversationText.optionRoom.background}
                                </Label>
                            </form>
                            {conversation?.background && (
                                <Div
                                    css="width: 100%; align-items: center; display: flex; svg{margin-right: 3px;} "
                                    onClick={async () => {
                                        if (conversation && conversation.background) {
                                            const fileDed = await fileWorkerAPI.deleteFileImg([conversation.background.id]);
                                            if (fileDed) {
                                                const res: boolean = await chatAPI.delBackground(conversation._id);
                                                if (res)
                                                    setConversation((pre) => {
                                                        if (pre) return { ...pre, background: undefined };
                                                        return pre;
                                                    });
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
                onClick: () => {},
            },
            {
                id: 3,
                name: (balloon.some((b) => b === conversation?._id) ? conversationText.optionRoom.balloonDel + ' ' : '') + conversationText.optionRoom.balloon,
                icon: <BalloonI />,
                color: '#e489a2',
                onClick: () => {
                    if (conversation?._id && ye)
                        if (!balloon.some((b) => b === conversation._id)) {
                            dispatch(setBalloon(conversation?._id));
                        } else {
                            removeBall.mutate(conversation._id);
                            dispatch(removeBalloon(conversation?._id));
                        }
                },
            },
            {
                id: 4,
                name: `${conversationText.optionRoom.move} ${moves.some((m) => m === conversation?._id || m === conversation?.user.id) ? ' stop' : ''}`,
                icon: <MoveI />,
                device: 'mobile',
                onClick: () => {
                    let checkM = false;
                    if (conversation?._id) {
                        moves.forEach((m) => {
                            if (m === conversation?._id) checkM = true;
                        });
                        if (checkM) {
                            setMoves((pre) => pre.filter((m) => m !== conversation._id));
                        } else {
                            setMoves([...moves, conversation?._id]);
                        }
                    } else if (conversation?.user.id) {
                        moves.forEach((m) => {
                            if (m === conversation.user.id) checkM = true;
                        });
                        if (checkM) {
                            setMoves((pre) => pre.filter((m) => m !== conversation.user.id));
                        } else {
                            setMoves([...moves, conversation.user.id]);
                        }
                    }
                },
            },
        ],
    };

    if (conversation?.deleted?.some((c) => c.id === userId)) {
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
    // if (conversation?.room[0]?.id) {
    //     dataMore.options.push({
    //         id: 5,
    //         name: conversationText.optionRoom.del,
    //         load: loadDel,
    //         icon: loadDel ? (
    //             <DivLoading css="font-size: 12px; margin: 0;">
    //                 <LoadingI />
    //             </DivLoading>
    //         ) : (
    //             <MinusI />
    //         ),
    //         onClick: () => {
    //             if (ye) handleDelete();
    //         },
    //     });
    // }
    const handleOnKeyup = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend(conversation?._id, conversation?.user.id);
        } else {
            e.target.setAttribute('style', 'height: auto');
            if (e.key === 'Backspace') {
                e.target.setAttribute('style', `height: ${value ? e.target.scrollHeight : e.target.scrollHeight - 16}px`);
            } else {
                e.target.setAttribute('style', `height: ${e.target.scrollHeight}px`);
            }
        }
    };
    const handleOnKeyDown = (e: any) => {
        console.log(e.key);
        if (e.key === 'Enter') e.preventDefault();
        if (e.key === 'Alt') {
            e.preventDefault();
            e.target.value += '\n';
        }
    };
    const [optionsForItem, setOptions] = useState<PropsOptionForItem | undefined>(undefined);
    const [changeText, setChangeText] = useState<ReactElement>(
        <Div>
            <Textarea placeholder="Change text" />
        </Div>,
    );
    console.log(writingBy, 'writingBy', writingBy && writingBy.id === conversation?.user.id, writingBy?.id, conversation?.user.id);
    const Dot: number[] = [];
    const eraser = useRef<number>(0);

    if (writingBy) {
        for (let i = 1; i <= writingBy.length; i++) {
            Dot.push(i);
        }
    }
    const era = Dot.length < eraser.current;
    eraser.current = Dot.length;
    const Time = data ? moments().FromNow(data, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss', lg) : '';
    const handleWriteText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log(e.target.value, 'enter');
        socket.emit(`user_${conversation?.user.id}_in_roomChat_personal_writing`, {
            roomId: conversation?._id,
            id_other: dataFirst.id,
            value: e.target.value.length,
        });
        setValue(e.target.value);
    };
    console.log(conversation, 'conversation');

    return (
        <DivConversation
            ref={del}
            className="ofChats"
            id={`ofChatId${index}`}
            css={`
                overflow: hidden;
                ${yRef.current || top || mouse.includes(conversation?._id ?? '') ? 'position: fixed;' : ''}
                top: ${(yRef.current || top || 329) + 'px'};
                left: ${(xRef.current || left || 185 * (index >= 1 ? index + index : index) + 8) + 'px'};
                z-index: 99;
                background-position: center;
                transition: all 0.5s linear;
                background-blend-mode: soft-light;
                ${conversation?.background
                    ? `background-image: url(${process.env.REACT_APP_SERVER_FILE_GET_IMG_V1}/${conversation?.background.id}); background-repeat: no-repeat;background-size: cover;`
                    : ''}

                @media (min-width: 500px) {
                    margin-right: 5px;
                }
            `}
            onMouseMove={(e) => handleTouchMoveRoomChat(e)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={() => {
                if (emoji) setEmoji(false);
            }}
        >
            <DivResultsConversation color="#e4e4e4">
                {loading && (
                    <DivLoading css="position: absolute; top: 50px; left: 50%; right: 50%; translate: -50%; z-index: 999;">
                        <LoadingI />
                    </DivLoading>
                )}
                {conversation && optionsForItem && (
                    <OptionForItem
                        id_you={dataFirst.id}
                        itemPin={itemPin}
                        setItemPin={setItemPin}
                        setOptions={setOptions}
                        ERef={ERef}
                        colorText={colorText}
                        del={del}
                        optionsForItem={optionsForItem}
                        conversation={conversation}
                        setConversation={setConversation}
                        setEmoji={setEmoji}
                        roomImage={roomImage}
                        setRoomImage={setRoomImage}
                        itemPinData={itemPinData}
                    />
                )}
                <Div
                    width="100%"
                    css={`
                        align-items: center;
                        padding: 8px 9px;
                        font-size: 25px;
                        position: absolute;
                        top: 10px;
                        left: 0;
                        background-color: transparent;
                        z-index: 960;
                        @media (min-width: 768px) {
                            padding: 0 8px 9px;
                        }
                    `}
                >
                    <Div
                        width="44px" // delete chat box
                        css="height: 30px; margin-right: 10px; align-items: center; justify-content: center;  cursor: var(--pointer);font-size: 30px; @media(min-width: 500px){ width: 30px; font-size: 25px;}"
                        onClick={() => {
                            if (del.current) {
                                dispatch(offChats(chat.filter((c) => c.id_other !== conversation?.user.id && c.conversationId !== conversation?._id)));
                            }
                        }}
                    >
                        <UndoI />
                    </Div>
                    <Div width="85%" css="align-items: center; position: relative">
                        {conversation && conversation.user.gender >= 0 ? (
                            <Avatar
                                src={conversation?.user.avatar}
                                alt={conversation?.user.fullName}
                                className="hello"
                                gender={conversation?.user.gender}
                                radius="50%"
                                css="min-width: 40px; width: 40px; height: 40px; margin-right: 5px;@media(min-width: 768px){min-width: 30px; width: 30px; height: 30px;}"
                            />
                        ) : (
                            ''
                        )}
                        {userOnline.includes(conversation?.user.id ?? '') && (
                            <Div
                                css={`
                                    font-size: 11px;
                                    position: absolute;
                                    bottom: 0;
                                    left: 21px;
                                    color: #3b993b;
                                `}
                            >
                                <TyOnlineI />
                            </Div>
                        )}
                        <Div width="98%" wrap="wrap">
                            <Hname>{conversation?.user.fullName}</Hname>
                            {Time && (
                                <Div>
                                    <Div css="color: #db4141; font-size: 8px; align-items: center; margin-right: 2px;">
                                        <TyOnlineI />
                                    </Div>
                                    <P z="1rem">{Time}</P>
                                </Div>
                            )}
                        </Div>
                        <Div onClick={() => setOpMore(!opMore)} onMouseMove={(e) => e.stopPropagation()}>
                            <DotI />
                        </Div>
                    </Div>
                </Div>
                {/* {conversation && conversation?.pins?.length ? (
                    <PinChat
                        one={one}
                        itemPin={itemPin}
                        setItemPin={setItemPin}
                        conversationId={conversation._id}
                        user={conversation.user}
                        dataFirst={dataFirst}
                        pins={conversation.pins}
                        setChoicePin={setChoicePin}
                        avatar={conversation.user.avatar}
                        room={conversation.room}
                        name={conversation.user.fullName}
                        setConversation={setConversation}
                        itemPinData={itemPinData}
                    />
                ) : (
                    ''
                )} */}
                <Div
                    ref={ERef}
                    width="100%"
                    css={`
                        flex-direction: column-reverse;
                        overflow-y: overlay;
                        scroll-behavior: smooth;
                        overflow-x: hidden;
                        padding: 0 11px 5px;
                        bottom: 54px;
                        left: 0;
                        transition: all 0.5s linear;
                        position: absolute;
                        @media (max-width: 768px) {
                            &::-webkit-scrollbar {
                                width: 0px;
                                transform: translateX(calc(100% - 100vw));
                            }
                        }
                        height: 81%;
                    `}
                    onScroll={() => handleScroll}
                    onTouchEnd={() => {
                        if (!scrollCheck.current) scrollCheck.current = true;
                    }}
                >
                    {conversation?.rooms.map((aa, index) => {
                        // const timePin = moment(conversation.pins.filter((p) => p.chatId === rc._id)[0].createdAt).diff();
                        return aa.filter.map((p) =>
                            p.data.map((rc, index, arr) => {
                                let timeS = '';
                                const mn = moment(arr[index].createdAt); //show time for every day
                                if (mn.diff(date1.current, 'days') < 1 && date1.current?.format('YYYY-MM-DD') !== mn.format('YYYY-MM-DD')) {
                                    timeS = '------ ' + mn.locale(lg).format('LL') + ' ------';
                                    date1.current = mn;
                                } else {
                                    timeS = '';
                                }

                                if (moment(new Date()).format('YYYY-MM-DD') === moment(date1.current).format('YYYY-MM-DD')) timeS = '';
                                console.log(timeS, 'Times', mn);
                                if (rc?.length && rc?.length > 0) {
                                    if (writingBy && writingBy.length > 0)
                                        return (
                                            <Div
                                                key={rc._id}
                                                display="block"
                                                className="noTouch"
                                                css={`
                                                    position: relative;
                                                    justify-content: left;
                                                    align-items: center;
                                                    margin-bottom: 20px;
                                                `}
                                            >
                                                <Div css="width: 70%;justify-content: left; z-index: 11; transition: 1s linear; position: relative;">
                                                    <P
                                                        z="1rem"
                                                        css={`
                                                            position: absolute;
                                                            bottom: -15px;
                                                            left: 25px;
                                                        `}
                                                    >
                                                        {conversation?.user.fullName} {conversationText.phrase.input.write}...
                                                    </P>
                                                    <Avatar
                                                        src={conversation?.user.avatar}
                                                        alt={conversation?.user.fullName}
                                                        gender={conversation?.user.gender}
                                                        radius="50%"
                                                        css="min-width: 17px; width: 17px; height: 17px; margin-right: 4px; margin-top: 3px;"
                                                    />{' '}
                                                    <Div
                                                        wrap="wrap"
                                                        css=" padding: 2px 12px 4px; border-radius: 7px; border-top-right-radius: 13px; border-bottom-right-radius: 13px; background-color: #353636; border: 1px solid #4e4d4b;"
                                                    >
                                                        {Dot.map((f, index) => (
                                                            <Div key={f} css=" position: relative;">
                                                                <Div
                                                                    width="12px"
                                                                    css={`
                                                                        animation: writingChat 0.5s linear;
                                                                        @keyframes writingChat {
                                                                            0% {
                                                                                width: 0px;
                                                                            }
                                                                            50% {
                                                                                width: 6px;
                                                                            }
                                                                            100% {
                                                                                width: 12px;
                                                                            }
                                                                        }
                                                                    `}
                                                                >
                                                                    <MinusI />
                                                                </Div>
                                                                {index + 1 === Dot.length && (
                                                                    <Div
                                                                        css={`
                                                                            position: absolute;
                                                                            right: -14px;
                                                                            top: -9px;
                                                                            animation: writingChatPen 0.5s linear;
                                                                            @keyframes writingChatPen {
                                                                                100% {
                                                                                    right: -14px;
                                                                                }
                                                                            }
                                                                        `}
                                                                    >
                                                                        {era ? <EraserI /> : <PenI />}
                                                                    </Div>
                                                                )}
                                                            </Div>
                                                        ))}
                                                    </Div>
                                                </Div>
                                            </Div>
                                        );
                                    return null;
                                }

                                return (
                                    <ItemsRoom
                                        background={conversation.background}
                                        choicePin={choicePin}
                                        setChoicePin={setChoicePin}
                                        targetChild={targetChild}
                                        phraseText={conversationText.phrase}
                                        roomId={conversation._id}
                                        key={rc.text.t + index}
                                        options={optionsForItem}
                                        setOptions={setOptions}
                                        timeS={timeS}
                                        rc={rc}
                                        index={index}
                                        archetype={arr}
                                        handleWatchMore={handleWatchMore}
                                        ERef={ERef}
                                        del={del}
                                        handleTime={handleTime}
                                        user={conversation.user}
                                        dataFirst={dataFirst}
                                        wch={wch}
                                        setWch={setWch}
                                        rr={rr}
                                        pins={conversation.pins}
                                        roomImage={roomImage}
                                        setRoomImage={setRoomImage}
                                        scrollCheck={scrollCheck}
                                        loadingChat={loadingChat}
                                    />
                                );
                            }),
                        );
                    })}

                    <Div width="100%" wrap="wrap" css="align-items: center; justify-content: center; margin-top: 80px; margin-bottom: 40px;">
                        <Div
                            css="align-items: center; justify-content: center; padding: 3px 8px; background-color: #333333; border-radius: 8px; border: 1px solid #52504d; cursor: var(--pointer)"
                            onClick={handleProfile}
                        >
                            <ProfileCircelI /> <Hname css="margin: 0 5px; width: fit-content;">{conversationText.optionRoom.personal}</Hname>
                        </Div>
                    </Div>
                </Div>
                <Div
                    width="100%"
                    wrap="wrap"
                    css={`
                        border-radius: 5px;
                        height: auto;
                        align-items: center;
                        justify-content: center;
                        background-color: transparent;
                        position: absolute;
                        left: 0px;
                        bottom: 9px;
                        z-index: 9999;
                        padding: 9px 9px 0;
                        div#emojiCon {
                            width: 100%;
                        }
                    `}
                >
                    {emoji && (
                        <div id="emojiCon" onClick={(e) => e.stopPropagation()}>
                            <Picker locale="en" set="facebook" emojiVersion={14} data={dataEmoji} theme={colorBg === 1 ? 'dark' : 'light'} onEmojiSelect={handleEmojiSelect} />
                        </div>
                    )}
                    <Div width="100%" wrap="wrap" css="position: relative; height: auto;">
                        {uploadIn && uploadIn?.pre.length > 0 && (
                            <Div
                                width="100%"
                                wrap="wrap"
                                css={`
                                    margin-left: 21%;
                                    position: absolute;
                                    bottom: 44px;
                                    right: 0;
                                    border-radius: 5px;
                                    background-color: transparent;
                                    box-shadow: 0 0 5px #7d7c7c;
                                    background-color: #292929c4;
                                    padding: 5px;
                                `}
                            >
                                {uploadIn?.pre.map((item, index) => (
                                    <Div
                                        key={item.link}
                                        css={`
                                            min-width: 79px;
                                            border-radius: 5px;
                                            border: 1px solid #4e4e4e;
                                            ${uploadIn.pre.length === 1 ? 'width: 150px;' : 'width: 79px; flex-grow: 1;'}
                                        `}
                                        onTouchMove={handleTouchMove}
                                        onTouchStart={handleTouchStart}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        {item.type === 'image' ? <Img src={item.link} radius="5px" /> : <Player key={item.link} src={item.link} />}
                                    </Div>
                                ))}
                            </Div>
                        )}
                        <Div // inserting bar of chat
                            width="100%"
                            css={`
                                height: auto;
                                align-items: center;
                                justify-content: space-around;
                            `}
                        >
                            <Div
                                css={`
                                    cursor: var(--pointer);
                                    font-size: 22px;
                                `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEmoji(!emoji);
                                }}
                            >
                                🙂
                            </Div>

                            <Div
                                width="34px !important"
                                css={`
                                    color: #869ae7;
                                    align-items: center;
                                    justify-content: center;
                                    padding: 5px;
                                    cursor: var(--pointer);
                                `}
                            >
                                <form method="post" encType="multipart/form-data" id="formss">
                                    <input id={conversation?._id + 'uploadCon'} type="file" name="file[]" onChange={handleImageUpload} multiple hidden />
                                    <Label htmlFor={conversation?._id + 'uploadCon'} css="font-size: 22px;" color={colorText}>
                                        <CameraI />
                                    </Label>
                                </form>
                            </Div>

                            <Textarea
                                ref={textarea}
                                color={colorText}
                                placeholder="Send"
                                value={value}
                                bg="rgb(255 255 255 / 6%)"
                                css={`
                                    width: 65%;
                                    height: 33px;
                                    margin: 0;
                                    padding: 5px 10px;
                                    border-radius: 10px;
                                    font-size: 1.4rem !important;
                                    overflow-y: overlay;
                                    &:disabled {
                                        background-color: #f2f2f2; /* Set a background color */
                                        cursor: not-allowed; /* Change cursor to "not-allowed" */
                                        color: #888; /* Change text color to a subdued gray */
                                    }
                                `}
                                onKeyDown={(e) => handleOnKeyDown(e)}
                                onKeyUp={(e) => handleOnKeyup(e)}
                                onChange={handleWriteText}
                            />
                            <Div
                                width="34px"
                                css="font-size: 25px; color: #23c3ec; height: 100%; align-items: center; justify-content: center; cursor: var(--pointer);"
                                onClick={(e) => handleSend(conversation?._id, conversation?.user.id)}
                            >
                                <SendOPTI />
                            </Div>
                        </Div>
                    </Div>
                </Div>
                {opMore && conversation && <MoreOption dataMore={dataMore} colorText={colorText} setOpMore={setOpMore} background={conversation.background} />}
            </DivResultsConversation>
        </DivConversation>
    );
};
export default Conversation;
