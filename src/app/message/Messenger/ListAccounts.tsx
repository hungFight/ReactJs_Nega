import moment from 'moment';
import 'moment/locale/vi';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Languages from '~/reUsingComponents/languages';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { DivPos, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, P } from '~/reUsingComponents/styleComponents/styleDefault';

import { DotI, ProfileI, TyOnlineI } from '~/assets/Icons/Icons';
import { PropsBgRD } from '~/redux/background';
import { PropsRoomChat } from '~/restAPI/chatAPI';
import moments from '~/utils/moment';
import { PropsId_chats } from 'src/App';
import { PropsReMessengerRD } from '~/redux/messenger';
import { PropsRoomsChatRD, onChats } from '~/redux/roomsChat';
moment.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s',
        s: 'just now',
        ss: '%ds ago',
        m: '1m ago',
        mm: '%dms ago',
        h: '1h ago',
        hh: '%dhs ago',
        d: '1d ago',
        dd: '%dds ago',
        w: '1w ago',
        ww: '%dws ago',
        M: '1m ago',
        MM: '%dms ago',
        y: '1y ago',
        yy: '%dys ago',
    },
});
moment.updateLocale('vi', {
    relativeTime: {
        future: 'in %s',
        past: '%s',
        s: 'vừa xong',
        ss: '%d giây',
        m: '1p',
        mm: '%dp',
        h: '1h',
        hh: '%dh',
        d: '1ng',
        dd: '%dng',
        w: '1tn',
        ww: '%dtn',
        M: '1th',
        MM: '%dth',
        y: '1 năm',
        yy: '%d năm',
    },
});
const ListAccounts: React.FC<{
    colorText: string;
    colorBg: number;

    setMoreBar: React.Dispatch<
        React.SetStateAction<{
            id_room: string;
            id: string;
            avatar: string | undefined;
            fullName: string;
            gender: number;
        }>
    >;
    data: PropsRoomChat;
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
            userOnline: state.reload.userOnline,
        };
    });
    const { chats } = useSelector((state: PropsRoomsChatRD) => state.persistedReducer.roomsChat);

    const { lg } = Languages();
    const seenBy = useRef<HTMLDivElement | null>(null);

    let time: string | number | NodeJS.Timeout | undefined;
    const handleTouchStart = (user: {
        id_room: string;
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
    useEffect(() => {
        // check have you seen this chat?
        let check = false;
        chats.forEach((i) => {
            if (i?.id_room) {
                if (i.id_room === data._id) {
                    check = true;
                }
            } else {
                if (data.room.seenBy.includes(i.id_other)) {
                    check = true;
                }
            }
        });
        if (seenBy.current && !check && !data.room.seenBy.includes(userId) && data.room?.id !== userId)
            seenBy.current.setAttribute('style', 'color: #f0ffffde;');
    }, [data]);
    return (
        <>
            {data.users.map((rs, index) => {
                const who = data.room?.id === userId ? 'You: ' : rs.fullName;
                const Time = moments().FromNow(data.room.createdAt, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss', lg);
                return (
                    <Div
                        key={rs.id}
                        onTouchMove={handleTouchMove}
                        onTouchStart={() => handleTouchStart({ id_room: data._id, ...rs, deleted: data.deleted })}
                        onTouchEnd={handleTouchEnd}
                        onClick={(e) => {
                            dispatch(onChats({ id_room: data._id, id_other: rs.id }));
                            setId_chats((pre) => {
                                if (!chats.some((p) => p.id_room === data._id || p.id_other === rs.id)) {
                                    return [...pre, { id_room: data._id, id_other: rs.id }];
                                }
                                return pre;
                            });
                            if (seenBy.current) seenBy.current.setAttribute('style', 'color: #adadadde');
                        }}
                        width="100%"
                        css={`
                            height: 50px;
                            align-items: center;
                            padding: 0 3px;
                            margin: 5px 0;
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
                        `}
                    >
                        {data.room.seenBy.includes(rs.id) && (
                            <Div
                                css={`
                                    font-size: 1rem;
                                    position: absolute;
                                    width: 90px;
                                    right: 54px;
                                    top: 8px;
                                `}
                            >
                                {index === 0 && itemLg.seenBy}
                                <Avatar
                                    src={rs.avatar}
                                    gender={rs.gender}
                                    radius="50%"
                                    css="min-width: 15px; width: 15px; height: 15px; margin: 0px 5px; "
                                />
                            </Div>
                        )}
                        <Avatar
                            src={rs.avatar}
                            gender={rs.gender}
                            radius="50%"
                            css="min-width: 40px; width: 40px; height: 40px; margin: 3px 5px; "
                        />
                        {userOnline.includes(rs.id) && (
                            <DivPos
                                bottom="2px"
                                left="32px"
                                size="10px"
                                css="color: #149314; padding: 2px; background-color: #1c1b1b;"
                            >
                                <TyOnlineI />
                            </DivPos>
                        )}
                        <Div
                            width="73%"
                            wrap="wrap"
                            css={`
                                /* @media (min-width: 768px) {
                                    width: 73%;
                                } */
                            `}
                        >
                            <Hname>{rs.fullName}</Hname>
                            <Div
                                width="88%"
                                ref={seenBy}
                                css={`
                                    align-items: center;
                                    position: relative;
                                    color: #adadadde;
                                `}
                            >
                                <P css=" overflow: hidden;min-width: 21px; width: fit-content; height: 17px; margin-right: 5px; font-size: 1.1rem; margin-top: 3px;">
                                    {who + ' ...'}
                                </P>
                                <P
                                    z="1.2rem"
                                    css="width: 100%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; margin-top: 3px; "
                                >
                                    {data.room.text.t}
                                </P>
                                <P
                                    z="1rem"
                                    css="width: fit-content; margin-top: 5px;margin-left: 10px;text-wrap: nowrap;"
                                >
                                    {Time}
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
                        </Div>
                        <Div
                            width="30px"
                            css={`
                                height: 30px;
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
                                setMoreBar({ id_room: data._id, ...rs });
                            }}
                        >
                            <DotI />
                        </Div>
                    </Div>
                );
            })}
        </>
    );
};
export default ListAccounts;
