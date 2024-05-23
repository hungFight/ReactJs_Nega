import { AnyAction } from '@reduxjs/toolkit';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { Dispatch, useEffect, useRef } from 'react';
import { queryClient } from 'src';
import { PropsId_chats, PropsUser } from 'src/App';
import { BalloonI } from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { DivFlexPosition, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { onChats } from '~/redux/roomsChat';
import chatAPI from '~/restAPI/chatAPI';
import CommonUtils from '~/utils/CommonUtils';

const Balloon: React.FC<{
    userFirst: PropsUser;
    colorText: string;
    balloon: string[];
    setId_chats: React.Dispatch<React.SetStateAction<PropsId_chats[]>>;
    dispatch: Dispatch<AnyAction>;
    established: boolean;
}> = ({ userFirst, colorText, balloon, setId_chats, dispatch, established }) => {
    const memory = useRef<boolean>(true);
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['getBalloonChats', 1],
        staleTime: 30 * 24 * 60 * 60 * 1000,
        cacheTime: 30 * 24 * 60 * 60 * 1000,
        enabled: memory.current,
        queryFn: async () => {
            const data: {
                _id: string;
                userId: string;
                user: {
                    id: string;
                    avatar: any;
                    fullName: string;
                    gender: number;
                };
            }[] = await chatAPI.getConversationBalloon(dispatch, balloon);
            memory.current = false;
            return data.map((r) => {
                r.user.avatar = CommonUtils.convertBase64(r.user.avatar);
                return r;
            });
        },
    });
    console.log(balloon, 'balloon', isLoading);
    useEffect(() => {
        if (established) refetch();
    }, [balloon, established]);
    return (
        <Div
            css={`
                width: 50px;
                height: 50px;
                position: fixed;
                top: 195px;
                right: 2px;
                font-size: 50px;
                z-index: 88;
                cursor: var(--pointer);
                color: ${colorText};
                &:hover {
                    top: 160px;
                    justify-content: end;
                    align-items: baseline;
                    width: 120px;
                    height: 230px;
                    .setTopBalloon {
                        top: 35px;
                        .balloon {
                            width: auto;
                            transition: all 0.5s linear;
                            height: auto;
                        }
                        .balloon_0 {
                            top: -32px;
                            left: -33px;
                        }
                        .balloon_1 {
                            top: 11px;
                            left: -49px;
                        }
                        .balloon_2 {
                            top: 50px;
                            left: -26px;
                        }
                        .balloon_3 {
                            top: 78px;
                            left: 13px;
                        }
                        .balloon_4 {
                            top: 122px;
                            left: 13px;
                        }
                    }
                }
            `}
        >
            <Div
                className="setTopBalloon"
                css={`
                    position: relative;
                    ${isLoading && established
                        ? `animation: bg-color-animation 5s infinite;
                                        @keyframes bg-color-animation {
                                            0% {
                                                color: #f67575;
                                            }
                                            10% {
                                                color: #fdf982;
                                            }
                                            20% {
                                                color: #97ff60;
                                            }
                                            30% {
                                                color: #904ef3;
                                            }
                                            40% {
                                                color: #7360ed;
                                            }
                                            50% {
                                                color: #ff7cf0;
                                            }
                                            60% {
                                                color: #88f588;
                                            }
                                            70% {
                                                color: #88cff5;
                                            }
                                            80% {
                                                color: #eef080;
                                            }
                                            90% {
                                                color: #ffffff;
                                            }
                                            100% {
                                                color: #373937;
                                            }
                                        }`
                        : ''}
                `}
            >
                <Div css="position: absolute; top: 0; left: 0;"></Div>
                <BalloonI />
                <P
                    css={`
                        position: absolute;
                        top: 5px;
                        right: 20px;
                        color: #2ed1d1;
                    `}
                >
                    {balloon.length}
                </P>
                {data?.map((c, index) => {
                    return (
                        <DivFlexPosition
                            key={c._id}
                            className={`balloon balloon_${index}`}
                            size="1.2rem"
                            css={`
                                width: 0px;
                                height: 0px;
                                &:hover {
                                    h3 {
                                        display: block;
                                    }
                                }
                            `}
                            top="0px"
                            left="0px"
                            onClick={() => {
                                dispatch(onChats({ conversationId: c._id, id_other: c.userId }));
                                setId_chats((pre) => {
                                    if (!pre.some((p) => p.conversationId === c._id && p.id_other === c.userId)) {
                                        return [...pre, { conversationId: c._id, id_other: c.userId }];
                                    }
                                    return pre;
                                });
                            }}
                        >
                            <Div width="inherit" css="height: inherit; position: relative;">
                                <Avatar
                                    src={c.user.avatar}
                                    alt={c.user.fullName}
                                    radius="50%"
                                    gender={c.user.gender}
                                    css="width:35px; height: 35px; &:hover{box-shadow: 0 0 9px #fc3838;border-radius: 50%;}"
                                />
                                <Hname
                                    css={`
                                        display: none;
                                        position: absolute;
                                        z-index: 9;
                                        right: 50px;
                                        top: 6px;
                                        width: max-content;
                                    `}
                                >
                                    {c.user.fullName}
                                </Hname>
                            </Div>
                        </DivFlexPosition>
                    );
                })}
            </Div>
        </Div>
    );
};

export default Balloon;
