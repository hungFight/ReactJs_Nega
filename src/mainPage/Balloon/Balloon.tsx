import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { PropsUser } from 'src/App';
import { BalloonI } from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div } from '~/reUsingComponents/styleComponents/styleDefault';

const Balloon: React.FC<{
    userFirst: PropsUser;
    colorText: string;
    balloon: string[];
}> = ({ userFirst, colorText, balloon }) => {
    const { data } = useQuery({
        queryKey: ['getBalloonChats', 1],
        queryFn: () => null,
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
                `}
            >
                <BalloonI />
                <Avatar
                    src={userFirst.avatar}
                    alt={userFirst.fullName}
                    radius="50%"
                    gender={0}
                    css="width:28px; height: 29px; position: absolute;
                                            top: -23px;
                                            right: 10px;"
                />
                {balloon.map((c, index) => {
                    return (
                        <DivPos
                            key={c}
                            size="1.2rem"
                            css=""
                            top={
                                index === 0
                                    ? '-32px'
                                    : index === 1
                                    ? '11px'
                                    : index === 2
                                    ? '50px'
                                    : index === 3
                                    ? '78px'
                                    : index === 4
                                    ? '122px'
                                    : ''
                            }
                            left={
                                index === 0
                                    ? '-33px'
                                    : index === 1
                                    ? '-49px'
                                    : index === 2
                                    ? '-26px'
                                    : index === 3
                                    ? '13px'
                                    : '13px'
                            }
                        >
                            <Avatar
                                src={userFirst.avatar}
                                alt={userFirst.fullName}
                                radius="50%"
                                gender={0}
                                css="width:35px; height: 35px;"
                            />
                        </DivPos>
                    );
                })}
            </Div>
        </Div>
    );
};

export default Balloon;
