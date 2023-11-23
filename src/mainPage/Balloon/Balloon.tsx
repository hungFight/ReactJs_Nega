import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { PropsUser } from 'src/App';
import { BalloonI } from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div } from '~/reUsingComponents/styleComponents/styleDefault';
import chatAPI from '~/restAPI/chatAPI';
import CommonUtils from '~/utils/CommonUtils';

const Balloon: React.FC<{
    userFirst: PropsUser;
    colorText: string;
    balloon: string[];
}> = ({ userFirst, colorText, balloon }) => {
    const { data } = useQuery({
        queryKey: ['getBalloonChats', 1],
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
            }[] = await chatAPI.getConversationBalloon(balloon);

            return data.map((r) => {
                r.user.avatar = CommonUtils.convertBase64(r.user.avatar);
                return r;
            });
        },
    });
    return (
        <Div
            css={`
                width: 50px;
                height: 50px;
                position: fixed;
                top: 195px;
                right: 5px;
                font-size: 50px;
                z-index: 88;
                cursor: var(--pointer);
                color: ${colorText};
            `}
        >
            <Div
                css={`
                    position: relative;
                    &:hover {
                        .balloon {
                            width: auto;
                            transition: all 1s linear;
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
                `}
            >
                <BalloonI />
                <Avatar
                    src={userFirst.avatar}
                    alt={userFirst.fullName}
                    radius="50%"
                    gender={0}
                    css="width:28px; z-index: 5; height: 29px; position: absolute;
                                            top: -23px;
                                            right: 10px;"
                />
                {data?.map((c, index) => {
                    return (
                        <DivPos
                            key={c._id}
                            className={`balloon balloon_${index}`}
                            size="1.2rem"
                            css={`
                                width: 0px;
                                height: 0px;
                            `}
                            top="0px"
                            left="0px"
                        >
                            <Div width="inherit" css="height: inherit; position: relative;">
                                <Avatar
                                    src={c.user.avatar}
                                    alt={c.user.fullName}
                                    radius="50%"
                                    gender={c.user.gender}
                                    css="width:35px; height: 35px;"
                                />
                                <Div
                                    css={`
                                        position: absolute;
                                        bottom: -50px;
                                        right: -50px;
                                        bottom: -17px;
                                        width: 100px;
                                        height: 40px;
                                        transform: rotate(40deg);
                                    `}
                                ></Div>
                            </Div>
                        </DivPos>
                    );
                })}
            </Div>
        </Div>
    );
};

export default Balloon;
