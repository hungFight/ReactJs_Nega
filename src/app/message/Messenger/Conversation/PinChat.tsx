import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { queryClient } from 'src';
import { PropsUser } from 'src/App';
import { ArrowDownI, LoadingI } from '~/assets/Icons/Icons';
import { DivLoading, DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import chatAPI from '~/restAPI/chatAPI';
import gridFS from '~/restAPI/gridFS';
import CommonUtils from '~/utils/CommonUtils';
import ServerBusy from '~/utils/ServerBusy';
import { decrypt } from '~/utils/crypto';
import { PropsChat, PropsItemRoom, PropsPinC, PropsRooms } from './LogicConver';
import { socket } from 'src/mainPage/nextWeb';
import ItemPin from './ItemPin';

const PinChat: React.FC<{
    pins: PropsPinC[];
    conversationId: string;
    avatar?: string;
    name: string;
    dataFirst: PropsUser;
    user: {
        id: string;
        fullName: string;
        avatar: string | undefined;
        gender: number;
    };
    setChoicePin: React.Dispatch<React.SetStateAction<string>>;
    room: PropsItemRoom[];
    itemPin: PropsPinC | undefined;
    setConversation: React.Dispatch<React.SetStateAction<PropsChat | undefined>>;
    setItemPin: React.Dispatch<React.SetStateAction<PropsPinC | undefined>>;
    one: React.MutableRefObject<boolean>;
}> = ({
    conversationId,
    pins,
    avatar,
    name,
    user,
    dataFirst,
    setChoicePin,
    room,
    itemPin,
    setConversation,
    setItemPin,
    one,
}) => {
    const [more, setMore] = useState<boolean>(false);
    const [otherPin, setOtherPin] = useState<{
        data: PropsRooms;
        pin: PropsPinC;
    }>();
    const coordS = useRef<number>(1);
    const coord = useRef<number>(0);
    const dispatch = useDispatch();
    const check = one.current && pins.length && !itemPin ? true : false;
    const { data, isLoading } = useQuery({
        queryKey: ['Pins chat', conversationId],
        staleTime: 5 * 60 * 1000,
        cacheTime: 6 * 60 * 1000,
        enabled: check && one.current ? true : false,
        queryFn: async () => {
            try {
                const rr: PropsItemRoom[] = await chatAPI.getPins(
                    conversationId,
                    pins
                        .sort((p, a) => moment(p.createdAt).diff(new Date()) - moment(a.createdAt).diff(new Date()))
                        .map((r) => r.chatId),
                );
                const da: typeof rr = ServerBusy(rr, dispatch);
                const newR: typeof rr = await new Promise(async (resolve, reject) => {
                    await Promise.all(
                        da.map(async (d, index) => {
                            if (d.text.t)
                                d.text.t = decrypt(d.text.t, `chat_${d?.secondary ? d.secondary : conversationId}`);
                            await Promise.all(
                                d.imageOrVideos.map(async (f, index2) => {
                                    const aa = await gridFS.getFile(f.v, f?.type);
                                    const buffer = ServerBusy(aa, dispatch);
                                    if (aa?.message === 'File not found') {
                                        rr[index].imageOrVideos[index2].v =
                                            aa?.type?.search('image/') >= 0
                                                ? "Image doesn't exist"
                                                : "Video doesn't exist";
                                    } else {
                                        const base64 = CommonUtils.convertBase64GridFS(buffer);
                                        rr[index].imageOrVideos[index2].v = base64;
                                    }
                                }),
                            );
                        }),
                    );
                    resolve(rr);
                });

                return newR;
            } catch (error) {
                console.log(error);
            }
        },
    });
    console.log(one.current && pins.length && !itemPin ? true : false, isLoading, 'check request');
    if (data && one.current) one.current = false;
    const addPin = useMutation(
        async (newData: PropsItemRoom) => {
            return newData;
        },
        {
            onMutate: (newData) => {
                // Trả về dữ liệu cũ trước khi thêm mới để lưu trữ tạm thời
                const previousData = data ?? [];
                // Cập nhật cache tạm thời với dữ liệu mới
                queryClient.setQueryData(['Pins chat', conversationId], (oldData: any) => {
                    // Thêm newData vào mảng dữ liệu cũ (oldData)
                    console.log(oldData, 'oldData', [newData, ...(oldData ?? [])]);
                    if (itemPin) setItemPin(undefined);
                    return [newData, ...(oldData ?? [])]; //PropsRooms[]
                });

                return { previousData };
            },
            onError: (error, newData, context) => {
                // Xảy ra lỗi, khôi phục dữ liệu cũ từ cache tạm thời
                queryClient.setQueryData(['Pins chat', conversationId], context?.previousData);
            },
            onSettled: () => {
                // Dọn dẹp cache tạm thời sau khi thực hiện mutation
                queryClient.invalidateQueries(['Pins chat', conversationId]);
            },
        },
    );
    const removePin = useMutation(
        async (xd: { roomId: string; pinId: String }) => {
            return xd;
        },
        {
            onMutate: (xd) => {
                // Trả về dữ liệu cũ trước khi thêm mới để lưu trữ tạm thời
                const previousData = data;
                // Cập nhật cache tạm thời với dữ liệu mới
                queryClient.setQueryData(['Pins chat', conversationId], (oldData: any) => {
                    // Thêm newData vào mảng dữ liệu cũ (oldData)
                    setConversation((pre) => {
                        if (pre) return { ...pre, pins: pre.pins.filter((p) => p._id !== xd.pinId) };
                        return pre;
                    });
                    return oldData.filter((od: { _id: string }) => od._id !== xd.roomId); //PropsRooms[]
                });

                return { previousData };
            },
            onError: (error, newData, context) => {
                // Xảy ra lỗi, khôi phục dữ liệu cũ từ cache tạm thời
                queryClient.setQueryData(['Pins chat', conversationId], context?.previousData);
            },
            onSettled: () => {
                // Dọn dẹp cache tạm thời sau khi thực hiện mutation
                queryClient.invalidateQueries(['Pins chat', conversationId]);
            },
        },
    );
    console.log(data, 'conversationPin');

    useEffect(() => {
        if (itemPin) {
            addPin.mutate(room.filter((r) => r._id === itemPin.chatId)[0]);
        }
        socket.on(`conversation_deletedPin_room_${conversationId}`, (data: { pinId: string; roomId: string }) => {
            setConversation((pre) => {
                if (pre) return { ...pre, pins: pre.pins.filter((p) => p._id !== data.pinId) }; // add pin into
                return pre;
            });
            removePin.mutate(data);
            console.log(data, 'deletePin');
        });
        socket.on(`conversation_pins_room_${conversationId}`, async (dataF) => {
            console.log(dataF, 'Add Pin');

            if (!data?.some((r) => r._id === dataF.chatId) && dataF.userId !== dataFirst.id) {
                const rr: PropsItemRoom[] = await chatAPI.getPins(conversationId, [dataF.chatId]);
                const da: typeof rr = ServerBusy(rr, dispatch);
                const newR: typeof rr = await new Promise(async (resolve, reject) => {
                    await Promise.all(
                        da.map(async (d, index) => {
                            if (d.text.t)
                                d.text.t = decrypt(d.text.t, `chat_${d?.secondary ? d.secondary : conversationId}`);
                            await Promise.all(
                                d.imageOrVideos.map(async (f, index2) => {
                                    const aa = await gridFS.getFile(f.v, f?.type);
                                    const buffer = ServerBusy(aa, dispatch);
                                    if (aa?.message === 'File not found') {
                                        rr[index].imageOrVideos[index2].v =
                                            aa?.type?.search('image/') >= 0
                                                ? "Image doesn't exist"
                                                : "Video doesn't exist";
                                    } else {
                                        const base64 = CommonUtils.convertBase64GridFS(buffer);
                                        rr[index].imageOrVideos[index2].v = base64;
                                    }
                                }),
                            );
                        }),
                    );
                    resolve(rr);
                });
                console.log(newR, 'newRPin');
                setConversation((pre) => {
                    if (pre) return { ...pre, pins: [...pre.pins, dataF] }; // add pin into
                    return pre;
                });
                addPin.mutate(newR[0]);
            }
        });
    }, [itemPin]);

    return (
        <Div
            css={`
                user-select: none;
                position: absolute;
                top: 45px;
                left: 0;
                width: 100%;
                background-color: #030303c4;
                transition: all 0.5s linear;
                z-index: 17;
                padding: 5px 0 5px 5px;
                ${more ? 'max-height: 81%; ' : 'max-height: 39px;'}
            `}
        >
            <Div width={more ? '100%' : '93%'} css="position: relative;">
                <DivPos
                    top="-8px"
                    left="-7px"
                    css={`
                        transform: rotate(297deg);
                    `}
                >
                    📌
                </DivPos>
                <DivPos top="17px" left="5px" css="font-size: 1.2rem;">
                    {pins.length}
                </DivPos>
                <Div width="100%" display="block" wrap="wrap" css="overflow-y: overlay; justify-content: center; ">
                    {isLoading && check && (
                        <DivLoading css="margin: 0px;">
                            <LoadingI />
                        </DivLoading>
                    )}
                    {data?.map((r) => {
                        if (pins.some((p) => p.chatId === r._id))
                            return (
                                <ItemPin
                                    coord={coord}
                                    coordS={coordS}
                                    conversationId={conversationId}
                                    removePin={removePin}
                                    key={r._id}
                                    setChoicePin={setChoicePin}
                                    r={r}
                                    setConversation={setConversation}
                                    pins={pins}
                                    dataFirst={dataFirst}
                                    user={user}
                                />
                            );
                    })}
                </Div>
            </Div>
            <Div
                css={`
                    justify-content: center;
                    align-items: center;
                    cursor: var(--pointer);
                    ${more
                        ? 'position: absolute; transform: rotate(178deg); right: 8px; top: 16px; height: 30px; width: 30px; font-size: 20px; background-color: #2b2b2bf2; border-radius: 50%;'
                        : 'width: 7%;'}
                `}
                onClick={() => setMore(!more)}
            >
                <ArrowDownI />
            </Div>
        </Div>
    );
};

export default PinChat;
