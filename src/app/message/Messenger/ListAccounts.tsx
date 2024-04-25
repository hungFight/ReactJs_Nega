import moment from 'moment';
import 'moment/locale/vi';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Languages from '~/reUsingComponents/languages';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { DivPos, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, DivFlex, P } from '~/reUsingComponents/styleComponents/styleDefault';

import { DotI, TyOnlineI } from '~/assets/Icons/Icons';
import { PropsRoomsChat } from '~/restAPI/chatAPI';
import moments from '~/utils/moment';
import { PropsId_chats } from 'src/App';
import { PropsRoomsChatRD, onChats } from '~/redux/roomsChat';
import '~/reUsingComponents/Libraries/formatMoment';

const ListAccounts: React.FC<{
    colorText: string;
    colorBg: number;
    setMoreBar: React.Dispatch<
        React.SetStateAction<{
            conversationId: string;
            id: string;
            avatar: string | undefined;
            fullName: string;
            gender: number;
        }>
    >;
    data: PropsRoomsChat;
    userId: string;
    setId_chats: React.Dispatch<React.SetStateAction<PropsId_chats[]>>;
    id_chats: PropsId_chats[];
    itemLg: {
        seenBy: string;
        who: string;
    };
}> = ({ colorText, colorBg, setMoreBar, data, userId, setId_chats, id_chats, itemLg }) => {
    const dispatch = useDispatch();
    const { userOnline } = useSelector((state: any) => {
        return {
            userOnline: state.userOnlineRD.userOnline,
        };
    });
    const { chats } = useSelector((state: PropsRoomsChatRD) => state.persistedReducer.roomsChat);

    const { lg } = Languages();
    const seenBy = useRef<HTMLDivElement | null>(null);

    let time: string | number | NodeJS.Timeout | undefined;
    const handleTouchStart = (user: {
        conversationId: string;
        id: string;
        avatar: string | undefined;
        fullName: string;
        gender: number;
        deleted: {
            id: string;
            createdAt: string;
        }[];
    }) => {
        time = setTimeout(() => {
            setMoreBar(user);
        }, 500);
    };
    const handleTouchMove = () => {
        clearTimeout(time);
    };
    const handleTouchEnd = () => {
        clearTimeout(time);
        console.log('no');
    };
    console.log(data, 'data room');
    const dataR = data.rooms[0].filter[0].data[0];
    useEffect(() => {
        // check have you seen this chat?
        let check = false;
        chats.forEach((i) => {
            if (i?.conversationId) {
                if (i.conversationId === data._id) {
                    check = true;
                }
            } else {
                if (dataR.seenBy.includes(i.id_other)) {
                    check = true;
                }
            }
        });
        if (seenBy.current && !check && !dataR.seenBy.includes(userId) && dataR?.userId !== userId) seenBy.current.setAttribute('style', 'color: #f0ffffde;');
    }, [data]);
    const who = dataR?.userId === userId ? 'You' : data.user.fullName;
    const info = [
        { type: 'image', length: 0 },
        { type: 'video', length: 0 },
    ];
    dataR.imageOrVideos.forEach((f) => {
        if (f.type === info[0].type) info[0].length += 1;
        if (f.type === info[1].type) info[0].length += 1;
    });
    console.log(dataR, 'dataR');

    const Time = moments().FromNow(dataR.createdAt, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss', lg);
    const text = dataR.text.t
        ? dataR.text.t
        : dataR.imageOrVideos.length
        ? `đã gửi ${info[0].length ? info[0].length + ' ảnh' : ''} ${info[1].length ? info[1].length + ' video' : ''}`
        : dataR.delete === 'all' && 'deleted';
    return (
        <Div
            onTouchMove={handleTouchMove}
            onTouchStart={() => handleTouchStart({ conversationId: data._id, ...data.user, deleted: data.deleted })}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => {
                if (!chats.some((p) => p.conversationId === data._id || p.id_other === data.user.id)) {
                    dispatch(onChats({ conversationId: data._id, id_other: data.user.id }));
                }
                setId_chats((pre) => {
                    if (!pre.some((p) => p.conversationId === data._id || p.id_other === data.user.id)) return [...pre, { conversationId: data._id, id_other: data.user.id }];
                    return pre;
                });

                if (seenBy.current) seenBy.current.setAttribute('style', 'color: #adadadde');
            }}
            width="100%"
            css={`
                height: 66px;
                align-items: center;
                padding: 0 3px;
                user-select: none;
                position: relative;
                color: ${colorText};
                transition: all 0.5s linear;
                &:active {
                    background-color: #484848ba;
                }
                @media (min-width: 768px) {
                    cursor: var(--pointer);
                    &:hover {
                        background-color: #484848ba;
                    }
                }
                @media (min-width: 500px) {
                    height: 55px;
                }
            `}
        >
            <Avatar
                src={data.user.avatar}
                gender={data.user.gender}
                radius="50%"
                css="min-width: 50px; width: 50px; height: 50px; margin: 3px 5px; @media(min-width: 500px){min-width: 45px;width: 45px; height: 45px; } "
            />
            {userOnline.includes(data.user.id) && (
                <DivPos bottom="2px" left="32px" size="10px" css="color: #149314; padding: 2px; background-color: #1c1b1b;">
                    <TyOnlineI />
                </DivPos>
            )}
            <Div
                width="75%"
                wrap="wrap"
                css={`
                    position: relative;
                    @media (min-width: 500) {
                        p {
                            font-size: 1.3rem;
                        }
                        h3 {
                            font-size: 1.5rem;
                        }
                    }
                `}
            >
                <DivFlex width="auto" css="max-width: 65%;" align="flex-end">
                    <Hname css="width: auto;" size="1.4rem">
                        {data.user.fullName}
                    </Hname>{' '}
                    {dataR.seenBy.includes(data.user.id) && (
                        <P z="1.2rem" css="color: #a3a3a3;margin-left: 8px;">
                            {itemLg.seenBy}
                        </P>
                    )}
                </DivFlex>
                <Div
                    width="88%"
                    ref={seenBy}
                    css={`
                        align-items: center;
                        position: relative;
                        color: #adadadde;
                    `}
                >
                    <P css="color: #a3a3a3; overflow: hidden;max-width: 110px; width: fit-content; height: 17px; margin-right: 5px; font-size: 1.2rem; margin-top: 3px;">{who}:</P>
                    <P z="1.2rem" css="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;margin-top: 3px;">
                        {text}
                    </P>
                    {data.miss ? (
                        <Div
                            display="block"
                            width="fit-content"
                            css={`
                                text-align: center;
                                border-radius: 50%;
                                font-size: 1.1rem;
                                position: absolute;
                                right: 12px;
                                top: -18px;
                                color: #5594c7;
                            `}
                        >
                            miss {data.miss}
                        </Div>
                    ) : (
                        <></>
                    )}
                </Div>
                <DivPos top="3px" right="40px" css="width: fit-content;" size="1.1rem">
                    .{Time}
                </DivPos>
            </Div>
            <Div
                width="30px"
                css={`
                    height: 30px;
                    font-size: 20px;
                    border-radius: 50%;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    @media (min-width: 768px) {
                        cursor: var(--pointer);
                        &:hover {
                            background-color: #161414ba;
                        }
                    }
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    setMoreBar({ conversationId: data._id, ...data.user });
                }}
            >
                <DotI />
            </Div>
        </Div>
    );
};
export default ListAccounts;
