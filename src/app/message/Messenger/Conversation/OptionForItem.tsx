import React, { useRef, useState } from 'react';
import { CameraI, ChangeChatI, DelAllI, DelSelfI, PinI, RedeemI, RemoveCircleI, SendOPTI } from '~/assets/Icons/Icons';
import { Div, DivFlex, P } from '~/reUsingComponents/styleComponents/styleDefault';
import FileConversation from '../File';
import { PropsChat } from './LogicConver';
import Languages from '~/reUsingComponents/languages';
import chatAPI from '~/restAPI/chatAPI';
import ServerBusy from '~/utils/ServerBusy';
import { useDispatch } from 'react-redux';
import { Label, Textarea } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';
import { v4 as uuidv4 } from 'uuid';
import handleFileUpload from '~/utils/handleFileUpload';
import { decrypt, encrypt } from '~/utils/crypto';
import fileGridFS from '~/restAPI/gridFS';
import CommonUtils from '~/utils/CommonUtils';

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
        secondary?: string;
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
    colorText: string;
    setEmoji: React.Dispatch<React.SetStateAction<boolean>>;
    setConversation: React.Dispatch<React.SetStateAction<PropsChat | undefined>>;
}> = ({ setOptions, optionsForItem, ERef, del, conversation, colorText, setEmoji, setConversation }) => {
    const { lg } = Languages();
    const [value, setValue] = useState<string>('');
    const [loading, setLoading] = useState<string>('');
    const textarea = useRef<HTMLTextAreaElement | null>(null);
    const [fileUpload, setFileUpload] = useState<{ pre: { _id: string; link: any; type: string }[]; up: any }>();
    const [changeCus, setChangeCus] = useState<number | undefined>(undefined);
    const dispatch = useDispatch();
    const optionsForItemData: {
        [en: string]: {
            id: number;
            icon: JSX.Element;
            color: string;
            title: string;
            top: string;
            onClick: (id?: number) => void;
        }[];
        vi: {
            id: number;
            icon: JSX.Element;
            color: string;
            title: string;
            top: string;
            onClick: (id?: number) => void;
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
                        setLoading('Deleting...');
                        //  id room and chat
                        const id_file = optionsForItem.imageOrVideos.map((r) => r._id);
                        const res = await chatAPI.delChatAll(
                            conversation._id,
                            optionsForItem._id,
                            optionsForItem.id,
                            id_file,
                        );
                        const data: string | null = ServerBusy(res, dispatch);
                        if (data)
                            setConversation((pre) => {
                                if (pre) {
                                    pre.room = pre.room.map((r) => {
                                        if (r._id === optionsForItem._id && r.id === optionsForItem.id) {
                                            r.delete = 'all';
                                            r.text.t = '';
                                            r.imageOrVideos = [];
                                        }
                                        return r;
                                    });
                                }
                                return pre;
                            });
                        setOptions(undefined);
                        setLoading('');
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
                    if (conversation && optionsForItem) {
                        setLoading('Removing...');
                        const res = await chatAPI.delChatSelf(conversation._id, optionsForItem._id, optionsForItem.id);
                        const data: string | null = ServerBusy(res, dispatch);
                        if (data) {
                            const newR = conversation.room.map((r) => {
                                if (r._id === optionsForItem._id && r.id === optionsForItem.id) {
                                    r.delete = optionsForItem.id;
                                    r.updatedAt = data;
                                }
                                return r;
                            });
                            setConversation({ ...conversation, room: newR });
                            setOptions(undefined);
                        }
                        setLoading('');
                    }
                },
            },
            {
                id: 3,
                icon: <ChangeChatI />,
                color: '',
                title: 'Change this text and others still can see your changing',
                top: '-100px',
                onClick: async (id?: number) => {
                    setChangeCus(id);
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
                        setLoading('Deleting...');
                        //  id room and chat
                        const id_file = optionsForItem.imageOrVideos.map((r) => r._id);
                        const res = await chatAPI.delChatAll(
                            conversation._id,
                            optionsForItem._id,
                            optionsForItem.id,
                            id_file,
                        );
                        const data: typeof res = ServerBusy(res, dispatch);
                        if (data) {
                            setConversation((pre) => {
                                if (pre) {
                                    pre.room = pre.room.map((r) => {
                                        if (r._id === optionsForItem._id && r.id === optionsForItem.id) {
                                            r.delete = 'all';
                                            r.text.t = '';
                                            r.imageOrVideos = [];
                                        }
                                        return r;
                                    });
                                }
                                return pre;
                            });
                            setOptions(undefined);
                        }
                        setLoading('');
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
                    if (conversation && optionsForItem) {
                        setLoading('Removing...');
                        const res = await chatAPI.delChatSelf(conversation._id, optionsForItem._id, optionsForItem.id);
                        const data: string | null = ServerBusy(res, dispatch);
                        if (data) {
                            console.log('here');
                            const newR = conversation.room.map((r) => {
                                if (r._id === optionsForItem._id && r.id === optionsForItem.id) {
                                    r.delete = optionsForItem.id;
                                    r.updatedAt = data;
                                }
                                return r;
                            });
                            setConversation({ ...conversation, room: newR });
                            setOptions(undefined);
                        }
                        setLoading('');
                    }
                },
            },
            {
                id: 3,
                icon: <ChangeChatI />,
                color: '',
                title: 'Khi thay đổi tin nhắn người khác sẽ biết ban đã thay đổi',
                top: '-98px',
                onClick: async (id?: number) => {
                    if (conversation && optionsForItem) {
                        //   setChangeCus(id);
                    }
                },
            },
            {
                id: 4,
                icon: <PinI />,
                color: '#d0afaf',
                title: 'Gim',
                top: '-40px',
                onClick: async () => {
                    if (conversation && optionsForItem) {
                        //  const res = await chatAPI.pin(optionsForItem._id, conversation._id,);
                    }
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
    const handleImageUpload = (e: any) => {
        setLoading('Getting file...');
        const files = e.target.files;
        const { upLoad, getFilesToPre } = handleFileUpload(files, 15, 8, 15, dispatch, 'chat');
        setFileUpload({ pre: getFilesToPre, up: upLoad });
        setLoading('');
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
    const handleOnKeyup = (e: any) => {
        if (e.key === 'Enter') {
            // handleSend(conversation?._id, conversation?.user.id);
        } else {
            e.target.setAttribute('style', 'height: auto');
            if (e.key === 'Backspace') {
                e.target.setAttribute(
                    'style',
                    `height: ${value ? e.target.scrollHeight : e.target.scrollHeight - 16}px`,
                );
            } else {
                e.target.setAttribute('style', `height: ${e.target.scrollHeight}px`);
            }
        }
    };
    const handleOnKeyDown = (e: any) => {
        console.log(e.key);
        if (e.key === 'Enter') e.preventDefault();
        if (e.key === '+') {
            e.preventDefault();
            e.target.value += '\n';
        }
    };
    const handleChange = async () => {
        if (
            conversation &&
            optionsForItem &&
            !loading &&
            ((value && value !== optionsForItem.text) || fileUpload?.up.length)
        ) {
            setLoading('updating...');
            const id_files = optionsForItem.imageOrVideos.map((f) => f._id);
            const id_s = uuidv4(); //  id_s if conversation._id doesn't exist
            const vl = value ? encrypt(value, `chat_${conversation._id ? conversation._id : id_s}`) : '';
            const formData = new FormData();
            formData.append('value', vl);
            console.log(fileUpload, 'fileUpload');
            formData.append('roomId', conversation._id);
            formData.append('id_filesDel', JSON.stringify(id_files));
            formData.append('update', 'true');
            formData.append('id_chat', optionsForItem._id); // id of the room
            formData.append('userId', optionsForItem.id); // id of the room
            formData.append('id_other', conversation.user.id); // id of the room
            for (let i = 0; i < fileUpload?.up.length; i++) {
                formData.append('files', fileUpload?.up[i], fileUpload?.up[i]._id); // assign file and _id of the file upload
            }
            const res = await chatAPI.updateChat(formData);
            const data: {
                _id: string;
                id: string;
                text: {
                    t: string;
                    icon: string;
                };
                delete?: string;
                update?: string;
                secondary?: string;
                length?: number;
                imageOrVideos: {
                    v: string;
                    type?: string;
                    icon: string;
                    link?: string;
                    _id: string;
                }[];
                sending?: boolean;
                seenBy: string[];
                updatedAt: string;
                createdAt: string;
            } | null = ServerBusy(res, dispatch);

            if (data) {
                if (data.text.t)
                    data.text.t = decrypt(data.text.t, `chat_${data.secondary ? data.secondary : conversation._id}`);
                const newR: any = await new Promise((resolve, reject) => {
                    //room
                    data.imageOrVideos.map(async (i, index) => {
                        const dataF = await fileGridFS.getFile(i.v, i?.type);
                        const buffer = ServerBusy(dataF, dispatch);
                        if (dataF?.message === 'File not found') {
                            data.imageOrVideos[index].v =
                                dataF?.type?.search('image/') >= 0 ? "Image doesn't exist" : "Video doesn't exist";
                        } else {
                            const base64 = CommonUtils.convertBase64GridFS(buffer);
                            data.imageOrVideos[index].v = base64;
                        }
                    });
                    resolve(data);
                });
                setConversation({
                    ...conversation,
                    room: conversation.room.map((r) => {
                        if (r._id === optionsForItem._id && r.id === optionsForItem.id) {
                            if (fileUpload?.up.length && newR.imageOrVideos) {
                                r.imageOrVideos = newR.imageOrVideos;
                            }
                            r.text.t = newR.text.t;
                        }
                        return r;
                    }),
                });
                setLoading('Change successful');
            } else {
                setLoading('Change failed');
            }
        }
    };
    console.log(conversation, 'conversationA');

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
            {changeCus === 3 && (
                <Div display="block" css="position: absolute; left: 6px; top: 64px;">
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
                            onClick={() => o.onClick(o.id)}
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
            )}
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
                {(optionsForItem.text || value) && (
                    <Div width="100%" css="padding-left: 30%; max-height: 100%;">
                        <Div
                            width="100%"
                            onClick={(e) => e.stopPropagation()}
                            css="justify-content: end;align-items: baseline;     overflow-y: overlay;"
                        >
                            <P
                                z="1.4rem"
                                css={`
                                    white-space: pre;
                                    margin: 0;
                                    padding: 2px 12px 4px;
                                    border-radius: 7px;
                                    border-top-left-radius: 13px;
                                    border-bottom-left-radius: 13px;
                                    background-color: #353636;
                                    border: 1px solid #4e4d4b;
                                    text-wrap: wrap;
                                    width: max-content;
                                    word-wrap: break-word;
                                    max-width: 100%;
                                `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                {value ? value : optionsForItem.text}
                            </P>
                        </Div>
                    </Div>
                )}
                {(fileUpload?.pre.length || optionsForItem.imageOrVideos.length > 0) && (
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
                            {fileUpload?.pre.length
                                ? fileUpload.pre.map((fl) => (
                                      <FileConversation
                                          key={fl._id}
                                          type={fl?.type}
                                          v={fl.link}
                                          ERef={ERef}
                                          del={del}
                                      />
                                  ))
                                : optionsForItem.imageOrVideos.map((fl, index) => (
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
                    justify-content: ${changeCus === 3 ? 'space-between' : 'right'};
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
                {changeCus === 3 && (
                    <DivFlex width="auto">
                        <Div
                            css={`
                                cursor: var(--pointer);
                            `}
                            onClick={() => setEmoji((pre) => !pre)}
                        >
                            🙂
                        </Div>

                        <Div
                            width="34px !important"
                            css={`
                                color: #869ae7;
                                align-items: center;
                                justify-content: center;
                                padding: 5px;
                                cursor: var(--pointer);
                            `}
                        >
                            <form method="post" encType="multipart/form-data" id="formss">
                                <input
                                    id={conversation?._id + 'uploadConOpItem'}
                                    type="file"
                                    name="file[]"
                                    onChange={handleImageUpload}
                                    multiple
                                    hidden
                                />
                                <Label htmlFor={conversation?._id + 'uploadConOpItem'} color={colorText}>
                                    <CameraI />
                                </Label>
                            </form>
                        </Div>
                        {loading && <P z="1.2rem">{loading}</P>}
                    </DivFlex>
                )}
                <Div
                    css={`
                        font-size: 1.4rem;
                        padding: 2px 8px;
                        background-color: #4b4b4b;
                        border-radius: 5px;
                        cursor: var(--pointer);
                    `}
                >
                    {changeCus === 3 ? (
                        <Div
                            width="34px"
                            css={`
                                font-size: 22px;
                                color: #23c3ec;
                                height: 100%;
                                align-items: center;
                                justify-content: center;
                                cursor: ${loading ||
                                (!value && !fileUpload) ||
                                (value === optionsForItem.text && !fileUpload)
                                    ? 'no-drop'
                                    : 'var(--pointer)'};
                            `}
                            onClick={handleChange}
                        >
                            <SendOPTI />
                        </Div>
                    ) : (
                        'Reply'
                    )}
                </Div>
            </Div>
            <Div
                wrap="wrap"
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
                {changeCus === 3 ? (
                    <Div // inserting bar of chat
                        width="100%"
                        css={`
                            height: auto;
                            align-items: center;
                            max-height: 100%;
                            justify-content: space-around;
                        `}
                    >
                        <Textarea
                            ref={textarea}
                            color={colorText}
                            value={value}
                            placeholder="Send"
                            bg="rgb(255 255 255 / 6%)"
                            css={`
                                width: 100%;
                                max-height: 100%;
                                margin: 0;
                                padding: 5px 10px;
                                border-radius: 10px;
                                font-size: 1.4rem !important;
                                overflow-y: overlay;
                                height: 33px;
                                &:disabled {
                                    background-color: #f2f2f2; /* Set a background color */
                                    cursor: not-allowed; /* Change cursor to "not-allowed" */
                                    color: #888; /* Change text color to a subdued gray */
                                }
                            `}
                            onKeyDown={(e) => handleOnKeyDown(e)}
                            onKeyUp={(e) => handleOnKeyup(e)}
                            onChange={(e) => {
                                console.log(e.target.value, 'enter');
                                setValue(e.target.value);
                            }}
                        />
                    </Div>
                ) : (
                    optionsForItemData[lg].map((o) => (
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
                            onClick={() => o.onClick(o.id)}
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
                    ))
                )}
            </Div>
        </Div>
    );
};

export default OptionForItem;
