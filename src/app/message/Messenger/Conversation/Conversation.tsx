import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
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
    TyOnlineI,
    PenI,
    EraserI,
} from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { DivLoading, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import dataEmoji from '@emoji-mart/data/sets/14/facebook.json';
import Picker from '@emoji-mart/react';
import { ReactElement, useEffect, useRef, useState } from 'react';
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
import sendChatAPi from '~/restAPI/chatAPI';
import ServerBusy from '~/utils/ServerBusy';
import { useSelector } from 'react-redux';
import OptionForItem from './OptionForItem';
import moments from '~/utils/moment';
import { socket } from 'src/mainPage/nextWeb';

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
    userOnline: string[];
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
    userOnline,
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
        data,
        emptyRef,
        wch,
        setWch,
        rr,
        writingBy,
        setWritingBy,
    } = LogicConversation(id_chat, dataFirst.id, userOnline);
    const [moves, setMoves] = useState<string[]>([]);
    const [mouse, setMouse] = useState<boolean>(false);

    const xRef = useRef<number | null>(null);
    const yRef = useRef<number | null>(null);
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if ((conversation?._id || conversation?.user.id) && moves.includes(conversation?.user.id))
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
        if (conversation && moves.includes(conversation?.user.id)) {
            if (yRef.current && xRef.current)
                dispatch(setTopLeft({ ...id_chat, top: yRef.current, left: xRef.current }));
            setMouse(false);
        }
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
        if (!emptyRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = ERef.current;
            const scrollBottom = -scrollTop + clientHeight;
            console.log(scrollBottom, scrollTop, clientHeight, scrollHeight, check.current, loading);
            if (scrollBottom >= scrollHeight - 250 && !loading) {
                check.current = -scrollTop;
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
    if (conversation?.room[0]?.id) {
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
            e.preventDefault();
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
    const handleOnKeyDown = (e: any) => {
        console.log(e.key);
        if (e.key === 'Enter') e.preventDefault();
        if (e.key === '+') {
            e.preventDefault();
            e.target.value += '\n';
        }
    };
    const [optionsForItem, setOptions] = useState<
        | {
              _id: string;
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
    const [changeText, setChangeText] = useState<ReactElement>(
        <Div>
            <Textarea placeholder="Change text" />
        </Div>,
    );
    console.log(
        writingBy,
        'writingBy',
        writingBy && writingBy.id === conversation?.user.id,
        writingBy?.id,
        conversation?.user.id,
    );
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
            onClick={() => setEmoji(false)}
        >
            <DivResultsConversation color="#e4e4e4">
                {optionsForItem && (
                    <OptionForItem
                        setOptions={setOptions}
                        ERef={ERef}
                        colorText={colorText}
                        del={del}
                        optionsForItem={optionsForItem}
                        conversation={conversation}
                        setEmoji={setEmoji}
                    />
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
                        z-index: 999;
                    `}
                >
                    <Div
                        width="30px" // delete chat box
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
                                // del.current.remove();
                            }
                        }}
                    >
                        <UndoI />
                    </Div>
                    <Div width="85%" css="align-items: center; position: relative">
                        <Avatar
                            src={conversation?.user.avatar}
                            alt={conversation?.user.fullName}
                            gender={conversation?.user.gender}
                            radius="50%"
                            css="min-width: 30px; width: 30px; height: 30px; margin-right: 5px;"
                        />
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

                <Div
                    ref={ERef}
                    width="100%"
                    css={`
                        margin-top: 22px;
                        flex-direction: column-reverse;
                        padding-bottom: 10px;
                        overflow-y: overlay;
                        scroll-behavior: smooth;
                        height: 91%;
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
                            height: 91%;
                        }
                    `}
                    onScroll={() => handleScroll}
                    // onClick={() => setEmoji(false)}
                >
                    {conversation?.room.map((rc, index, arr) => {
                        let timeS = '';
                        const mn = moment(arr[index].createdAt); //show time for every day
                        if (
                            mn.diff(date1.current, 'days') < 1 &&
                            date1.current?.format('YYYY-MM-DD') !== mn.format('YYYY-MM-DD')
                        ) {
                            timeS = '------ ' + mn.locale(lg).format('LL') + ' ------';
                            date1.current = mn;
                        } else {
                            timeS = '';
                        }

                        if (moment(new Date()).format('YYYY-MM-DD') === moment(date1.current).format('YYYY-MM-DD'))
                            timeS = '';

                        if (rc?.length && rc?.length > 0) {
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
                                            Han is writing...
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
                        }
                        return (
                            <ItemsRoom
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
                        z-index: 20;
                        padding-top: 9px;
                        div#emojiCon {
                            width: 100%;
                        }
                    `}
                >
                    {emoji && (
                        <div id="emojiCon" onClick={(e) => e.stopPropagation()}>
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
                                        {item.type.search('image/') >= 0 ? (
                                            <Img src={item.link} radius="5px" />
                                        ) : (
                                            <Player key={item.link} src={item.link} />
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
                                onKeyDown={(e) => handleOnKeyDown(e)}
                                onKeyUp={(e) => handleOnKeyup(e)}
                                onChange={(e) => {
                                    console.log(e.target.value, 'enter');
                                    socket.emit(`user_${conversation?.user.id}_in_roomChat_personal_writing`, {
                                        roomId: conversation?._id,
                                        id_other: dataFirst.id,
                                        value: e.target.value.length,
                                    });
                                    setValue(e.target.value);
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
