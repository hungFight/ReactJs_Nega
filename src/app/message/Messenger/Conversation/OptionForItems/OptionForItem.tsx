import React, { useRef, useState } from 'react';
import { CameraI, ChangeChatI, DelAllI, DelSelfI, PinI, RemoveCircleI, SendOPTI } from '~/assets/Icons/Icons';
import { Div, DivFlex, P } from '~/reUsingComponents/styleComponents/styleDefault';
import FileConversation from '../../File';
import chatAPI from '~/restAPI/chatAPI';
import { useDispatch } from 'react-redux';
import { Label, Textarea } from '~/Pages/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';
import handleFileUpload from '~/utils/handleFileUpload';
import { encrypt } from '~/utils/crypto';
import fileWorkerAPI from '~/restAPI/fileWorkerAPI';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'src';
import { PropsImageOrVideosAtMessenger, PropsItemQueryChat, PropsItemRoom, PropsPinC } from '~/typescript/messengerType';
import { PropsChat } from '../LogicConver';
import useLanguages from '~/reUsingComponents/hook/useLanguage';

export interface PropsOptionForItem {
    _id: string;
    userId: string;
    text: string;
    secondary?: string | undefined;
    who: string;
    byWhoCreatedAt: string;
    id_pin?: string;
    imageOrVideos: PropsImageOrVideosAtMessenger[];
    roomId: string;
    filterId: string;
}
const OptionForItem: React.FC<{
    setOptions: React.Dispatch<React.SetStateAction<PropsOptionForItem | undefined>>;
    optionsForItem: PropsOptionForItem;
    itemPin: PropsPinC | undefined;
    ERef: React.MutableRefObject<any>;
    del: React.MutableRefObject<HTMLDivElement | null>;
    conversation: PropsChat;
    colorText: string;
    setEmoji: React.Dispatch<React.SetStateAction<boolean>>;
    setItemPin: React.Dispatch<React.SetStateAction<PropsPinC | undefined>>;
    id_you: string;
    setRoomImage: React.Dispatch<
        React.SetStateAction<
            | {
                  id_room: string;
                  id_file: string;
              }
            | undefined
        >
    >;
    roomImage:
        | {
              id_room: string;
              id_file: string;
          }
        | undefined;
    itemPinData: React.MutableRefObject<PropsItemRoom[]>;
}> = ({ setOptions, optionsForItem, ERef, del, conversation, colorText, setEmoji, setItemPin, id_you, setRoomImage, roomImage, itemPin, itemPinData }) => {
    const { lg } = useLanguages();
    const [value, setValue] = useState<string>('');
    const [loading, setLoading] = useState<string>('');
    const textarea = useRef<HTMLTextAreaElement | null>(null);
    const [fileUpload, setFileUpload] = useState<{ pre: { _id: string; link: any; type: string }[]; up: any }>();
    const [changeCus, setChangeCus] = useState<string | undefined>(undefined);
    const [replyText, setReplyText] = useState<string>('');
    const dispatch = useDispatch();
    const upPin = useMutation(
        // update data in useQuery
        async (newData: { file: PropsImageOrVideosAtMessenger[] | undefined; text: string }) => {
            return newData;
        },
        {
            onMutate: (newData) => {
                // Trả về dữ liệu cũ trước khi thêm mới để lưu trữ tạm thời
                const previousData = itemPinData.current ?? [];
                // Cập nhật cache tạm thời với dữ liệu mới
                queryClient.setQueryData(['Pins chat', conversation._id], (oldData: any) => {
                    //PropsItemRoom[]
                    if (optionsForItem.id_pin) {
                        oldData.map((t: { _id: string; imageOrVideos: PropsImageOrVideosAtMessenger[]; text: { t: string } }) => {
                            if (t._id === optionsForItem._id) {
                                if (newData.file) t.imageOrVideos = newData.file;
                                if (newData.text) t.text.t = newData.text;
                            }
                            return t;
                        });
                    }
                    return oldData; //PropsRooms[]
                });

                return { previousData };
            },
            onError: (error, newData, context) => {
                // Xảy ra lỗi, khôi phục dữ liệu cũ từ cache tạm thời
                queryClient.setQueryData(['Pins chat', conversation._id], context?.previousData);
            },
            onSettled: () => {
                // Dọn dẹp cache tạm thời sau khi thực hiện mutation
                queryClient.invalidateQueries(['Pins chat', conversation._id]);
            },
        },
    );
    const optionsForItemDataYou: {
        [en: string]: {
            id: string;
            icon: JSX.Element;
            color: string;
            title: string;
            top: string;
            onClick: (id?: string) => void;
        }[];
        vi: {
            id: string;
            icon: JSX.Element;
            color: string;
            title: string;
            top: string;
            onClick: (id?: string) => void;
        }[];
    } = {
        en: [
            {
                id: 'deleteData',
                icon: <DelAllI />,
                color: '#67b5f8',
                title: 'Remove both side can not see this text',
                top: '-80px',
                onClick: async () => {
                    if (conversation && optionsForItem) {
                        setLoading('Deleting...');
                        //  id room and chat
                        const id_file = optionsForItem.imageOrVideos.map((r) => r._id);
                        if (id_file.length) fileWorkerAPI.deleteFileImg(dispatch, id_file);
                        const data = await chatAPI.delChatAll(dispatch, {
                            conversationId: conversation._id,
                            dataId: optionsForItem._id,
                            roomId: optionsForItem.roomId,
                            filterId: optionsForItem.filterId,
                            userId: optionsForItem.userId,
                        });
                        if (data)
                            queryClient.setQueryData(['getItemChats', conversation.user.id + '_' + id_you], (preData: PropsItemQueryChat) => {
                                if (preData) {
                                    conversation.rooms.map((da) => {
                                        if (da._id === optionsForItem.roomId) {
                                            da.filter.map((fl) => {
                                                if (fl._id === optionsForItem.filterId) {
                                                    fl.data.map((r) => {
                                                        if (r._id === optionsForItem._id) {
                                                            r.text.t = '';
                                                            r.imageOrVideos = [];
                                                            r.delete = 'all';
                                                            r.updatedAt = data;
                                                        }
                                                        return r;
                                                    });
                                                }
                                                return fl;
                                            });
                                        }
                                        return da;
                                    });
                                    return { ...preData, data: conversation };
                                }
                                return preData;
                            });

                        setOptions(undefined);
                        setLoading('');
                    }
                },
            },
            {
                id: 'deleteSelf',
                icon: <DelSelfI />,
                color: '#67b5f8',
                title: 'Remove only you can not see this text',
                top: '-80px',
                onClick: async () => {
                    if (conversation && optionsForItem) {
                        setLoading('Removing...');
                        const data = await chatAPI.delChatSelf(dispatch, {
                            conversationId: conversation._id,
                            dataId: optionsForItem._id,
                            roomId: optionsForItem.roomId,
                            filterId: optionsForItem.filterId,
                        });
                        if (data) {
                            console.log('here');
                            queryClient.setQueryData(['getItemChats', conversation.user.id + '_' + id_you], (preData: PropsItemQueryChat) => {
                                if (preData) {
                                    conversation.rooms.map((da) => {
                                        if (da._id === optionsForItem.roomId) {
                                            da.filter.map((fl) => {
                                                if (fl._id === optionsForItem.filterId) {
                                                    fl.data.map((r) => {
                                                        if (r._id === optionsForItem._id) {
                                                            r.delete = id_you;
                                                            r.updatedAt = data;
                                                        }
                                                        return r;
                                                    });
                                                }
                                                return fl;
                                            });
                                        }
                                        return da;
                                    });
                                    return { ...preData, data: conversation };
                                }
                                return preData;
                            });
                            setOptions(undefined);
                        }
                        setLoading('');
                    }
                },
            },
            {
                id: 'changeChat',
                icon: <ChangeChatI />,
                color: '',
                title: 'Change this text and others still can see your changing',
                top: '-100px',
                onClick: async (id?: string) => {
                    setChangeCus(id);
                    // const res = await sendChatAPi.getChat
                },
            },
            {
                id: 'pin',
                icon: <PinI />,
                color: '#d0afaf',
                title: 'Pin',
                top: '-40px',
                onClick: async () => {
                    if (conversation && optionsForItem) {
                        if (!conversation.pins.some((p) => p.chatId === optionsForItem._id)) {
                            const res = await chatAPI.pin(dispatch, {
                                userId: optionsForItem.userId,
                                conversationId: conversation._id,
                                roomId: optionsForItem.roomId,
                                filterId: optionsForItem.filterId,
                                dataId: optionsForItem._id,
                            });
                            if (res) {
                                // setConversation((pre) => {
                                //     if (pre) return { ...pre, pins: [res, ...pre.pins] }; // add pin into
                                //     return pre;
                                // });
                                // setItemPin(res);
                            }
                        }
                        setOptions(undefined);
                    }
                },
            },
        ],
        vi: [
            {
                id: 'deleteData',
                icon: <DelAllI />,
                color: '#67b5f8',
                title: 'Khi xoá cả 2 bên sẽ đều không nhìn thấy tin nhắn này',
                top: '-100px',
                onClick: async () => {
                    if (conversation && optionsForItem) {
                        setLoading('Deleting...');
                        //  id room and chat
                        const id_file = optionsForItem.imageOrVideos.map((r) => r._id);
                        if (id_file.length) fileWorkerAPI.deleteFileImg(dispatch, id_file);
                        const data = await chatAPI.delChatAll(dispatch, {
                            conversationId: conversation._id,
                            dataId: optionsForItem._id,
                            roomId: optionsForItem.roomId,
                            filterId: optionsForItem.filterId,
                            userId: optionsForItem.userId,
                        });
                        if (data)
                            queryClient.setQueryData(['getItemChats', conversation.user.id + '_' + id_you], (preData: PropsItemQueryChat) => {
                                if (preData) {
                                    conversation.rooms.map((da) => {
                                        if (da._id === optionsForItem.roomId) {
                                            da.filter.map((fl) => {
                                                if (fl._id === optionsForItem.filterId) {
                                                    fl.data.map((r) => {
                                                        if (r._id === optionsForItem._id) {
                                                            r.text.t = '';
                                                            r.imageOrVideos = [];
                                                            r.delete = 'all';
                                                            r.updatedAt = data;
                                                        }
                                                        return r;
                                                    });
                                                }
                                                return fl;
                                            });
                                        }
                                        return da;
                                    });
                                    return { ...preData, data: conversation };
                                }
                                return preData;
                            });

                        setOptions(undefined);
                        setLoading('');
                    }
                },
            },
            {
                id: 'deleteSelf',
                icon: <DelSelfI />,
                color: '#67b5f8',
                title: 'Khi xoá thi chỉ mình bạn không nhìn thấy tin nhắn này',
                top: '-100px',
                onClick: async () => {
                    if (conversation && optionsForItem) {
                        setLoading('Removing...');
                        const data = await chatAPI.delChatSelf(dispatch, {
                            conversationId: conversation._id,
                            dataId: optionsForItem._id,
                            roomId: optionsForItem.roomId,
                            filterId: optionsForItem.filterId,
                        });
                        if (data) {
                            console.log('here');
                            queryClient.setQueryData(['getItemChats', conversation.user.id + '_' + id_you], (preData: PropsItemQueryChat) => {
                                if (preData) {
                                    conversation.rooms.map((da) => {
                                        if (da._id === optionsForItem.roomId) {
                                            da.filter.map((fl) => {
                                                if (fl._id === optionsForItem.filterId) {
                                                    fl.data.map((r) => {
                                                        if (r._id === optionsForItem._id) {
                                                            r.delete = id_you;
                                                            r.updatedAt = data;
                                                        }
                                                        return r;
                                                    });
                                                }
                                                return fl;
                                            });
                                        }
                                        return da;
                                    });
                                    return { ...preData, data: conversation };
                                }
                                return preData;
                            });
                            setOptions(undefined);
                        }
                        setLoading('');
                    }
                },
            },
            {
                id: 'changeChat',
                icon: <ChangeChatI />,
                color: '',
                title: 'Khi thay đổi tin nhắn người khác sẽ biết ban đã thay đổi',
                top: '-98px',
                onClick: async (id?: string) => {
                    setChangeCus(id);
                },
            },
            {
                id: 'pin',
                icon: <PinI />,
                color: '#d0afaf',
                title: 'Gim',
                top: '-40px',
                onClick: async () => {
                    // if (conversation && optionsForItem) {
                    //     if (!conversation.pins.some((p) => p.chatId === optionsForItem._id)) {
                    //         const res = await chatAPI.pin(optionsForItem._id, optionsForItem.id, conversation._id, conversation.room[0]._id);
                    //         if (res) {
                    //             setConversation((pre) => {
                    //                 if (pre) return { ...pre, pins: [res, ...pre.pins] }; // add pin into
                    //                 return pre;
                    //             });
                    //             setItemPin(res);
                    //         }
                    //     }
                    //     setOptions(undefined);
                    // }
                },
            },
        ],
    };
    const optionsForItemDataOthers: {
        [en: string]: {
            id: string;
            icon: JSX.Element;
            color: string;
            title: string;
            top: string;
            onClick: (id?: string) => void;
        }[];
        vi: {
            id: string;
            icon: JSX.Element;
            color: string;
            title: string;
            top: string;
            onClick: (id?: string) => void;
        }[];
    } = {
        en: [
            {
                id: 'deleteSelf',
                icon: <DelSelfI />,
                color: '#67b5f8',
                title: 'Remove only you can not see this text',
                top: '-80px',
                onClick: async () => {
                    if (conversation && optionsForItem) {
                        setLoading('Removing...');
                        const data = await chatAPI.delChatSelf(dispatch, {
                            conversationId: conversation._id,
                            dataId: optionsForItem._id,
                            roomId: optionsForItem.roomId,
                            filterId: optionsForItem.filterId,
                        });
                        if (data) {
                            queryClient.setQueryData(['getItemChats', conversation.user.id + '_' + id_you], (preData: PropsItemQueryChat) => {
                                if (preData) {
                                    conversation.rooms.map((da) => {
                                        if (da._id === optionsForItem.roomId) {
                                            da.filter.map((fl) => {
                                                if (fl._id === optionsForItem.filterId) {
                                                    fl.data.map((r) => {
                                                        if (r._id === optionsForItem._id) {
                                                            r.delete = id_you;
                                                            r.updatedAt = data;
                                                        }
                                                        return r;
                                                    });
                                                }
                                                return fl;
                                            });
                                        }
                                        return da;
                                    });
                                    return { ...preData, data: conversation };
                                }
                                return preData;
                            });
                            setOptions(undefined);
                        }
                        setLoading('');
                    }
                },
            },
            {
                id: 'pin',
                icon: <PinI />,
                color: '#d0afaf',
                title: 'Pin',
                top: '-40px',
                onClick: async () => {
                    // if (conversation && optionsForItem) {
                    //     if (!conversation.pins.some((p) => p.chatId === optionsForItem._id)) {
                    //         const res = await chatAPI.pin(optionsForItem._id, optionsForItem.id, conversation._id, conversation.room[0]._id);
                    //         if (res) {
                    //             setConversation((pre) => {
                    //                 if (pre) return { ...pre, pins: [res, ...pre.pins] }; // add pin into
                    //                 return pre;
                    //             });
                    //             setItemPin(res);
                    //         }
                    //     }
                    //     setOptions(undefined);
                    // }
                },
            },
            {
                id: 'reply',
                icon: <SendOPTI />,
                color: colorText,
                title: 'Reply',
                top: '-40px',
                onClick: (id?: string) => {
                    setChangeCus(id);
                },
            },
        ],
        vi: [
            {
                id: 'deleteSelf',
                icon: <DelSelfI />,
                color: '#67b5f8',
                title: 'Khi xoá thi chỉ mình bạn không nhìn thấy tin nhắn này',
                top: '-100px',
                onClick: async () => {
                    if (conversation && optionsForItem) {
                        setLoading('Removing...');
                        const data = await chatAPI.delChatSelf(dispatch, {
                            conversationId: conversation._id,
                            dataId: optionsForItem._id,
                            roomId: optionsForItem.roomId,
                            filterId: optionsForItem.filterId,
                        });
                        if (data) {
                            queryClient.setQueryData(['getItemChats', conversation.user.id + '_' + id_you], (preData: PropsItemQueryChat) => {
                                if (preData) {
                                    conversation.rooms.map((da) => {
                                        if (da._id === optionsForItem.roomId) {
                                            da.filter.map((fl) => {
                                                if (fl._id === optionsForItem.filterId) {
                                                    fl.data.map((r) => {
                                                        if (r._id === optionsForItem._id) {
                                                            r.delete = id_you;
                                                            r.updatedAt = data;
                                                        }
                                                        return r;
                                                    });
                                                }
                                                return fl;
                                            });
                                        }
                                        return da;
                                    });
                                    return { ...preData, data: conversation };
                                }
                                return preData;
                            });
                            setOptions(undefined);
                        }
                        setLoading('');
                    }
                },
            },

            {
                id: 'pin',
                icon: <PinI />,
                color: '#d0afaf',
                title: 'Gim',
                top: '-40px',
                onClick: async () => {
                    // if (conversation && optionsForItem) {
                    //     if (!conversation.pins.some((p) => p.chatId === optionsForItem._id)) {
                    //         const res = await chatAPI.pin(optionsForItem._id, optionsForItem.id, conversation._id, conversation.room[0]._id);
                    //         if (res) {
                    //             setConversation((pre) => {
                    //                 if (pre) return { ...pre, pins: [res, ...pre.pins] }; // add pin into
                    //                 return pre;
                    //             });
                    //             setItemPin(res);
                    //         }
                    //     }
                    //     setOptions(undefined);
                    // }
                },
            },
            {
                id: 'reply',
                icon: <SendOPTI />,
                color: colorText,
                title: 'Reply',
                top: '-40px',
                onClick: (id?: string) => {
                    setChangeCus(id);
                },
            },
        ],
    };
    const handleImageUpload = async (e: any) => {
        setLoading('Getting file...');
        const files = e.target.files;
        const { upLoad, getFilesToPre } = await handleFileUpload(files, 15, 8, 15, dispatch, 'chat', true);
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
                e.target.setAttribute('style', `height: ${value ? e.target.scrollHeight : e.target.scrollHeight - 16}px`);
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
    console.log(optionsForItem, 'optionsForItem');

    const handleChange = async () => {
        if (conversation && optionsForItem && !loading && ((value && value !== optionsForItem.text) || fileUpload?.up.length)) {
            setLoading('updating...');
            const id_files = optionsForItem.imageOrVideos.map((f) => f._id);
            const vl = value ? encrypt(value, `chat_${optionsForItem.secondary ? optionsForItem.secondary : conversation._id}`) : '';
            const formData = new FormData();
            for (let i = 0; i < fileUpload?.up.length; i++) {
                formData.append('file', fileUpload?.up[i]); // assign file and _id of the file upload
            }
            const value_added = fileUpload?.up.length ? await fileWorkerAPI.addFiles(dispatch, formData) : [];
            const vlAt = {
                value: vl,
                conversationId: conversation._id,
                update: 'true',
                dataId: optionsForItem._id,
                userId: optionsForItem.userId,
                roomId: optionsForItem.roomId,
                filterId: optionsForItem.filterId,
                id_other: conversation.user.id,
                filesId: value_added,
                old_ids: id_files,
            };
            const data = await chatAPI.updateChat(dispatch, vlAt);
            if (data) {
                queryClient.setQueryData(['getItemChats', conversation.user.id + '_' + id_you], (preData: PropsItemQueryChat) => {
                    if (preData) {
                        conversation.rooms.map((da) => {
                            if (da._id === optionsForItem.roomId) {
                                da.filter.map((fl) => {
                                    if (fl._id === optionsForItem.filterId) {
                                        fl.data.map((r) => {
                                            if (r._id === optionsForItem._id) {
                                                if (value) r.text.t = value;
                                                if (data?.imageOrVideos.length) r.imageOrVideos = data?.imageOrVideos;
                                            }
                                            return r;
                                        });
                                    }
                                    return fl;
                                });
                            }
                            return da;
                        });
                        return { ...preData, data: conversation };
                    }
                    return preData;
                });
                setLoading('Change successful');
                setChangeCus(undefined);
                setOptions(undefined);
            } else {
                setLoading('Change failed');
            }
        }
    };
    const handleReply = async () => {
        // if (conversation && optionsForItem && !loading && ((replyText && replyText !== optionsForItem.text) || fileUpload?.up.length)) {
        //     if (ERef.current) ERef.current.scrollTop = 0;
        //     textarea.current?.setAttribute('style', 'height: 33px');
        //     setValue('');
        //     setLoading('sending...');
        //     const images = fileUpload?.pre
        //         ? fileUpload?.pre?.map((i) => {
        //               return { _id: i._id, v: i.link, type: i.type, icon: '' }; // get key for _id
        //           })
        //         : [];
        //     const id_ = uuidv4();
        //     const chat: any = {
        //         createdAt: DateTime(),
        //         imageOrVideos: images,
        //         seenBy: [],
        //         text: { t: replyText, icon: '' },
        //         sending: true,
        //         id: id_you,
        //         _id: id_,
        //         reply: {
        //             id_reply: id_you,
        //             id_replied: optionsForItem.id,
        //             text: optionsForItem.text,
        //             id_room: optionsForItem._id,
        //             imageOrVideos: optionsForItem.imageOrVideos,
        //         },
        //     };
        //     if (conversation) conversation.room.unshift(chat);
        //     const formData = new FormData();
        //     formData.append('value', encrypt(replyText, `chat_${conversation._id}`));
        //     if (conversation._id) formData.append('conversationId', conversation._id); // conversation._id
        //     formData.append(
        //         'reply',
        //         JSON.stringify({
        //             id_room: optionsForItem._id,
        //             id_reply: id_you,
        //             id_replied: optionsForItem.id,
        //             text: encrypt(optionsForItem.text, `chat_${conversation._id}`),
        //             imageOrVideos: optionsForItem.imageOrVideos.map((i) => ({
        //                 _id: i._id,
        //                 v: '',
        //                 type: i.type,
        //                 icon: '',
        //             })),
        //             byWhoCreatedAt: optionsForItem.byWhoCreatedAt,
        //         }),
        //     ); // id of the room
        //     formData.append('id_room', id_);
        //     if (optionsForItem) formData.append('id_others', optionsForItem.id);
        //     for (let i = 0; i < fileUpload?.up.length; i++) {
        //         formData.append('files', fileUpload?.up[i], fileUpload?.up[i]._id); // assign file and _id of the file upload
        //     }
        //     const res = await chatAPI.send(formData);
        //     const data: PropsRoomChat | undefined = ServerBusy(res, dispatch);
        //     if (data && conversation) {
        //         conversation.room.map((r) => {
        //             if (r.sending) r.sending = false;
        //         });
        //         if (!conversation._id) conversation._id = data._id; // add id when id is empty
        //         setConversation(conversation);
        //         data.users.push(conversation.user);
        //         setFileUpload(undefined);
        //         setOptions(undefined);
        //         setLoading('');
        //         dispatch(setRoomChat(data));
        //     }
        // }
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
                z-index: 99999;
                bottom: 0;
                justify-content: center;
                padding: 10px;
                overflow: hidden;
            `}
        >
            {changeCus === 'changeChat' && (
                <Div display="block" css="position: absolute; left: 6px; top: 64px;">
                    {(optionsForItem.who === 'you' ? optionsForItemDataYou : optionsForItemDataOthers)[lg].map((o) => (
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
                            // onClick={() => o.onClick(o.id)}
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
                    overflow: overlay;
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
                        <Div width="100%" onClick={(e) => e.stopPropagation()} css="justify-content: end;align-items: baseline;     overflow-y: overlay;">
                            <P
                                z="1.4rem"
                                css={`
                                    white-space: pre;
                                    margin: 0;
                                    padding: 2px 12px 4px;
                                    border-radius: 7px;
                                    border-top-left-radius: 13px;
                                    border-bottom-left-radius: 13px;
                                    background-color: ${optionsForItem.who === 'you' ? '#1a383b' : '#272727bd'};
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
                            width: 100%;
                            align-items: center;
                            padding: 10px;
                            padding-left: 20%;
                            margin-top: 6px;
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
                                    border: 2px solid #b951b9;
                                }
                            `}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {changeCus !== 'reply' && fileUpload?.pre.length
                                ? fileUpload.pre.map((fl) => <FileConversation key={fl._id} type={fl?.type} id_pre={fl.link} />)
                                : optionsForItem.imageOrVideos.map((fl, index) => <FileConversation key={fl._id} type={fl?.type} id_file={fl._id} icon={fl.icon} />)}
                        </Div>
                    </Div>
                )}

                {replyText && (
                    <Div width="100%" css="padding-right: 30%; max-height: 100%; margin-top: 15px;">
                        <Div width="100%" onClick={(e) => e.stopPropagation()} css="justify-content: start;align-items: baseline; overflow-y: overlay;">
                            <P
                                z="1.4rem"
                                css={`
                                    white-space: pre;
                                    margin: 0;
                                    padding: 2px 12px 4px;
                                    border-radius: 7px;
                                    border-top-left-radius: 13px;
                                    border-bottom-left-radius: 13px;
                                    background-color: #148a6ebd;
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
                                {replyText}
                            </P>
                        </Div>
                    </Div>
                )}
                {(fileUpload?.pre.length || optionsForItem.imageOrVideos.length > 0) && changeCus === 'reply' && (
                    <Div
                        width="100%"
                        css={`
                            height: auto;
                            width: 71%;
                            align-items: center;
                            margin-top: 6px;
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
                                justify-content: left;
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
                                    border: 2px solid #686767;
                                }
                            `}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {fileUpload?.pre.map((fl) => (
                                <FileConversation key={fl._id} type={fl?.type} id_pre={fl.link} />
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
                    position: relative;
                    padding: 0 5px;
                    align-items: center;
                    animation: chatMove 0.5s linear;
                    justify-content: ${changeCus === 'changeChat' ? 'space-between' : 'right'};
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
                {(changeCus === 'changeChat' || changeCus === 'reply') && (
                    <DivFlex
                        width="auto"
                        css={`
                            ${changeCus === 'reply' ? 'position: absolute; top: -30px; left: 10px;' : ''}
                        `}
                    >
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
                                <input id={conversation?._id + 'uploadConOpItem'} type="file" name="file[]" onChange={handleImageUpload} multiple hidden />
                                <Label htmlFor={conversation?._id + 'uploadConOpItem'} color={colorText}>
                                    <CameraI />
                                </Label>
                            </form>
                        </Div>
                        {loading && <P z="1.2rem">{loading}</P>}
                    </DivFlex>
                )}
                {changeCus === 'reply' && (
                    <Textarea
                        ref={textarea}
                        color={colorText}
                        value={replyText}
                        placeholder="Send"
                        bg="rgb(255 255 255 / 6%)"
                        css={`
                            width: 100%;
                            max-height: 144px;
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
                            setReplyText(e.target.value);
                        }}
                    />
                )}
                {(optionsForItem.userId !== id_you || changeCus === 'changeChat') && (
                    <Div
                        css={`
                            font-size: 1.4rem;
                            padding: 2px 8px;
                            border-radius: 5px;
                            align-items: center;
                            cursor: var(--pointer);
                        `}
                    >
                        {changeCus === 'changeChat' ? (
                            <Div
                                width="34px"
                                css={`
                                    font-size: 22px;
                                    color: #23c3ec;
                                    height: 100%;
                                    align-items: center;
                                    justify-content: center;
                                    cursor: ${loading || (!value && !fileUpload) || (value === optionsForItem.text && !fileUpload) ? 'no-drop' : 'var(--pointer)'};
                                `}
                                onClick={handleChange}
                            >
                                <SendOPTI />
                            </Div>
                        ) : (
                            changeCus === 'reply' && (
                                <>
                                    <Div
                                        width="34px"
                                        css={`
                                            font-size: 22px;
                                            color: #23c3ec;
                                            height: 100%;
                                            align-items: center;
                                            justify-content: center;
                                            cursor: ${loading || (!replyText && !fileUpload) || (replyText === optionsForItem.text && !fileUpload) ? 'no-drop' : 'var(--pointer)'};
                                        `}
                                        onClick={handleReply}
                                    >
                                        <SendOPTI />
                                    </Div>
                                </>
                            )
                        )}
                    </Div>
                )}
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
                {changeCus === 'changeChat' ? (
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
                    (optionsForItem.who === 'you' ? optionsForItemDataYou : optionsForItemDataOthers)[lg].map((o) => (
                        <Div
                            key={o.id}
                            css={`
                                position: relative;
                                margin: 4px;
                                height: fit-content;
                                font-size: 25px;
                                padding: 2px;
                                color: ${o.color};
                                ${o.id === changeCus ? 'border-bottom: 1px solid #7b7b7b;' : ''}
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
