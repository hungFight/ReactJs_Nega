import { Div, Img, Input, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivConversation, DivResultsConversation } from './styleSed';
import { DotI, CameraI, ProfileCircelI, SendOPTI, UndoI, LoadingI } from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { CallName, DivLoading, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import dataEmoji from '@emoji-mart/data/sets/14/facebook.json';
import Picker from '@emoji-mart/react';
import { useEffect, useRef, useState } from 'react';
import { Label } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';
import LogicConversation from './LogicConver';
import { Player } from 'video-react';
import { PropsUser } from 'src/App';
import sendChatAPi from '~/restAPI/chatAPI';
import CommonUtils from '~/utils/CommonUtils';
import FileConversation from './File';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { PropsLanguage } from '~/reUsingComponents/ErrorBoudaries/Warning_browser';
import 'moment/locale/vi';
import Languages from '~/reUsingComponents/languages';
import { setIdUser } from '~/redux/hideShow';
import ItemsRoom from './ItemsConvers';
import { offChats } from '~/redux/background';

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
}> = ({ index, colorText, colorBg, dataFirst, id_chat, currentPage, chat }) => {
    const { lg } = Languages();

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
        token,
        userId,
        fetchChat,
        loading,
        cRef,
    } = LogicConversation(id_chat, dataFirst.id);
    const ERef = useRef<any>();
    const check = useRef<number>(0);

    useEffect(() => {
        console.log(check.current, 'check');
        ERef.current.scrollTop = -check.current;
    }, [conversation]);
    useEffect(() => {
        ERef.current.addEventListener('scroll', handleScroll);
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
                .format(lg === 'vi' ? 'LL' : 'MMMM Do YYYY');
            return newDateTime;
        }
    };
    const handleWatchMore = (e: any) => {
        e.stopPropagation();
        if (e.target.getAttribute('class').includes('chatTime')) {
            e.target.classList.remove('chatTime');
        } else {
            e.target.classList.add('chatTime');
        }
    };

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = ERef.current;
        const scrollBottom = -scrollTop + clientHeight;
        console.log(scrollBottom, scrollTop, clientHeight, scrollHeight);
        if (scrollBottom >= scrollHeight - 250 && !loading) {
            check.current = -scrollTop;
            if (cRef.current !== 2) fetchChat(true);
        }
    };

    const handleProfile = () => {
        const id_oth: string[] = [];
        conversation?.id_us.map((id) => {
            if (id !== userId) id_oth.push(id);
        });
        dispatch(setIdUser(id_oth));
    };
    console.log(conversation, 'conversation');

    return (
        <DivConversation
            height={chat.length > 2 ? '48% !important' : chat.length === 1 ? '100% !important' : ''}
            className="ofChats"
            id={id_chat.id_other + id_chat.id_room}
            aria-readonly={true}
        >
            <DivResultsConversation color="#e4e4e4">
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
                        z-index: 1;
                    `}
                >
                    <Div
                        width="30px"
                        css="height: 30px; margin-right: 10px; align-items: center; justify-content: center; cursor: var(--pointer)"
                        onClick={() => {
                            const ofChat = document.querySelectorAll('.ofChats');
                            const containChat = document.querySelector('.containChat');
                            if (ofChat) {
                                const newContainChat = Array.from(ofChat).filter((o, indexO) => {
                                    if (o.getAttribute('id') === id_chat.id_other + id_chat.id_room) {
                                        dispatch(
                                            offChats(
                                                chat.filter(
                                                    (c) =>
                                                        c.id_other !== id_chat.id_other &&
                                                        c.id_room !== id_chat.id_room,
                                                ),
                                            ),
                                        );
                                        o.remove();
                                    } else {
                                        return o;
                                    }
                                });
                                // Array.from(ofChat).forEach((o) => o.remove());
                                const timeOut = setTimeout(() => {
                                    containChat?.replaceChildren(...newContainChat);
                                    return () => clearTimeout(timeOut);
                                }, 10);
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
                        <Div>
                            <DotI />
                        </Div>
                    </Div>
                </Div>

                <Div
                    ref={ERef}
                    width="100%"
                    css={`
                        flex-direction: column-reverse;
                        padding-bottom: 10px;
                        ${emoji ? 'height: 150px;' : `height:${chat.length > 2 ? '90%' : '95%'};`}
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
                    onClick={() => setEmoji(false)}
                >
                    {conversation?.room.map((rc, index, arr) => {
                        return (
                            <ItemsRoom
                                key={rc.text.t + index}
                                rc={rc}
                                index={index}
                                userId={userId}
                                handleWatchMore={handleWatchMore}
                                ERef={ERef}
                                token={token}
                                handleTime={handleTime}
                                user={conversation.user}
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
                    width="100%"
                    wrap="wrap"
                    css=" height: auto; align-items: center; justify-content: center; background-color:#202124;; div#emojiCon{width: 100%}"
                >
                    <Div width="100%" wrap="wrap" css="position: relative;">
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
                                `}
                            >
                                {upload.map((item, index) => (
                                    <Div
                                        key={item.link}
                                        css={`
                                            min-width: 79px;
                                            width: 79px;
                                            border-radius: 5px;
                                            border: 1px solid #4e4e4e;
                                            flex-grow: 1;
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
                        <Div width="100%" css="height: 40px; align-items: center ; justify-content: space-around; ">
                            <Div css="font-size: 20px;" onClick={() => setEmoji(!emoji)}>
                                🙂
                            </Div>

                            <Div
                                width="34px !important"
                                css="font-size: 21px; color: #869ae7; height: 100%; align-items: center; justify-content: center;"
                            >
                                <form method="post" encType="multipart/form-data" id="formss">
                                    <input
                                        id="uploadCon"
                                        type="file"
                                        name="file[]"
                                        onChange={handleImageUpload}
                                        multiple
                                        hidden
                                    />
                                    <Label htmlFor="uploadCon" color={colorText}>
                                        <CameraI />
                                    </Label>
                                </form>
                            </Div>
                            <Input
                                width="180px; height: 30px"
                                padding="4px 29px 4px 8px;"
                                margin="0"
                                border="1px solid #484643 !important;"
                                radius="50px; font-size: 1.3rem"
                                background="rgb(255 255 255 / 6%)"
                                color={colorText}
                                placeholder="Send"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                            <Div
                                width="34px"
                                css="font-size: 22px; color: #23c3ec; height: 100%; align-items: center; justify-content: center; cursor: var(--pointer);"
                                onClick={(e) => handleSend(e, conversation?._id, conversation?.user.id)}
                            >
                                <SendOPTI />
                            </Div>
                        </Div>
                    </Div>
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
                </Div>
            </DivResultsConversation>
        </DivConversation>
    );
};
export default Conversation;
