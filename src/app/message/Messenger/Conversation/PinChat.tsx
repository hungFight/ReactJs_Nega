import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { queryClient } from 'src';
import { ArrowDownI, LoadingI } from '~/assets/Icons/Icons';
import { DivLoading, DivFlexPosition } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import chatAPI from '~/restAPI/chatAPI';
import CommonUtils from '~/utils/ClassFile';
import ServerBusy from '~/utils/ServerBusy';
import { decrypt } from '~/utils/crypto';
import { socket } from 'src/mainPage/NextWeb';
import ItemPin from './ItemPin';
import { PropsItemRoom, PropsPinC } from '~/typescript/messengerType';
import { PropsChat } from './LogicConver';
import { PropsUser } from '~/typescript/userType';

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
    rooms: PropsItemRoom[];
    itemPin: PropsPinC | undefined;
    setConversation: React.Dispatch<React.SetStateAction<PropsChat | undefined>>;
    setItemPin: React.Dispatch<React.SetStateAction<PropsPinC | undefined>>;
    one: React.MutableRefObject<boolean>;
    itemPinData: React.MutableRefObject<PropsItemRoom[]>;
}> = ({ conversationId, pins, avatar, name, user, dataFirst, setChoicePin, rooms, itemPin, setConversation, setItemPin, one, itemPinData }) => {
    const dispatch = useDispatch();
    const [more, setMore] = useState<boolean>(false);
    const [otherPin, setOtherPin] = useState<{
        data: PropsItemRoom;
        pin: PropsPinC;
    }>();
    const coordS = useRef<number>(1);
    const coord = useRef<number>(0);
    const check = one.current && pins.length && !itemPin ? true : false;
    const { data, isLoading } = useQuery({
        queryKey: ['Pins chat', conversationId],
        staleTime: 5 * 60 * 1000, // 5m
        cacheTime: 6 * 60 * 1000, // 6m
        enabled: check && one.current ? true : false,
        queryFn: async () => {
            try {
                const rr: PropsItemRoom[] = await chatAPI.getPins(
                    dispatch,
                    conversationId,
                    pins.sort((p, a) => moment(p.createdAt).diff(new Date()) - moment(a.createdAt).diff(new Date())).map((r) => r.chatId),
                );
                rr.map(async (r, index) => {
                    return r.filter.map((f) => {
                        return f.data.map((d) => {
                            if (d.text.t) d.text.t = decrypt(d.text.t, `chat_${d?.secondary ? d.secondary : conversationId}`);
                            return d;
                        });
                    });
                });
                itemPinData.current = rr;
                return rr;
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
                    itemPinData.current = [newData, ...(oldData ?? [])];
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
                // queryClient.invalidateQueries(['Pins chat', conversationId]);
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
                    itemPinData.current = oldData.filter((od: { _id: string }) => od._id !== xd.roomId);
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
            addPin.mutate(rooms.filter((r) => r._id === itemPin.chatId)[0]);
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
                const rr: PropsItemRoom[] = await chatAPI.getPins(dispatch, conversationId, [dataF.chatId]);
                rr.map(async (r, index) => {
                    return r.filter.map((f) => {
                        return f.data.map((d) => {
                            if (d.text.t) d.text.t = decrypt(d.text.t, `chat_${d?.secondary ? d.secondary : conversationId}`);
                            return d;
                        });
                    });
                });
                setConversation((pre) => {
                    if (pre) return { ...pre, pins: [...pre.pins, dataF] }; // add pin into
                    return pre;
                });
                addPin.mutate(rr[0]);
            }
        });
    }, [itemPin]);

    return (
        <Div
            css={`
                user-select: none;
                position: absolute;
                top: 64px;
                left: 0;
                width: 100%;
                background-color: #030303c4;
                transition: all 0.5s linear;
                z-index: 23;
                padding: 5px 0 5px 5px;
                ${more ? 'max-height: 81%; ' : 'max-height: 39px;'}
                @media(min-width: 768px) {
                    top: 45px;
                }
            `}
        >
            <Div
                width={more ? '100%' : '90%'}
                css={`
                    position: relative;
                    ${more ? '' : 'pointer-events: none;'}
                `}
            >
                <DivFlexPosition
                    top="-8px"
                    left="-7px"
                    index={24}
                    css={`
                        transform: rotate(297deg);
                    `}
                >
                    📌
                </DivFlexPosition>
                <DivFlexPosition top="17px" index={24} left="5px" css="font-size: 1.2rem;">
                    {pins.length}
                </DivFlexPosition>
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
                    margin: auto;
                    font-size: 24px;
                    padding: 4px;
                    cursor: var(--pointer);
                    ${more
                        ? 'position: absolute; transform: rotate(178deg); right: 8px; top: 16px; height: 30px; width: 30px; font-size: 20px; background-color: #2b2b2bf2; border-radius: 50%;'
                        : 'width: 7%;'}
                    @media(min-width: 500px) {
                    }
                `}
                onClick={() => setMore(!more)}
            >
                <ArrowDownI />
            </Div>
        </Div>
    );
};

export default PinChat;
