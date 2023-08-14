import moment from 'moment';
import 'moment/locale/vi';
import { useEffect, useRef, useState } from 'react';
import { PropsReloadRD } from '~/redux/reload';
import { useDispatch, useSelector } from 'react-redux';

import Languages from '~/reUsingComponents/languages';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { DivPos, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, P } from '~/reUsingComponents/styleComponents/styleDefault';

import { DotI, ProfileI, TyOnlineI } from '~/assets/Icons/Icons';
import { PropsBgRD, onChats } from '~/redux/background';
import { PropsRoomChat } from '~/restAPI/chatAPI';
import moments from '~/utils/moment';
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
        y: '1y agoe',
        yy: '%dys ago',
    },
});
moment.updateLocale('vi', {
    relativeTime: {
        future: 'in %s',
        past: '%s',
        s: 'vừa xong',
        ss: '%d giây trước',
        m: '1p trước',
        mm: '%dp trước',
        h: '1h trước',
        hh: '%dh trước',
        d: '1ng trước',
        dd: '%dng trước',
        w: '1tn trước',
        ww: '%dtn trước',
        M: '1th trước',
        MM: '%dth trước',
        y: '1 năm trước',
        yy: '%d năm trước',
    },
});
const ListAccounts: React.FC<{
    colorText: string;
    colorBg: number;
    setMoreBar: React.Dispatch<
        React.SetStateAction<{ id_room: string; id: string; avatar: string; fullName: string; gender: number }>
    >;
    data: PropsRoomChat;
    userId: string;
    setId_chats: React.Dispatch<
        React.SetStateAction<
            {
                id_room: string | undefined;
                id_other: string;
            }[]
        >
    >;
}> = ({ colorText, colorBg, setMoreBar, data, userId, setId_chats }) => {
    const dispatch = useDispatch();
    const { userOnline, id_chat } = useSelector((state: any) => {
        return {
            userOnline: state.reload.userOnline,
            id_chat: state.persistedReducer.background.chats,
        };
    });
    const { lg } = Languages();
    const seenBy = useRef<HTMLDivElement | null>(null);

    let time: string | number | NodeJS.Timeout | undefined;
    const handleTouchStart = (user: {
        id_room: string;
        id: string;
        avatar: string;
        fullName: string;
        gender: number;
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
        id_chat.forEach((i: { id_room: any; id_other: string }) => {
            if (i.id_room) {
                if (i.id_room === data._id) {
                    check = true;
                }
            } else {
                if (data.room.seenBy.includes(i.id_other)) {
                    check = true;
                }
            }
        });
        if (seenBy.current && !check && !data.room.seenBy.includes(userId))
            seenBy.current.setAttribute('style', 'color: #f0ffffde;');
    }, [data]);

    return (
        <>
            {data.users.map((rs) => {
                const who =
                    data.room._id === userId
                        ? 'You: '
                        : rs.gender === 0
                        ? 'Him: '
                        : rs.gender === 1
                        ? 'Her: '
                        : 'Cuy: ';
                const Time = moments().FromNow(data.room.createdAt, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss', lg);
                return (
                    <Div
                        key={rs.id}
                        onTouchMove={handleTouchMove}
                        onTouchStart={() => handleTouchStart({ id_room: data._id, ...rs })}
                        onTouchEnd={handleTouchEnd}
                        onClick={(e) => {
                            dispatch(onChats({ id_room: data._id, id_other: rs.id }));
                            setId_chats((pre) => {
                                let check = false;
                                pre.forEach((p) => {
                                    if (p.id_other === id_chat.id_other) {
                                        check = true;
                                    }
                                });
                                if (!check) return [...pre, { id_room: data._id, id_other: rs.id }];
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
                                <P css="min-width: 21px; width: 17px; height: 17px; margin-right: 5px; font-size: 1.1rem; margin-top: 3px;">
                                    {who}
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