import React from 'react';
import { ChangeChatI, DelAllI, DelSelfI, PinI, RedeemI, RemoveCircleI } from '~/assets/Icons/Icons';
import { Div, P } from '~/reUsingComponents/styleComponents/styleDefault';
import FileConversation from '../File';
import { PropsChat } from './LogicConver';
import Languages from '~/reUsingComponents/languages';
import chatAPI from '~/restAPI/chatAPI';

const OptionForItem: React.FC<{
    setOptions: (
        value: React.SetStateAction<
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
        >,
    ) => void;
    optionsForItem: {
        _id: string;
        id: string;
        text: string;
        imageOrVideos: {
            v: string;
            type?: string | undefined;
            icon: string;
            _id: string;
        }[];
    };
    ERef: React.MutableRefObject<any>;
    del: React.MutableRefObject<HTMLDivElement | null>;
    conversation: PropsChat | undefined;
}> = ({ setOptions, optionsForItem, ERef, del, conversation }) => {
    const { lg } = Languages();

    const optionsForItemData: {
        [en: string]: {
            id: number;
            icon: JSX.Element;
            color: string;
            title: string;
            top: string;
            onClick: () => void;
        }[];
        vi: {
            id: number;
            icon: JSX.Element;
            color: string;
            title: string;
            top: string;
            onClick: () => void;
        }[];
    } = {
        en: [
            {
                id: 1,
                icon: <DelAllI />,
                color: '#67b5f8',
                title: 'Remove both side can not see this text',
                top: '-80px',
                onClick: async () => {
                    if (conversation && optionsForItem) {
                        //  id room and chat
                        const res = await chatAPI.delChatAll(conversation._id, optionsForItem._id, optionsForItem.id);
                    }
                },
            },
            {
                id: 2,
                icon: <DelSelfI />,
                color: '#67b5f8',
                title: 'Remove only you can not see this text',
                top: '-80px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 3,
                icon: <ChangeChatI />,
                color: '',
                title: 'Change this text and others still can see your changing',
                top: '-100px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 4,
                icon: <PinI />,
                color: '#d0afaf',
                title: 'Pin',
                top: '-40px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 5,
                icon: <RedeemI />,
                color: '#73b3eb',
                title: 'Redeem',
                top: '-40px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
        ],
        vi: [
            {
                id: 1,
                icon: <DelAllI />,
                color: '#67b5f8',
                title: 'Khi xoá cả 2 bên sẽ đều không nhìn thấy tin nhắn này',
                top: '-100px',
                onClick: async () => {
                    if (conversation && optionsForItem) {
                        //  id room and chat
                        const res = await chatAPI.delChatAll(conversation._id, optionsForItem._id, optionsForItem.id);
                    }
                },
            },
            {
                id: 2,
                icon: <DelSelfI />,
                color: '#67b5f8',
                title: 'Khi xoá thi chỉ mình bạn không nhìn thấy tin nhắn này',
                top: '-100px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 3,
                icon: <ChangeChatI />,
                color: '',
                title: 'Khi thay đổi tin nhắn người khác sẽ biết ban đã thay đổi',
                top: '-98px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 4,
                icon: <PinI />,
                color: '#d0afaf',
                title: 'Gim',
                top: '-40px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 5,
                icon: <RedeemI />,
                color: '#73b3eb',
                title: 'Thu hồi',
                top: '-40px',
                onClick: async () => {
                    // const res = await sendChatAPi.getChat
                },
            },
        ],
    };
    const handleTouchMoveM = (e: any) => {
        const touches = e.touches;
        // Kiểm tra tọa độ của ngón tay đầu tiên trong danh sách
        if (touches.length > 0) {
            const firstTouch = touches[0];
            const x = firstTouch.clientX;
            const y = firstTouch.clientY;
            // Kiểm tra xem tọa độ (x, y) thuộc về phần tử nào
            const element = document.elementFromPoint(x, y);
            const el = document.querySelectorAll('.MoveOpChat');
            Array.from(el).map((r) => {
                if (r.getAttribute('class')?.includes('MoveOpChat') && r !== element) {
                    r.classList.remove('MoveOpChat');
                }
            });
            if (element) {
                element.classList.add('MoveOpChat');
                console.log('Đang di chuyển qua phần tử:', element);
            }
            // Bây giờ, "element" chứa thông tin về phần tử mà ngón tay đang di chuyển qua
        }
    };
    return (
        <Div
            width="100%"
            wrap="wrap"
            css={`
                position: absolute;
                left: 0;
                height: 91%;
                background-color: #191919e6;
                z-index: 999;
                bottom: 0;
                justify-content: center;
                padding: 10px;
                overflow: hidden;
            `}
            onClick={() => setOptions(undefined)}
        >
            <Div
                width="2px"
                css={`
                    position: absolute;
                    top: 1px;
                    left: 54px;
                    font-size: 30px;
                    cursor: var(--pointer);
                    height: 30px;
                    z-index: 1;
                    background-color: #898787;
                `}
            ></Div>
            <Div
                css={`
                    position: absolute;
                    top: 30px;
                    left: 40px;
                    font-size: 30px;
                    z-index: 1;
                    cursor: var(--pointer);
                `}
                onClick={() => setOptions(undefined)}
            >
                <RemoveCircleI />
            </Div>
            <Div
                wrap="wrap"
                display="block"
                width="100%"
                css={`
                    height: 50%;
                    position: relative;
                    animation: chatMove 0.5s linear;
                    @keyframes chatMove {
                        0% {
                            right: -180px;
                        }
                        100% {
                            right: 0px;
                        }
                    }
                `}
            >
                {optionsForItem.text && (
                    <Div
                        css="justify-content: end; width: 100%; align-items: baseline; "
                        onClick={(e) => e.stopPropagation()}
                    >
                        <P
                            z="1.4rem"
                            css="width: fit-content; margin: 0; padding: 2px 12px 4px; border-radius: 7px; border-top-left-radius: 13px; border-bottom-left-radius: 13px; background-color: #353636; border: 1px solid #4e4d4b;"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            {optionsForItem.text}
                        </P>
                    </Div>
                )}
                {optionsForItem.imageOrVideos.length > 0 && (
                    <Div
                        width="100%"
                        css={`
                            height: ${optionsForItem.text ? '90%' : '100%'};
                            width: 100%;
                            align-items: center;
                            padding: 10px;
                        `}
                    >
                        <Div
                            width="100%"
                            wrap="wrap"
                            css={`
                                height: 97%;
                                overflow-y: overlay;
                                border-radius: 5px;
                                position: relative;
                                padding: 1px;
                                justify-content: right;
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
                                div {
                                    flex-grow: 0 !important;
                                    height: 50%;
                                    border: 2px solid #686767;
                                }
                            `}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {optionsForItem.imageOrVideos.map((fl, index) => (
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
            </Div>
            <Div
                width="100%"
                css={`
                    margin: 5px 0;
                    justify-content: right;
                    padding: 0 5px;
                    animation: chatMove 0.5s linear;
                    @keyframes chatMove {
                        0% {
                            right: -348px;
                        }
                        100% {
                            right: 0px;
                        }
                    }
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <Div
                    css={`
                        font-size: 1.4rem;
                        padding: 2px 8px;
                        background-color: #4b4b4b;
                        border-radius: 5px;
                        cursor: var(--pointer);
                    `}
                >
                    Reply
                </Div>
            </Div>
            <Div
                width="100%"
                css={`
                    height: 40%;
                    background-color: #060606c9;
                    border-radius: 5px;
                    padding: 8px;
                    position: relative;
                    animation: chatMove 0.5s linear;
                    @keyframes chatMove {
                        0% {
                            right: -348px;
                        }
                        100% {
                            right: 0px;
                        }
                    }
                    .MoveOpChat {
                        p {
                            display: block;
                        }
                        font-size: 43px;
                        top: -8px;
                    }
                `}
                onTouchStart={(e: any) => {
                    e.target.classList.add('MoveOpChat');
                }}
                onTouchEnd={(e: any) => {
                    const el = document.querySelectorAll('.MoveOpChat');
                    Array.from(el).map((r) => {
                        if (r.getAttribute('class')?.includes('MoveOpChat')) {
                            r.classList.remove('MoveOpChat');
                        }
                    });
                }}
                onTouchMove={(e) => handleTouchMoveM(e)}
                onClick={(e) => e.stopPropagation()}
            >
                {optionsForItemData[lg].map((o) => (
                    <Div
                        key={o.id}
                        css={`
                            position: relative;
                            margin: 4px;
                            height: fit-content;
                            font-size: 25px;
                            padding: 2px;
                            color: ${o.color};
                            svg {
                                pointer-events: none;
                            }
                            cursor: var(--pointer);
                            @media (min-width: 767px) {
                                &:hover {
                                    p {
                                        display: block;
                                    }
                                }
                            }
                        `}
                        onClick={o.onClick}
                    >
                        {o.icon}
                        <P
                            z="1.3rem"
                            css={`
                                display: none;
                                position: absolute;
                                width: 100px;
                                padding: 3px;
                                background-color: #434444;
                                border-radius: 5px;
                                text-align: center;
                                left: 50%;
                                right: 50%;
                                translate: -50%;
                                top: ${o.top};
                            `}
                        >
                            {o.title}
                        </P>
                    </Div>
                ))}
            </Div>
        </Div>
    );
};

export default OptionForItem;
