import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { DotI, LoadingI } from '~/assets/Icons/Icons';
import { Div, H3 } from '~/reUsingComponents/styleComponents/styleDefault';
import peopleAPI from '~/restAPI/socialNetwork/peopleAPI';
import CommonUtils from '~/utils/CommonUtils';
import TagProfile from './TagProfile';
import { useDispatch, useSelector } from 'react-redux';
import { DivResults } from './styleMakingFriends';
import { DivLoading } from '~/reUsingComponents/styleComponents/styleComponents';
import ServerBusy from '~/utils/ServerBusy';
import { PropsUser } from 'src/App';
interface PropsYouSent {
    avatar: any;
    birthday: string;
    fullName: string;
    gender: number;
    id: string;
}
const Requested: React.FC<{ userData: PropsUser }> = ({ userData }) => {
    const dispatch = useDispatch();
    const reload = useSelector((state: { reload: { people: number } }) => state.reload.people);

    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<PropsYouSent[]>();
    const limit: number = 3;

    const offsetRef = useRef<number>(0);
    const cRef = useRef<number>(0);
    const eleRef = useRef<any>();
    const dataRef = useRef<any>([]);

    async function fetch(rel: boolean) {
        cRef.current = 1;
        if (rel) {
            offsetRef.current = 0;
            dataRef.current = [];
            setLoading(true);
        }
        const res = await peopleAPI.getFriends(dispatch, offsetRef.current, limit, 'yousent');
        if (res) {
            dataRef.current = [...(dataRef.current ?? []), ...res];
            setData(dataRef.current);
            offsetRef.current += limit;
            setLoading(false);
        }
    }

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = eleRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
            fetch(false);
        }
    };
    useEffect(() => {
        // if (type === 'yousent' || cRef.current === 0) fetch(true);
        eleRef.current.addEventListener('scroll', handleScroll);
        return () => {
            eleRef?.current?.removeEventListener('scroll', handleScroll);
        };
    }, [reload]);
    const handleAbolish = async (id: string, kindOf: string = 'friends') => {
        console.log('Abolish', kindOf, id);
        const dataR = await peopleAPI.delete(dispatch, id, undefined, undefined, kindOf);
        if (dataR) {
            const newData: any = data?.filter((d: { id: string }) => d.id !== id);
            setData(newData);
        }
    };
    const handleRemove = async (id: string, kindOf?: string) => {
        console.log('deleted', id);
        const dataR = await peopleAPI.delete(dispatch, id, undefined, undefined, kindOf);
        if (dataR) {
            const newData: any = data?.filter((d: { id: string }) => d.id !== id);
            console.log('delete', dataR);
            setData(newData);
        }
    };

    const css = `display: flex;
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
            <DivResults id="yousent" ref={eleRef}>
                {loading && (
                    <DivLoading>
                        <LoadingI />
                    </DivLoading>
                )}

                {data?.map((vl) => {
                    const buttons = [
                        {
                            text: 'Delete',
                            css: css,
                            onClick: () => handleRemove(vl.id, 'friends'),
                        },
                        {
                            text: 'Abolish',
                            tx: '(F)',
                            css: css + 'background-color: #af2c48; ',
                            onClick: () => handleAbolish(vl.id),
                        },
                    ];
                    return <TagProfile key={vl.id} button={buttons} cssImage={cssImage} data={vl} />;
                })}
            </DivResults>
        </>
    );
};
export default Requested;
