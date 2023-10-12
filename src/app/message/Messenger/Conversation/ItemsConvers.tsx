import moment from 'moment';
import { PropsChat } from './LogicConver';
import { Div, P } from '~/reUsingComponents/styleComponents/styleDefault';
import FileConversation from '../File';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { useEffect, useRef, useState } from 'react';
import { DotI } from '~/assets/Icons/Icons';
import { PropsUser } from 'src/App';

const ItemsRoom: React.FC<{
    del: React.MutableRefObject<HTMLDivElement | null>;
    rc: {
        _id: string;
        text: {
            t: string;
            icon: string;
        };
        imageOrVideos: {
            v: string;
            type?: string | undefined;
            icon: string;
            _id: string;
        }[];
        sending?: boolean | undefined;
        seenBy: string[];
        createdAt: string;
    };
    index: number;
    userId: string;
    handleWatchMore: (e: any) => void;
    ERef: React.MutableRefObject<any>;
    handleTime: (dateTime: string, type: string) => string;
    user: {
        id: string;
        avatar: any;
        fullName: string;
        gender: number;
    };
    timeS: string;
    setOptions: React.Dispatch<
        React.SetStateAction<
            | {
                  id: string;
                  text: string;
                  imageOrVideos: {
                      v: string;
                      type?: string | undefined;
                      icon: string;
                      _id: string;
                  }[];
              }
            | undefined
        >
    >;
    options:
        | {
              id: string;
              text: string;
              imageOrVideos: {
                  v: string;
                  type?: string | undefined;
                  icon: string;
                  _id: string;
              }[];
          }
        | undefined;
    dataFirst: PropsUser;
}> = ({ rc, index, userId, handleWatchMore, ERef, handleTime, user, del, timeS, setOptions, options, dataFirst }) => {
    const elWatChTime = useRef<HTMLDivElement | null>(null);

    return (
        <>
            <P css="font-size: 1.1rem; text-align: center;padding: 2px 0;">{timeS}</P>
            {rc._id === dataFirst.id ? (
                <Div
                    width="100%"
                    css={`
                        padding-left: ${rc.imageOrVideos.length <= 1 ? '35%' : '20%'};
                        margin-bottom: 8px;
                        justify-content: right;
                        .chatTime {
                            &:hover {
                                #showDotAtRoomChat {
                                    display: none;
                                }
                            }
                            .dateTime {
                                display: block;
                            }
                        }
                        p {
                            z-index: 1;
                        }
                    `}
                >
                    <Div
                        ref={elWatChTime}
                        display="block"
                        className="noTouch"
                        css={`
                            position: relative;
                            justify-content: right;
                            ${rc.imageOrVideos.length < 1 ? 'display: block;' : 'flex-grow: 1;'}
                            ${rc.text.t &&
                            `&::after {display: block; content: ''; width: 100%; height: ${
                                rc.imageOrVideos.length > 0 ? '10%' : '100%'
                            }; position: absolute; top: 0;left: 0;}`}
                            &:hover {
                                #showDotAtRoomChat {
                                    display: flex;
                                }
                            }
                        `}
                        onClick={handleWatchMore}
                    >
                        <Div
                            display="none"
                            id="showDotAtRoomChat"
                            css={`
                                position: absolute;
                                width: 100%;
                                left: -35px;
                                top: 1px;
                                padding-left: 4px;
                                border-radius: 5px;
                                font-size: 25px;
                                z-index: 10;
                                cursor: var(--pointer);
                            `}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <Div
                                onClick={() =>
                                    setOptions({
                                        id: rc._id,
                                        text: rc.text.t,
                                        imageOrVideos: rc.imageOrVideos,
                                    })
                                }
                            >
                                <DotI />
                            </Div>
                        </Div>
                        {rc.text.t && (
                            <Div css="justify-content: end; z-index: 11;">
                                <P
                                    z="1.4rem"
                                    css="width: fit-content; margin: 0; padding: 2px 12px 4px; border-radius: 7px; border-top-left-radius: 13px; border-bottom-left-radius: 13px; background-color: #353636; border: 1px solid #4e4d4b;"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleWatchMore(elWatChTime.current);
                                    }}
                                >
                                    {rc.text.t}
                                </P>
                            </Div>
                        )}
                        {rc.imageOrVideos.length > 0 && (
                            <Div css=" align-items: end; flex-grow: 1;">
                                <Div
                                    width="100%"
                                    wrap="wrap"
                                    css={`
                                        position: relative;
                                        justify-content: end;
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
                                        ${rc.imageOrVideos.length > 2 && 'background-color: #ca64b8;'}
                                    `}
                                >
                                    {rc.imageOrVideos.map((fl, index) => (
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
                        {rc?.sending ? (
                            <P z="1rem" css="text-align: end;">
                                sending...
                            </P>
                        ) : (
                            <>
                                {rc.imageOrVideos.length > 0 ? (
                                    <P
                                        css={`
                                            display: ${!rc.text.t ? 'block' : 'none'};
                                            width: 100%;
                                            font-size: 1rem;
                                            margin-right: 5px;
                                            text-align: right;
                                        `}
                                        className="dateTime"
                                    >
                                        {handleTime(rc.createdAt, 'hour')}, {handleTime(rc.createdAt, 'date')}
                                    </P>
                                ) : (
                                    <>
                                        <P
                                            className="dateTime"
                                            css="display: none; font-size: 1rem; margin-left: 5px; position: absolute; left: -138px; top: 5px;"
                                        >
                                            {handleTime(rc.createdAt, 'date')}
                                        </P>
                                        <P
                                            className="dateTime"
                                            css="display: none; width: 100%; font-size: 1rem; margin-right: 5px; text-align: right;"
                                        >
                                            {handleTime(rc.createdAt, 'hour')}
                                        </P>
                                    </>
                                )}
                            </>
                        )}
                    </Div>
                </Div>
            ) : (
                <Div
                    key={rc.text.t + index}
                    wrap="wrap"
                    css={`
                        padding-right: ${rc.imageOrVideos.length <= 1 ? '35%' : '20%'};
                        justify-content: left;
                        align-items: center;
                        margin-bottom: 8px;
                    `}
                >
                    <Div
                        css={`
                            ${rc.imageOrVideos.length < 1 ? 'display: flex;' : ''}
                            position: relative;
                            justify-content: left;
                            ${rc.imageOrVideos.length > 0 ? 'flex-grow: 1;' : ''}
                            .chatTime {
                                .dateTime {
                                    display: block;
                                }
                            }
                        `}
                    >
                        <Avatar
                            src={user.avatar}
                            alt={user.fullName}
                            gender={user.gender}
                            radius="50%"
                            css="min-width: 17px; width: 17px; height: 17px; margin-right: 4px; margin-top: 3px;"
                        />
                        <Div
                            width="100%"
                            display="block"
                            className="noTouch"
                            css={`
                                position: relative;
                                justify-content: start;
                                ${rc.text.t &&
                                `&::after {display: block; content: ''; width: 100%; height: ${
                                    rc.imageOrVideos.length > 0 ? '10%' : '100%'
                                }; position: absolute; top: 0;left: 0;}`}
                            `}
                            onClick={handleWatchMore}
                        >
                            {rc.text.t && (
                                <P
                                    z="1.4rem"
                                    css="width: fit-content; padding: 2px 12px 4px; border-radius: 7px; border-top-right-radius: 13px; border-bottom-right-radius: 13px; background-color: #353636; border: 1px solid #4e4d4b;"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleWatchMore(elWatChTime.current);
                                    }}
                                >
                                    {rc.text.t}
                                </P>
                            )}
                            {rc.imageOrVideos.length > 0 && (
                                <Div css=" align-items: start; ">
                                    <Div
                                        width="100%"
                                        wrap="wrap"
                                        css={`
                                            justify-content: end;
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
                                            ${rc.imageOrVideos.length > 2 && 'background-color: #ca64b8;'}
                                        `}
                                    >
                                        {rc.imageOrVideos.map((fl, index) => (
                                            <FileConversation
                                                key={fl.v + index}
                                                type={fl?.type}
                                                v={fl.v}
                                                del={del}
                                                icon={fl.icon}
                                                ERef={ERef}
                                            />
                                        ))}
                                    </Div>
                                </Div>
                            )}
                            {rc.imageOrVideos.length > 0 ? (
                                <P
                                    className="dateTime"
                                    css={`
                                        display: ${!rc.text.t ? 'block' : 'none'};
                                        width: 100%;
                                        font-size: 1rem;
                                        margin-left: 5px;
                                        text-align: left;
                                    `}
                                >
                                    {handleTime(rc.createdAt, 'hour')}, {handleTime(rc.createdAt, 'date')}
                                </P>
                            ) : (
                                <>
                                    <P
                                        className="dateTime"
                                        css="display: none; font-size: 1rem; margin-left: 5px; position: absolute; right: -138px; top: 5px;"
                                    >
                                        {handleTime(rc.createdAt, 'date')}
                                    </P>
                                    <P
                                        className="dateTime"
                                        css="display: none; width: 100%; font-size: 1rem; margin-left: 5px; text-align: left;"
                                    >
                                        {handleTime(rc.createdAt, 'hour')}
                                    </P>
                                </>
                            )}
                        </Div>
                    </Div>
                </Div>
            )}
        </>
    );
};
export default ItemsRoom;
