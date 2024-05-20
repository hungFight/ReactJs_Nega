import { DotI, LoadingI } from '~/assets/Icons/Icons';
import { Div, H3 } from '~/reUsingComponents/styleComponents/styleDefault';
import TagProfile from './TagProfile';
import { useCookies } from 'react-cookie';
import { useEffect, useRef, useState } from 'react';
import peopleAPI from '~/restAPI/socialNetwork/peopleAPI';
import CommonUtils from '~/utils/CommonUtils';
import { useDispatch, useSelector } from 'react-redux';
import { DivResults } from './styleMakingFriends';
import { DivLoading } from '~/reUsingComponents/styleComponents/styleComponents';
import { PropsBgRD } from '~/redux/background';
import ServerBusy from '~/utils/ServerBusy';
import { PropsId_chats, PropsUser } from 'src/App';
import { PropsRoomsChatRD, onChats } from '~/redux/roomsChat';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from 'src';
export interface PropsFriends {
    avatar: any;
    birthday: string;
    fullName: string;
    gender: number;
    id: string;
}
const Friends: React.FC<{
    userData: PropsUser;
    setId_chats: React.Dispatch<React.SetStateAction<PropsId_chats[]>>;
}> = ({ setId_chats }) => {
    const dispatch = useDispatch();
    const reload = useSelector((state: { reload: { people: number } }) => state.reload.people);
    const { chats } = useSelector((state: PropsRoomsChatRD) => state.persistedReducer.roomsChat);

    const [loading, setLoading] = useState<boolean>(false);
    const isRefetch = useRef<boolean>(false);
    const limit = 10;
    const cRef = useRef<number>(0);
    const eleRef = useRef<any>();
    const dataRef = useRef<any>([]);
    const {
        data: asNew,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['getFirends'],
        staleTime: 15 * 60 * 60 * 1000,
        cacheTime: 15 * 60 * 60 * 1000,
        queryFn: async () => {
            cRef.current = 1;
            const preData: { offset: number; data: PropsFriends[] } | undefined = queryClient.getQueryData(['getFirends']);
            const res = await peopleAPI.getFriends(dispatch, preData?.offset ?? 0, limit, 'friends');
            if (res) {
                if (preData) {
                    if (isRefetch.current)
                        // for scroll
                        return { offset: preData.offset + limit, data: [...preData.data, ...res] };
                    return preData;
                } else {
                    return { offset: 0, data: res };
                }
            }
        },
    });
    const data = asNew?.data;
    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = eleRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 20 && !isFetching) {
            refetch();
        }
    };
    useEffect(() => {
        eleRef.current.addEventListener('scroll', handleScroll);
        return () => {
            eleRef?.current?.removeEventListener('scroll', handleScroll);
        };
    }, [reload]);
    const handleMessenger = (id: string) => {
        dispatch(onChats({ conversationId: undefined, id_other: id }));
        setId_chats((pre) => {
            if (!chats.some((p) => p.id_other === id) && !pre.some((p) => p.id_other === id)) {
                return [...pre, { conversationId: undefined, id_other: id }];
            }
            return pre;
        });
    };
    console.log(data, 'friend data');

    const css = `    display: flex;
            align-items: center;
            padding: 4px 6px;
           background-color: #5e5e5e;
            color: #cbcbcb;
            cursor: var(--pointer);
            border-radius: 5px;
            font-size: 1.3rem;
            font-weight: 400;
            justify-content: center;
              @media (min-width: 769px){
                padding: 6px;
              }
          `;
    const cssImage = `
                    min-width: 40px;
                    width: 40px;
                    height: 40px;
                    margin-right: 5px;
                    cursor: var(--pointer); 
                    @media (min-width: 769px){
                            width: 100%;
                            height: 170px;
                            margin-right: 0;
                            img{border-radius: 5px 5px 0 0 !important; }
                    }
                    img{border-radius: 50% ;}`;
    return (
        <>
            <DivResults id="friends" ref={eleRef}>
                {loading && (
                    <DivLoading>
                        <LoadingI />
                    </DivLoading>
                )}

                {data?.map((vl) => (
                    <TagProfile
                        key={vl.id}
                        button={[
                            {
                                text: 'Messenger',
                                css: css + ' background-color: #366ab3; ',
                                onClick: () => handleMessenger(vl.id),
                            },
                        ]}
                        cssImage={cssImage}
                        data={vl}
                    />
                ))}
            </DivResults>
        </>
    );
};
export default Friends;
