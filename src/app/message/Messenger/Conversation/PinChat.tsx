import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ArrowDownI, ClockCirclesI, DotI } from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import Player from '~/reUsingComponents/Videos/Player';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import chatAPI from '~/restAPI/chatAPI';
import gridFS from '~/restAPI/gridFS';
import CommonUtils from '~/utils/CommonUtils';
import ServerBusy from '~/utils/ServerBusy';
import { decrypt } from '~/utils/crypto';

const PinChat: React.FC<{
    pins: {
        chatId: string;
        userId: string;
        createdAt: string;
    }[];
    conversationId: string;
    avatar?: string;
    name: string;
    gender: number;
}> = ({ conversationId, pins, avatar, name, gender }) => {
    const [more, setMore] = useState<boolean>(false);
    const dispatch = useDispatch();
    const { data } = useQuery({
        queryKey: ['Pins chat', conversationId],
        cacheTime: 60 * 1000,
        queryFn: async () => {
            const rr: {
                _id: string;
                id: string;
                text: { icon: string; t: string };
                imageOrVideos: { v: string; icon: string; _id: string; type: string }[];
                seenBy: string[];
                secondary?: string;
                createdAt: string;
            }[] = await chatAPI.getPins(
                conversationId,
                pins.map((r) => r.chatId),
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
                                        aa?.type?.search('image/') >= 0 ? "Image doesn't exist" : "Video doesn't exist";
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
        },
    });
    return (
        <Div
            css={`
                position: absolute;
                top: 50px;
                left: 0;
                width: 100%;
                background-color: #030303c4;
                transition: all 0.5s linear;
                z-index: 12;
                padding: 5px;
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
                    {data?.map((r) => {
                        return (
                            <Div
                                key={r._id}
                                width="100%"
                                css="margin: 2px 0; cursor: var(--pointer); align-items: center; background-color: #19191aa6; padding: 5px 10px; padding-left: 22px; justify-content: space-between;"
                            >
                                <Div width="73%" css="align-items: center; max-width: 73%;">
                                    <Avatar
                                        src={avatar}
                                        alt={name}
                                        radius="50%"
                                        gender={gender}
                                        css={`
                                            width: 20px;
                                            height: 20px;
                                            margin-right: 8px;
                                            min-width: 20px;
                                        `}
                                    />
                                    <Div css="align-items: center;" wrap="wrap">
                                        <P z="1.2rem" css="overflow: hidden; width: 100%;">
                                            {r.text.t}
                                        </P>
                                        <P
                                            z="1rem"
                                            css="display: flex;  color: #828282; svg{margin-top: 2px;margin-right: 5px;}"
                                        >
                                            <ClockCirclesI /> 30/10/2023
                                        </P>
                                    </Div>
                                </Div>
                                <Div>
                                    {r.imageOrVideos.map((f) => (
                                        <Div key={f._id} width="30px" css="height: 30px; margin: 2px; ">
                                            {f.type.search('image/') >= 0 ? (
                                                <Img src={f.v} alt={f._id} radius="5px" />
                                            ) : (
                                                <Player src={f.v} />
                                            )}
                                        </Div>
                                    ))}
                                </Div>
                            </Div>
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
