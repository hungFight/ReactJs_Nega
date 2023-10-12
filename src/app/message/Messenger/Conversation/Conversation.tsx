import { Div, DivFlex, Img, Input, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivConversation, DivResultsConversation } from '../styleSed';
import {
    DotI,
    CameraI,
    ProfileCircelI,
    SendOPTI,
    UndoI,
    LoadingI,
    MinusI,
    ClockCirclesI,
    BalloonI,
    MoveI,
    PlusI,
    RedeemI,
    PinI,
    DelAllI,
    DelSelfI,
    ReportI,
    ChangeChatI,
    RemoveCircleI,
} from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { DivLoading, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import dataEmoji from '@emoji-mart/data/sets/14/facebook.json';
import Picker from '@emoji-mart/react';
import { memo, useEffect, useRef, useState } from 'react';
import { Label, Textarea } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';
import LogicConversation, { PropsChat } from './LogicConver';
import { Player } from 'video-react';
import { PropsUser } from 'src/App';
import moment from 'moment';
import 'moment/locale/vi';
import { setOpenProfile } from '~/redux/hideShow';
import ItemsRoom from './ItemsConvers';
import { PropsBgRD, offChats, setBalloon, setTopLeft } from '~/redux/background';
import MoreOption from '../MoreOption';
import { setDelIds } from '~/redux/reload';
import sendChatAPi, { PropsRoomChat } from '~/restAPI/chatAPI';
import ServerBusy from '~/utils/ServerBusy';
import Bar from '~/reUsingComponents/Bar/Bar';
import { useSelector } from 'react-redux';
import FileConversation from '../File';

const Conversation: React.FC<{
    index: number;
    colorText: string;
    colorBg: number;
    id_chat: { id_room: string | undefined; id_other: string };
    dataFirst: PropsUser;
    currentPage: number;
    chat: {
        id_room: string | undefined;
        id_other: string;
    }[];
    id_chats: {
        id_room: string | undefined;
        id_other: string;
    }[];
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
                id_room: string | undefined;
                id_other: string;
                top?: number | undefined;
                left?: number | undefined;
            }[]
        >
    >;
}> = ({
    index,
    colorText,
    colorBg,
    dataFirst,
    id_chat,
    currentPage,
    chat,
    id_chats,
    css,
    top,
    left,
    permanent,
    setId_chats,
}) => {
    const {
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
    } = LogicConversation(id_chat, dataFirst.id);
    const chats = useSelector((state: PropsBgRD) => state.persistedReducer.background.chats);
    const [moves, setMoves] = useState<string[]>([]);
    const [mouse, setMouse] = useState<boolean>(false);

    const xRef = useRef<number | null>(null);
    const yRef = useRef<number | null>(null);
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (conversation?._id || conversation?.user.id)
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
                // if (del.current) del.current.style.zIndex = '999';
                setMouse(true);
            }
    };
    const handleMouseUp = () => {
        // if (del.current) del.current.style.zIndex = '99';
        if (yRef.current && xRef.current) dispatch(setTopLeft({ ...id_chat, top: yRef.current, left: xRef.current }));
        setMouse(false);
    };
    const handleTouchMoveRoomChat = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (mouse && del.current) {
            const x = e.clientX;
            const y = e.clientY;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (del.current) {
                if (viewportWidth - 10 >= x && x >= 19) {
                    console.log('move');
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
        ERef.current.scrollTop = -check.current;
    }, [conversation]);
    useEffect(() => {
        if (delIds && del.current) {
            if (delIds._id === conversation?._id) {
                dispatch(
                    offChats(chat.filter((c) => c.id_other !== id_chat.id_other && c.id_room !== id_chat.id_room)),
                );
                del.current.remove();
            }
        }
        ERef.current.addEventListener('scroll', handleScroll);
        return () => {
            ERef.current?.removeEventListener('scroll', handleScroll);
        };
        // Optional: Call the observer's callback function immediately to get the initial scroll height
    }, [delIds]);

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
        if (e) {
            if (e?.getAttribute('class').includes('chatTime')) {
                e.classList.remove('chatTime');
            } else {
                e.classList.add('chatTime');
            }
        }
    };

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = ERef.current;
        const scrollBottom = -scrollTop + clientHeight;
        console.log(scrollBottom, scrollTop, clientHeight, scrollHeight, check.current, loading);
        if (scrollBottom >= scrollHeight - 250 && !loading) {
            check.current = -scrollTop;
            if (cRef.current !== 2) {
                fetchChat(true);
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
        if (conversation?._id) {
            const res = await sendChatAPi.delete(conversation._id);
            const data:
                | {
                      _id: string;
                      deleted: {
                          id: string;
                          createdAt: string;
                          _id: string;
                      }[];
                  }
                | undefined = ServerBusy(res, dispatch);

            if (data) {
                dispatch(setDelIds(data));
            }
        }

        setLoadDel(false);
    };
    const handleUndo = async () => {
        console.log('Undo');
        setLoadDel(true);
        if (conversation?._id) {
            const res = await sendChatAPi.undo(conversation._id);
            const data: PropsChat | undefined = ServerBusy(res, dispatch);
            if (data) {
                cRef.current = 0;
                dispatch(setDelIds(undefined));
                setConversation({ ...data, user: conversation.user });
            }
        }
        setLoadDel(false);
    };
    console.log(conversation, 'conversation');
    const dataMore: {
        options: {
            id: number;
            load?: boolean;
            name: string;
            icon: JSX.Element;
            onClick: () => any;
        }[];
        id_room: string | undefined;
        id: string | undefined;
        avatar: string | undefined;
        fullName: string | undefined;
        gender: number | undefined;
    } = {
        id_room: conversation?._id,
        id: conversation?.user.id,
        avatar: conversation?.user.avatar,
        fullName: conversation?.user.fullName,
        gender: conversation?.user.gender,
        options: [
            {
                id: 1,
                name: 'View Profile',
                icon: <ProfileCircelI />,
                onClick: () => {
                    if (
                        conversation?.user.id &&
                        !moves.some((m) => m === conversation?._id || m === conversation?.user.id)
                    )
                        dispatch(setOpenProfile({ newProfile: [conversation?.user.id] }));
                },
            },
            {
                id: 2,
                name: 'Balloon',
                icon: <BalloonI />,
                onClick: () => {
                    if (id_chat && !moves.some((m) => m === conversation?._id || m === conversation?.user.id))
                        dispatch(setBalloon({ id_other: id_chat.id_other, id_room: id_chat.id_room }));
                },
            },
            {
                id: 5,
                name: `Move ${
                    moves.some((m) => m === conversation?._id || m === conversation?.user.id) ? ' stop' : ''
                }`,
                icon: <MoveI />,
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
    console.log(moves, 'moves');

    if (conversation?.deleted?.some((c) => c.id === userId)) {
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
    if (conversation?.room[0]._id) {
        dataMore.options.push({
            id: 4,
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
    }
    const handleOnKeyup = (e: any) => {
        if (e.key === 'Enter') {
            handleSend(conversation?._id, conversation?.user.id);
        } else {
            e.target.setAttribute('style', 'height: auto');
            if (e.key === 'Backspace') {
                e.target.setAttribute(
                    'style',
                    `height: ${value ? e.target.scrollHeight : e.target.scrollHeight - 16}px`,
                );
            } else {
                e.target.setAttribute('style', `height: ${e.target.scrollHeight}px`);
            }
        }
    };
    const [optionsForItem, setOptions] = useState<
        | {
              id: string;
              text: string;
              imageOrVideos:
                  | {
                        v: string;
                        type?: string | undefined;
                        icon: string;
                        _id: string;
                    }[];
          }
        | undefined
    >(undefined);
    console.log(optionsForItem, 'options');
    const optionsForItemData: {
        [en: string]: {
            id: number;
            icon: JSX.Element;
            color: string;
            title: string;
            top: string;
            onClick: () => void;
        }[];
        vi: {
            id: number;
            icon: JSX.Element;
            color: string;
            title: string;
            top: string;
            onClick: () => void;
        }[];
    } = {
        en: [
            {
                id: 1,
                icon: <DelAllI />,
                color: '#67b5f8',
                title: 'Remove both side can not see this text',
                top: '-80px',
                onClick: async () => {
                    if (conversation && optionsForItem) {
                        // id room and user
                        const res = await sendChatAPi.delChatAll(conversation._id, optionsForItem.id);
                    }
                },
            },
            {
                id: 2,
                icon: <DelSelfI />,
                color: '#67b5f8',
                title: 'Remove only you can not see this text',
                top: '-80px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 3,
                icon: <ChangeChatI />,
                color: '',
                title: 'Change this text and others still can see your changing',
                top: '-100px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 4,
                icon: <PinI />,
                color: '#d0afaf',
                title: 'Pin',
                top: '-40px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 5,
                icon: <RedeemI />,
                color: '#73b3eb',
                title: 'Redeem',
                top: '-40px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
        ],
        vi: [
            {
                id: 1,
                icon: <DelAllI />,
                color: '#67b5f8',
                title: 'Khi xoá cả 2 bên sẽ đều không nhìn thấy tin nhắn này',
                top: '-100px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 2,
                icon: <DelSelfI />,
                color: '#67b5f8',
                title: 'Khi xoá thi chỉ mình bạn không nhìn thấy tin nhắn này',
                top: '-100px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 3,
                icon: <ChangeChatI />,
                color: '',
                title: 'Khi thay đổi tin nhắn người khác sẽ biết ban đã thay đổi',
                top: '-98px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 4,
                icon: <PinI />,
                color: '#d0afaf',
                title: 'Gim',
                top: '-40px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 5,
                icon: <RedeemI />,
                color: '#73b3eb',
                title: 'Thu hồi',
                top: '-40px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
        ],
    };
    return (
        <DivConversation
            ref={del}
            height="530px"
            className="ofChats"
            id={`ofChatId${index}`}
            css={`
                margin-right: 5px;
                ${yRef.current || top || mouse ? 'position: fixed;' : ''}
                top: ${(yRef.current || top || 329) + 'px'};
                left: ${(xRef.current || left || 185 * (index >= 1 ? index + index : index) + 8) + 'px'};
                z-index: 99;
            `}
            onMouseMove={(e) => handleTouchMoveRoomChat(e)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <DivResultsConversation color="#e4e4e4">
                {optionsForItem && (
                    <Div
                        width="100%"
                        wrap="wrap"
                        css={`
                            position: absolute;
                            left: 0;
                            height: 91%;
                            background-color: #191919e6;
                            z-index: 999;
                            bottom: 0;
                            justify-content: center;
                            padding: 10px;
                            overflow: hidden;
                        `}
                        onClick={() => setOptions(undefined)}
                    >
                        <Div
                            width="2px"
                            css={`
                                position: absolute;
                                top: 1px;
                                left: 54px;
                                font-size: 30px;
                                cursor: var(--pointer);
                                height: 30px;
                                z-index: 1;
                                background-color: #898787;
                            `}
                        ></Div>
                        <Div
                            css={`
                                position: absolute;
                                top: 30px;
                                left: 40px;
                                font-size: 30px;
                                z-index: 1;
                                cursor: var(--pointer);
                            `}
                            onClick={() => setOptions(undefined)}
                        >
                            <RemoveCircleI />
                        </Div>
                        <Div
                            wrap="wrap"
                            display="block"
                            width="100%"
                            css={`
                                height: 50%;
                                position: relative;
                                animation: chatMove 0.5s linear;
                                @keyframes chatMove {
                                    0% {
                                        right: -180px;
                                    }
                                    100% {
                                        right: 0px;
                                    }
                                }
                            `}
                        >
                            {optionsForItem.text && (
                                <Div
                                    css="justify-content: end; width: 100%; align-items: baseline; "
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <P
                                        z="1.4rem"
                                        css="width: fit-content; margin: 0; padding: 2px 12px 4px; border-radius: 7px; border-top-left-radius: 13px; border-bottom-left-radius: 13px; background-color: #353636; border: 1px solid #4e4d4b;"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        {optionsForItem.text}
                                    </P>
                                </Div>
                            )}
                            {optionsForItem.imageOrVideos.length > 0 && (
                                <Div
                                    width="100%"
                                    css={`
                                        height: ${optionsForItem.text ? '90%' : '100%'};
                                        width: 100%;
                                        align-items: center;
                                        padding: 10px;
                                    `}
                                >
                                    <Div
                                        width="100%"
                                        wrap="wrap"
                                        css={`
                                            height: 97%;
                                            overflow-y: overlay;
                                            border-radius: 5px;
                                            position: relative;
                                            padding: 1px;
                                            justify-content: right;
                                            .roomOfChat {
                                                position: fixed;
                                                width: 100%;
                                                height: 100%;
                                                top: 0;
                                                left: 0;
                                                background-color: #171718;
                                                z-index: 9999;
                                                img {
                                                    object-fit: contain;
                                                }
                                            }
                                            div {
                                                flex-grow: 0 !important;
                                                height: 50%;
                                                border: 2px solid #686767;
                                            }
                                        `}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {optionsForItem.imageOrVideos.map((fl, index) => (
                                            <FileConversation
                                                key={fl._id}
                                                type={fl?.type}
                                                v={fl.v}
                                                icon={fl.icon}
                                                ERef={ERef}
                                                del={del}
                                            />
                                        ))}
                                    </Div>
                                </Div>
                            )}
                        </Div>
                        <Div
                            width="100%"
                            css={`
                                margin: 5px 0;
                                justify-content: right;
                                padding: 0 5px;
                                animation: chatMove 0.5s linear;
                                @keyframes chatMove {
                                    0% {
                                        right: -348px;
                                    }
                                    100% {
                                        right: 0px;
                                    }
                                }
                            `}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Div
                                css={`
                                    font-size: 1.4rem;
                                    padding: 2px 8px;
                                    background-color: #4b4b4b;
                                    border-radius: 5px;
                                    cursor: var(--pointer);
                                `}
                            >
                                Reply
                            </Div>
                        </Div>
                        <Div
                            width="100%"
                            css={`
                                height: 40%;
                                background-color: #060606c9;
                                border-radius: 5px;
                                padding: 8px;
                                position: relative;
                                animation: chatMove 0.5s linear;
                                @keyframes chatMove {
                                    0% {
                                        right: -348px;
                                    }
                                    100% {
                                        right: 0px;
                                    }
                                }
                                .MoveOpChat {
                                    p {
                                        display: block;
                                    }
                                    font-size: 43px;
                                    top: -8px;
                                }
                            `}
                            onTouchStart={(e: any) => {
                                e.target.classList.add('MoveOpChat');
                            }}
                            onTouchEnd={(e: any) => {
                                const el = document.querySelectorAll('.MoveOpChat');
                                Array.from(el).map((r) => {
                                    if (r.getAttribute('class')?.includes('MoveOpChat')) {
                                        r.classList.remove('MoveOpChat');
                                    }
                                });
                            }}
                            onTouchMove={(e) => {
                                const touches = e.touches;
                                console.log(touches);

                                // Kiểm tra tọa độ của ngón tay đầu tiên trong danh sách
                                if (touches.length > 0) {
                                    const firstTouch = touches[0];
                                    const x = firstTouch.clientX;
                                    const y = firstTouch.clientY;
                                    console.log(x, y);

                                    // Kiểm tra xem tọa độ (x, y) thuộc về phần tử nào
                                    const element = document.elementFromPoint(x, y);
                                    const el = document.querySelectorAll('.MoveOpChat');
                                    Array.from(el).map((r) => {
                                        if (r.getAttribute('class')?.includes('MoveOpChat') && r !== element) {
                                            r.classList.remove('MoveOpChat');
                                        }
                                    });
                                    if (element) {
                                        element.classList.add('MoveOpChat');
                                        console.log('Đang di chuyển qua phần tử:', element);
                                    }
                                    // Bây giờ, "element" chứa thông tin về phần tử mà ngón tay đang di chuyển qua
                                }
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {optionsForItemData[lg].map((o) => (
                                <Div
                                    key={o.id}
                                    css={`
                                        position: relative;
                                        margin: 4px;
                                        height: fit-content;
                                        font-size: 25px;
                                        padding: 2px;
                                        color: ${o.color};
                                        svg {
                                            pointer-events: none;
                                        }
                                        cursor: var(--pointer);
                                        @media (min-width: 767px) {
                                            &:hover {
                                                p {
                                                    display: block;
                                                }
                                            }
                                        }
                                    `}
                                    onClick={o.onClick}
                                >
                                    {o.icon}
                                    <P
                                        z="1.3rem"
                                        css={`
                                            display: none;
                                            position: absolute;
                                            width: 100px;
                                            padding: 3px;
                                            background-color: #434444;
                                            border-radius: 5px;
                                            text-align: center;
                                            left: 50%;
                                            right: 50%;
                                            translate: -50%;
                                            top: ${o.top};
                                        `}
                                    >
                                        {o.title}
                                    </P>
                                </Div>
                            ))}
                        </Div>
                    </Div>
                )}
                <Div
                    width="100%"
                    css={`
                        align-items: center;
                        padding: 5px 10px;
                        font-size: 25px;
                        position: absolute;
                        top: 10px;
                        left: 0;
                        background-color: #202124;
                        z-index: 3;
                    `}
                >
                    <Div
                        width="30px"
                        css="height: 30px; margin-right: 10px; align-items: center; justify-content: center; cursor: var(--pointer)"
                        onClick={() => {
                            if (del.current) {
                                dispatch(
                                    offChats(
                                        chat.filter(
                                            (c) =>
                                                c.id_other !== conversation?.user.id && c.id_room !== conversation?._id,
                                        ),
                                    ),
                                );

                                del.current.remove();
                            }
                        }}
                    >
                        <UndoI />
                    </Div>
                    <Div width="85%" css="align-items: center;">
                        <Avatar
                            src={conversation?.user.avatar}
                            alt={conversation?.user.fullName}
                            gender={conversation?.user.gender}
                            radius="50%"
                            css="min-width: 30px; width: 30px; height: 30px; margin-right: 5px;"
                        />
                        <Hname>{conversation?.user.fullName}</Hname>
                        <Div onClick={() => setOpMore(!opMore)} onMouseMove={(e) => e.stopPropagation()}>
                            <DotI />
                        </Div>
                    </Div>
                </Div>

                <Div
                    ref={ERef}
                    width="100%"
                    css={`
                        margin-top: 22px;
                        flex-direction: column-reverse;
                        padding-bottom: 10px;
                        ${emoji ? 'height: 150px;' : `height:${chat.length > 2 ? '90%' : '90%'};`}
                        overflow-y: overlay;
                        scroll-behavior: smooth;
                        padding-right: 5px;
                        transition: all 0.5s linear;
                        @media (max-width: 768px) {
                            padding-right: 0px;
                            &::-webkit-scrollbar {
                                width: 0px;
                                transform: translateX(calc(100% - 100vw));
                            }
                        }
                        @media (max-width: 1080px) {
                            height: 90%;
                        }
                    `}
                    onScroll={() => handleScroll}
                    // onClick={() => setEmoji(false)}
                >
                    {conversation?.room.map((rc, index, arr) => {
                        let timeS = '';
                        const mn = moment(arr[index].createdAt);
                        if (
                            mn.diff(date1.current, 'days') < 1 &&
                            date1.current?.format('YYYY-MM-DD') !== mn.format('YYYY-MM-DD')
                        ) {
                            timeS = '------ ' + mn.locale(lg).format('LL') + ' ------';
                            date1.current = mn;
                        } else {
                            timeS = '';
                        }
                        return (
                            <ItemsRoom
                                key={rc.text.t + index}
                                options={optionsForItem}
                                setOptions={setOptions}
                                timeS={timeS}
                                rc={rc}
                                index={index}
                                userId={userId}
                                handleWatchMore={handleWatchMore}
                                ERef={ERef}
                                del={del}
                                handleTime={handleTime}
                                user={conversation.user}
                                dataFirst={dataFirst}
                            />
                        );
                    })}
                    {loading ? (
                        <DivLoading>
                            <LoadingI />
                        </DivLoading>
                    ) : (
                        <Div
                            width="100%"
                            wrap="wrap"
                            css="align-items: center; justify-content: center; margin-top: 80px; margin-bottom: 40px;"
                        >
                            <Div
                                css="align-items: center; justify-content: center; padding: 3px 8px; background-color: #333333; border-radius: 8px; border: 1px solid #52504d; cursor: var(--pointer)"
                                onClick={handleProfile}
                            >
                                <ProfileCircelI /> <Hname css="margin: 0 5px; width: fit-content;">View profile</Hname>
                            </Div>
                        </Div>
                    )}
                </Div>
                <Div
                    width="96%"
                    wrap="wrap"
                    css={`
                        border-radius: 5px;
                        height: auto;
                        align-items: center;
                        justify-content: center;
                        background-color: #202124;
                        position: absolute;
                        left: 8px;
                        bottom: 9px;
                        z-index: 1;
                        padding-top: 9px;
                        div#emojiCon {
                            width: 100%;
                        }
                    `}
                >
                    {emoji && (
                        <div id="emojiCon">
                            <Picker
                                locale="en"
                                set="facebook"
                                emojiVersion={14}
                                data={dataEmoji}
                                theme={colorBg === 1 ? 'dark' : 'light'}
                                onEmojiSelect={handleEmojiSelect}
                            />
                        </div>
                    )}
                    <Div width="100%" wrap="wrap" css="position: relative; height: auto;">
                        {upload.length > 0 && (
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
                                {upload.map((item, index) => (
                                    <Div
                                        key={item.link}
                                        css={`
                                            min-width: 79px;
                                            border-radius: 5px;
                                            border: 1px solid #4e4e4e;
                                            ${upload.length === 1 ? 'width: 150px;' : 'width: 79px; flex-grow: 1;'}
                                        `}
                                        onTouchMove={handleTouchMove}
                                        onTouchStart={handleTouchStart}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        {item.type === 'image' ? (
                                            <Img src={item.link} radius="5px" />
                                        ) : (
                                            item.type === 'video' && <Player key={item.link} src={item.link} />
                                        )}
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
                                `}
                                onClick={() => setEmoji(!emoji)}
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
                                    <input
                                        id={conversation?._id + 'uploadCon'}
                                        type="file"
                                        name="file[]"
                                        onChange={handleImageUpload}
                                        multiple
                                        hidden
                                    />
                                    <Label htmlFor={conversation?._id + 'uploadCon'} color={colorText}>
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
                                    width: 100%;
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
                                onKeyUp={(e) => handleOnKeyup(e)}
                                onChange={(e) => {
                                    console.log(e.target.value, 'enter');
                                    if (!e.target.value) setValue(e.target.value);
                                    if (e.target.value.trim()) setValue(e.target.value);
                                }}
                            />
                            <Div
                                width="34px"
                                css="font-size: 22px; color: #23c3ec; height: 100%; align-items: center; justify-content: center; cursor: var(--pointer);"
                                onClick={(e) => handleSend(conversation?._id, conversation?.user.id)}
                            >
                                <SendOPTI />
                            </Div>
                        </Div>
                    </Div>
                </Div>
                {opMore && <MoreOption dataMore={dataMore} colorText={colorText} setOpMore={setOpMore} />}
            </DivResultsConversation>
        </DivConversation>
    );
};
export default Conversation;
