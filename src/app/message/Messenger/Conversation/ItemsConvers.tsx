import moment from 'moment';
import { PropsChat } from './LogicConver';
import { Div, P } from '~/reUsingComponents/styleComponents/styleDefault';
import FileConversation from '../File';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { useEffect, useRef, useState } from 'react';
import { DotI, GarbageI } from '~/assets/Icons/Icons';
import CryptoJS from 'crypto-js';
import { PropsUser } from 'src/App';
type PropsRc = {
    _id: string;
    id: string;
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
    delete?: string;
    sending?: boolean | undefined;
    seenBy: string[];
    createdAt: string;
    updatedAt?: string;
};
const ItemsRoom: React.FC<{
    del: React.MutableRefObject<HTMLDivElement | null>;
    rc: PropsRc;
    index: number;
    archetype: PropsRc[];
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
                  _id: string;
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
              _id: string;
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
    wch: string | undefined;
    setWch: React.Dispatch<React.SetStateAction<string | undefined>>;
    rr: React.MutableRefObject<string>;
    roomId: string;
}> = ({
    rc,
    index,
    archetype,
    handleWatchMore,
    ERef,
    handleTime,
    user,
    del,
    timeS,
    setOptions,
    options,
    dataFirst,
    wch,
    setWch,
    rr,
    roomId,
}) => {
    const elWatChTime = useRef<HTMLDivElement | null>(null);
    const textarea = useRef<HTMLTextAreaElement | null>(null);

    console.log('Item', wch);
    if (rc.id === dataFirst.id && !wch) {
        if (rc.seenBy.includes(user.id) && !rr.current) {
            rr.current = rc._id;
        } else {
            if (archetype[index + 1]?.seenBy.includes(user.id) && !rc?.seenBy.includes(user.id)) {
                rr.current = archetype[index + 1]?._id;
            }
        }
    }
    if (wch) rr.current = '';

    return (
        <>
            {rc?.delete !== dataFirst.id && <P css="font-size: 1.1rem; text-align: center;padding: 2px 0;">{timeS}</P>}
            {rc.id === dataFirst.id ? (
                rc?.delete !== dataFirst.id && (
                    <Div
                        width="100%"
                        css={`
                            padding-left: ${rc.imageOrVideos.length <= 1 ? '35%' : '20%'};
                            margin-bottom: 8px;
                            justify-content: right;
                            position: relative;
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
                            width="fit-content"
                            css={`
                                position: relative;
                                max-width: 100%;
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
                        >
                            {!rc?.delete && (
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
                                        onClick={() => {
                                            setOptions({
                                                _id: rc._id,
                                                id: rc.id,
                                                text: rc.text.t,
                                                imageOrVideos: rc.imageOrVideos,
                                            });
                                        }}
                                    >
                                        <DotI />
                                    </Div>
                                </Div>
                            )}

                            {(rc.text.t || rc?.delete) && (
                                <Div
                                    width="100%"
                                    css="justify-content: end; z-index: 11; position: relative;"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleWatchMore(elWatChTime.current);
                                    }}
                                >
                                    <P
                                        z={rc?.delete ? '1.2rem' : '1.4rem'}
                                        css={`
                                            margin: 0;
                                            padding: 2px 12px 4px;
                                            border-radius: 7px;
                                            white-space: pre;
                                            border-top-left-radius: 13px;
                                            border-bottom-left-radius: 13px;
                                            align-items: center;

                                            text-wrap: wrap;
                                            width: max-content;
                                            word-wrap: break-word;
                                            max-width: 100%;

                                            background-color: ${rc?.delete ? '#1d1c1c' : '#353636'};
                                            border: 1px solid #4e4d4b;
                                            svg {
                                                margin-right: 3px;
                                            }
                                        `}
                                    >
                                        {rc.text.t}
                                        {rc?.delete && <GarbageI />}
                                        {rc?.delete && "You've deleted"}
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
                                                who="you"
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
                                                css="display: none; font-size: 1rem; margin-left: 5px; position: absolute; left: -153px; top: 5px;"
                                            >
                                                {handleTime(rc.createdAt, 'date')}
                                            </P>
                                            {rc?.updatedAt && (
                                                <P
                                                    className="dateTime"
                                                    css="display: none; font-size: 1rem; margin-left: 5px; position: absolute; left: -175px; top: 18px;"
                                                >
                                                    Deleted on {handleTime(rc?.updatedAt, 'date')}
                                                </P>
                                            )}
                                            <P
                                                className="dateTime"
                                                css="display: none; width: 100%; font-size: 1rem; margin-right: 5px; text-align: right;"
                                            >
                                                {handleTime(rc.createdAt, 'hour')}
                                            </P>
                                        </>
                                    )}
                                    {rc.seenBy.includes(user.id) && (
                                        <Avatar
                                            className="dateTime"
                                            src={user.avatar}
                                            alt=""
                                            gender={user.gender}
                                            radius="50%"
                                            css={`
                                                display: none;
                                                width: 15px;
                                                height: 15px;
                                                position: absolute;
                                                bottom: 12px;
                                                left: -5px;
                                                z-index: 1;
                                            `}
                                        />
                                    )}
                                </>
                            )}
                        </Div>
                        {(wch === rc._id || rr.current === rc._id) && (
                            <Avatar
                                src={user.avatar}
                                alt={user.fullName}
                                gender={user.gender}
                                radius="50%"
                                css={`
                                    min-width: 17px;
                                    width: 15px;
                                    height: 15px;
                                    margin-right: 4px;
                                    margin-top: 3px;
                                    position: absolute;
                                    right: -10px;
                                    z-index: 11;
                                    bottom: 0;
                                `}
                            />
                        )}
                    </Div>
                )
            ) : (
                <Div
                    key={rc.text.t + index}
                    wrap="wrap"
                    css={`
                        padding-right: ${rc.imageOrVideos.length <= 1 ? '35%' : '20%'};
                        justify-content: left;
                        align-items: center;
                        margin-bottom: 8px;
                        .chatTime {
                            .dateTime {
                                display: block;
                            }
                        }
                    `}
                >
                    <Div
                        ref={elWatChTime}
                        css={`
                            ${rc.imageOrVideos.length < 1 ? 'display: flex;' : ''}
                            position: relative;
                            justify-content: left;
                            ${rc.imageOrVideos.length > 0 ? 'flex-grow: 1;' : ''}
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
                            onClick={(e) => {
                                console.log('hello');
                                if (rc.imageOrVideos.length) {
                                    e.stopPropagation();
                                    handleWatchMore(elWatChTime.current);
                                }
                            }}
                        >
                            {(rc.text.t || rc?.delete === 'all') && (
                                <P
                                    z={rc?.delete === 'all' ? '1.2rem' : '1.4rem'}
                                    css={`
                                        width: fit-content;
                                        padding: 2px 12px 4px;
                                        border-radius: 7px;
                                        border-top-right-radius: 13px;
                                        display: flex;
                                        align-items: center;
                                        white-space: pre;
                                        border-bottom-right-radius: 13px;
                                        background-color: ${rc?.delete === 'all' ? '#1d1c1c' : '#353636'};
                                        border: 1px solid #4e4d4b;
                                        svg {
                                            margin-right: 3px;
                                        }
                                    `}
                                >
                                    {rc.text.t}
                                    {rc?.delete === 'all' && <GarbageI />}
                                    {rc?.delete === 'all' && `${user.fullName} has deleted`}
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
                                                who="other"
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
                                        css={`
                                            display: none;
                                            font-size: 1rem;
                                            margin-left: 5px;
                                            position: absolute;
                                            right: -89px;
                                            top: 5px;
                                            ${rc?.delete && 'right: -55px; top: 31px;'}
                                        `}
                                    >
                                        {handleTime(rc.createdAt, 'date')}
                                    </P>
                                    {rc?.updatedAt && (
                                        <P
                                            className="dateTime"
                                            css={`
                                                display: none;
                                                font-size: 1rem;
                                                margin-left: 5px;
                                                position: absolute;
                                                right: -122px;
                                                top: 44px;
                                            `}
                                        >
                                            Deleted on {handleTime(rc?.updatedAt, 'date')}
                                        </P>
                                    )}
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
