import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivConversation, DivResultsConversation } from '../styleSed';
import { DotI, CameraI, ProfileCircelI, SendOPTI, UndoI, LoadingI, MinusI, ClockCirclesI, BalloonI, MoveI, TyOnlineI, PenI, EraserI, PinI, BackgroundI, GarbageI } from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { DivLoading, DivPos, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import dataEmoji from '@emoji-mart/data/sets/14/facebook.json';
import Picker from '@emoji-mart/react';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { Label, Textarea } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';
import LogicConversation, { PropsChat } from './LogicConver';
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
import { socket } from 'src/mainPage/NextWeb';
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
import { PropsDataMoreConversation, PropsItemQueryChat, PropsOldSeenBy } from '~/typescript/messengerType';

const Conversation: React.FC<{
    index: number;
    colorText: string;
    colorBg: number;
    id_chat: { conversationId?: string; id_other: string };
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
        loadingChat,
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
    } = LogicConversation(id_chat, dataFirst.id, userOnline, colorText, conversationText, balloon);
    if (data?._id) {
        if (!mm.current.some((m) => m.id === data?._id && index === m.index)) {
            mm.current.push({ id: data._id, index });
        }
    }
    const handleTouchMoveRoomChat = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (data?._id && mouse.includes(data?._id ?? '') && del.current) {
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
    useEffect(() => {
        if (ERef.current) ERef.current.addEventListener('scroll', handleScroll);
        return () => ERef.current?.removeEventListener('scroll', handleScroll);

        // Optional: Call the observer's callback function immediately to get the initial scroll height
    }, []);
    function setSeenBy() {
        if (isIntersecting.current.length && data) {
            queryClient.setQueryData(['getItemChats', `${id_chat.id_other}_${dataFirst.id}`], (pre: PropsItemQueryChat) => {
                if (pre)
                    if (pre?.oldSeenBy?.length) {
                        isIntersecting.current.forEach((r) => {
                            let checkExist = false;
                            pre.oldSeenBy.map((o) => {
                                //query
                                if (o.roomId === r.roomId) {
                                    r.data.map((y) => {
                                        let checkOlF = false;
                                        o.data.map((olF) => {
                                            //query
                                            if (olF.filterId === y.filterId) {
                                                y.data.map((ll) => {
                                                    if (!olF.data.some((ol) => ol.dataId === ll.dataId && ol.userId === ll.userId)) {
                                                        olF.data.push(ll);
                                                    }
                                                });
                                                checkOlF = true;
                                            }
                                        });
                                        if (!checkOlF) o.data.push(y);
                                    });
                                    checkExist = true;
                                }
                                return o;
                            });
                            if (!checkExist) pre.oldSeenBy.push(r);
                        });
                        return pre;
                    } else {
                        return { ...pre, oldSeenBy: isIntersecting.current };
                    }
                return undefined;
            });
            chatAPI.setSeenBy(isIntersecting.current, data._id);
            isIntersecting.current = [];
        }
    }
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

    // if (data?.room[0]?.id) {
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
            handleSend(data?._id, data?.user.id);
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
    const Dot: number[] = [];
    const eraser = useRef<number>(0);
    if (writingBy) {
        for (let i = 1; i <= writingBy.length; i++) {
            Dot.push(i);
        }
    }
    const era = Dot.length < eraser.current;
    eraser.current = Dot.length;
    const Time = ''; //data ? moments().FromNow(data, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss', lg) : '';
    const handleWriteText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log(e.target.value, 'enter');
        socket.emit(`user_${data?.user.id}_in_roomChat_personal_writing`, {
            roomId: data?._id,
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
                ${yRef.current || top || mouse.includes(data?._id ?? '') ? 'position: fixed;' : ''}
                top: ${(yRef.current || top || 329) + 'px'};
                left: ${(xRef.current || left || 185 * (index >= 1 ? index + index : index) + 8) + 'px'};
                z-index: 99;
                background-position: center;
                transition: all 0.5s linear;
                background-blend-mode: soft-light;
                ${data?.background ? `background-image: url(${process.env.REACT_APP_SERVER_FILE_GET_IMG_V1}/${data?.background.id}); background-repeat: no-repeat;background-size: cover;` : ''}

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
                {isFetching && (
                    <DivLoading css="position: absolute; top: 50px; left: 50%; right: 50%; translate: -50%; z-index: 999;">
                        <LoadingI />
                    </DivLoading>
                )}
                {data && optionsForItem && (
                    <OptionForItem
                        id_you={dataFirst.id}
                        itemPin={itemPin}
                        setItemPin={setItemPin}
                        setOptions={setOptions}
                        ERef={ERef}
                        colorText={colorText}
                        del={del}
                        optionsForItem={optionsForItem}
                        conversation={data}
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
                                dispatch(offChats(chat.filter((c) => c.id_other !== data?.user.id && c.conversationId !== data?._id)));
                            }
                        }}
                    >
                        <UndoI />
                    </Div>
                    <Div width="85%" css="align-items: center; position: relative">
                        {data && data.user.gender >= 0 ? (
                            <Avatar
                                src={data?.user.avatar}
                                alt={data?.user.fullName}
                                className="hello"
                                gender={data?.user.gender}
                                radius="50%"
                                css="min-width: 40px; width: 40px; height: 40px; margin-right: 5px;@media(min-width: 768px){min-width: 30px; width: 30px; height: 30px;}"
                            />
                        ) : (
                            ''
                        )}
                        {userOnline.includes(data?.user.id ?? '') && (
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
                            <Hname>{data?.user.fullName}</Hname>
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
                {/* {conversation && data?.pins?.length ? (
                    <PinChat
                        one={one}
                        itemPin={itemPin}
                        setItemPin={setItemPin}
                        conversationId={data._id}
                        user={data.user}
                        dataFirst={dataFirst}
                        pins={data.pins}
                        setChoicePin={setChoicePin}
                        avatar={data.user.avatar}
                        room={data.room}
                        name={data.user.fullName}
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
                    {data?.rooms.map((aa, indexR, aR) => {
                        // const timePin = moment(data.pins.filter((p) => p.chatId === rc._id)[0].createdAt).diff();
                        return aa.filter.map((p) => {
                            if (!date1.current) date1.current = moment(p.data[0].createdAt);
                            return p.data.map((rc, index, arr) => {
                                let timeS: any = '';
                                const mn = moment(rc.createdAt); //show time for every day
                                if (date1.current)
                                    if (mn.diff(date1.current, 'days') < 1 && date1.current?.format('YYYY-MM-DD') !== mn.format('YYYY-MM-DD')) {
                                        timeS = date1.current?.diff(new Date(), 'days') >= 0 ? date1.current?.locale(lg).calendar() : date1.current?.locale(lg).format('LL');
                                        date1.current = mn;
                                    } else timeS = '';

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
                                                        {data?.user.fullName} {conversationText.phrase.input.write}...
                                                    </P>
                                                    <Avatar
                                                        src={data?.user.avatar}
                                                        alt={data?.user.fullName}
                                                        gender={data?.user.gender}
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
                                if (aR.length - 1 === indexR && index === arr.length - 1) date1.current = null;
                                if (!(rc.delete === dataFirst.id))
                                    return (
                                        <ItemsRoom
                                            roomId={aa._id}
                                            filterId={p._id}
                                            id_other={id_chat.id_other}
                                            background={data.background}
                                            choicePin={choicePin}
                                            setChoicePin={setChoicePin}
                                            targetChild={targetChild}
                                            phraseText={conversationText.phrase}
                                            conversationId={data._id}
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
                                            user={data.user}
                                            dataFirst={dataFirst}
                                            wch={wch}
                                            setWch={setWch}
                                            rr={rr}
                                            pins={data.pins}
                                            roomImage={roomImage}
                                            setRoomImage={setRoomImage}
                                            scrollCheck={scrollCheck}
                                            loadingChat={loadingChat}
                                            isIntersecting={isIntersecting}
                                            setSeenBy={setSeenBy}
                                        />
                                    );
                            });
                        });
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
                                    <input id={data?._id + 'uploadCon'} type="file" name="file[]" onChange={handleImageUpload} multiple hidden />
                                    <Label htmlFor={data?._id + 'uploadCon'} css="font-size: 22px;" color={colorText}>
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
                                onClick={(e) => handleSend(data?._id, data?.user.id)}
                            >
                                <SendOPTI />
                            </Div>
                        </Div>
                    </Div>
                </Div>
                {opMore && data && <MoreOption dataMore={dataMore} colorText={colorText} setOpMore={setOpMore} background={data.background} />}
            </DivResultsConversation>
        </DivConversation>
    );
};
export default Conversation;
