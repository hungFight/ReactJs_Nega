import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DotI } from '~/assets/Icons/Icons';
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
}> = ({ conversationId, pins }) => {
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
                max-height: 39px;
                background-color: #030303c4;
                z-index: 12;
                padding: 5px;
            `}
        >
            <Div width="93%" css="position: relative;">
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
                <Div width="100%" wrap="wrap" css="overflow-y: overlay; align-items: center;">
                    {data?.map((r) => {
                        return (
                            <Div
                                key={r._id}
                                width="100%"
                                css="margin: 2px 0;  height: 100%; padding: 5px 10px; padding-left: 22px; justify-content: space-between;"
                            >
                                <P z="1.2rem" css="overflow: hidden;">
                                    {r.text.t}
                                </P>
                                <Div>
                                    {r.imageOrVideos.map((f) => (
                                        <Div key={f._id} width="30px" css="height: 30px; margin-right: 2px; ">
                                            <Img src={f.v} alt={f._id} radius="5px" />{' '}
                                        </Div>
                                    ))}
                                </Div>
                            </Div>
                        );
                    })}
                </Div>
            </Div>
            <Div css="width: 7%; justify-content: center; align-items: center; cursor: var(--pointer)">
                <DotI />
            </Div>
        </Div>
    );
};

export default PinChat;
