import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { Button, Div, H3, Img, P, Span } from '~/reUsingComponents/styleComponents/styleDefault';
import { PropsUserHome } from '../../Home';
import {
    BanI,
    Bullseye,
    CameraI,
    DotI,
    EarthI,
    FriendI,
    FullScreenI,
    HeartI,
    IconI,
    LikeI,
    LockI,
    NextI,
    PlayI,
    PrivateI,
    ScreenI,
    ShareI,
    SmileI,
} from '~/assets/Icons/Icons';
import { Player } from 'video-react';
import {
    DivAction,
    DivEmoji,
    DivItems,
    DivWrapButton,
    Label,
    SpanAmount,
    TextAreaPre,
    Textarea,
} from './styleFormUpNews';
import { useCallback, useEffect, useRef, useState } from 'react';
import Coverflow from './ViewPostFrame/TypeFile/Swipers/Coverflow';
import Grid from './ViewPostFrame/TypeFile/Grid';
import DefaultType from './ViewPostFrame/TypeFile/DefaultType';
import OptionType from './ViewPostFrame/OptionType';
import HomeAPI from '~/restAPI/socialNetwork/homeAPI';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import OpText from '~/reUsingComponents/PostOptions/OpFeature';
import Dynamic from './ViewPostFrame/TypeFile/Swipers/Dynamic';
import Fade from './ViewPostFrame/TypeFile/Swipers/Fade';
import Cards from './ViewPostFrame/TypeFile/Swipers/Cards';
import Comment from './Comment';
import Centered from './ViewPostFrame/TypeFile/Swipers/Centered';
import Circle from './ViewPostFrame/TypeFile/Circle';
import { PropsPreViewFormHome } from './PreView';
import axios from 'axios';
import ServerBusy from '~/utils/ServerBusy';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { PropsDataFileUpload } from './FormUpNews';
export default function LogicPreView(
    user: PropsUserHome,
    colorText: string,
    colorBg: number,
    file: PropsDataFileUpload[],
    valueText: string,
    fontFamily: {
        name: string;
        type: string;
    },
    dataText: PropsPreViewFormHome,
    token: string,
    userId: string,

    handleImageUpload: (e: any, addMore?: boolean) => Promise<void>,
    dataCentered: {
        id: number;
        columns: number;
        data: PropsDataFileUpload[];
    }[],
    setDataCentered: React.Dispatch<
        React.SetStateAction<
            {
                id: number;
                columns: number;
                data: PropsDataFileUpload[];
            }[]
        >
    >,

    handleClear: () => void,
) {
    const dispatch = useDispatch();
    // type of post
    const [selectType, setSelectType] = useState<number>(0);
    // select children of swiper
    const [selectChild, setSelectChild] = useState<{ id: number; name: string }>({
        id: 1,
        name: 'Dynamic',
    });
    // column of centered
    const [ColumnCentered, setColumnCentered] = useState<boolean>(false);
    const [columnCen, setColumnCen] = useState<number>(4);
    // column and bg of grid
    const [column, setColumn] = useState<number>(3);
    const [bg, setBg] = useState<string>('#1b1919');
    // steps of feature
    const [step, setStep] = useState<number>(0);
    // show option of post
    const [options, setOptions] = useState<boolean>(false);
    const [showAc, setShowAc] = useState<boolean>(false);
    const [showComment, setShowComment] = useState<boolean>(false);
    const [actImotion, setActImotion] = useState<boolean>(false);
    const [showI, setShowI] = useState<{ id: number; icon: string } | undefined>();
    const [acEmo, setAcEmo] = useState<{ id: number; icon: React.ReactElement }>({ id: 1, icon: <LikeI /> });
    const textA = useRef<any>();

    // options of setting
    const [valuePrivacy, setValuePrivacy] = useState<{ id: number; name: string }[]>([]);
    const [valueSeePost, setValueSeePost] = useState<{ id: number; name: string; icon: React.ReactElement }>({
        id: 2,
        name: 'Friend',
        icon: <FriendI />,
    });

    const [typeExpire, setTypeExpire] = useState<{ cate: number; name: string; value: number }>();
    const [Imotions, setImotions] = useState<{ id: number; icon: string }[]>([
        { id: 1, icon: '👍' },
        { id: 2, icon: '❤️' },
        { id: 3, icon: '😂' },
        { id: 4, icon: '😍' },
        { id: 5, icon: '😘' },
        { id: 6, icon: '😱' },
        { id: 7, icon: '😡' },
    ]);
    const [ImotionsDel, setImotionsDel] = useState<{ id: number; icon: string }[]>([]);
    const acList = [
        { id: 1, icon: <LikeI /> },
        { id: 2, icon: <HeartI /> },
    ];
    const font = fontFamily?.name + ' ' + fontFamily?.type;

    const [more, setMore] = useState<number[]>([-1]);
    const [OpSelect, setOpSelect] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const images: string[] = [];
    const videos: string[] = [];
    let checkImg = false;
    useEffect(() => {
        if (textA.current) {
            textA.current.setAttribute('style', 'height: auto');
            textA.current.setAttribute('style', `height: ${textA.current.scrollHeight - 20}px`);
        }
    }, [valueText]);
    useEffect(() => {
        if (selectType === 1 && selectChild.id === 5 && dataCentered.length === 0) {
            setDataCentered([{ id: 1, columns: 4, data: file }]);
        }
    }, [selectChild]);

    for (let i = 0; i < file.length; i++) {
        if (file[i].type === 'image') images.push(file[i].link);
        if (file[i].type === 'video') videos.push(file[i].link);
        if (file[i].type === '!images' && checkImg === false) checkImg = true;
    }
    const handlePost = async () => {
        if (file.length > 0 || valueText) {
            setLoading(true);
            console.log('Option', selectType, 'private', valuePrivacy, 'Expire', typeExpire);

            let res: any;
            let id_c: string[] = [];
            const formData = new FormData();
            formData.append('text', valueText);
            formData.append('category', String(selectType));
            formData.append('fontFamily', font);
            formData.append('privacy', JSON.stringify(valuePrivacy));
            formData.append('act', JSON.stringify(acEmo.id));
            formData.append(
                'whoSeePost',
                JSON.stringify({
                    id: valueSeePost.id,
                    name: valueSeePost.name,
                }),
            );
            formData.append('imotions', JSON.stringify(Imotions));

            console.log('valuePrivacy', valuePrivacy, valueSeePost, 'valueSeePost');

            switch (selectType) {
                case 0:
                    for (let fil of file) {
                        if (fil.title) {
                            formData.append('files', fil.file, fil.title);
                        } else {
                            formData.append('files', fil.file);
                        }
                    }
                    console.log('text', valueText, 'file', file, 'fontFamily', font, Imotions);
                    res = await HomeAPI.setPost(formData);
                    const dataR = ServerBusy(res, dispatch);
                    setLoading(false);
                    console.log(res, 'res');
                    // id_c = res.id_c;

                    break;
                case 1:
                    formData.append('categoryOfSwiper', JSON.stringify(selectChild));
                    if (selectChild.id === 5) {
                        formData.append('columnOfCentered', JSON.stringify(columnCen));
                        console.log(
                            'text',
                            valueText,
                            'file',
                            file,
                            'fontFamily',
                            font,
                            'swiper',
                            selectChild,
                            'ColumnCentered',
                            columnCen,
                            'More raw',
                            dataCentered,
                        );
                        dataCentered.forEach((c) => {
                            formData.append(
                                `dataCentered${c.id}`,
                                JSON.stringify({ id: c.id, columns: c.columns, data: [] }),
                            );
                            for (const f of c.data) {
                                formData.append('files', f.file, JSON.stringify(c.id));
                            }
                        });
                        res = await HomeAPI.setPost(formData);
                        const dataR = ServerBusy(res, dispatch);

                        setLoading(false);
                        //     console.log(res, 'res');
                    } else {
                        for (let fil of file) {
                            formData.append('files', fil.file);
                        }
                        console.log('text', valueText, 'file', file, 'fontFamily', font, 'swiper', selectChild);
                        res = await HomeAPI.setPost(formData);
                        const dataR = ServerBusy(res, dispatch);

                        setLoading(false);
                        console.log(res, 'res');
                    }
                    break;
                case 2:
                    console.log('text', valueText, 'file', file, 'fontFamily', font, 'color-bg', bg, 'column', column);
                    formData.append('BgColor', bg);
                    formData.append('columnOfGrid', JSON.stringify(column));
                    res = await HomeAPI.setPost(formData);
                    const dataRq = ServerBusy(res, dispatch);

                    setLoading(false);
                    break;
                case 3:
                    for (let fil of file) {
                        formData.append('files', fil.file);
                    }
                    console.log('text', valueText, 'file', file, 'fontFamily', font, Imotions);
                    res = await HomeAPI.setPost(formData);
                    const dataRs = ServerBusy(res, dispatch);

                    console.log(res, 'res');
                    setLoading(false);
                    break;
                default:
                    break;
            }
            console.log(id_c, 'id_c');
            if (id_c.length > 0) {
                // const exp = await HomeAPI.exp(id_c, newExpire);
            }
        }
    };
    const postTypes = [
        // working in side OptionType
        <DefaultType
            colorText={colorText}
            file={file}
            step={step}
            setStep={setStep}
            upload={file}
            bg={bg}
            setBg={setBg}
        />,
        file.length > 3 ? (
            [
                <Dynamic colorText={colorText} file={file} step={step} setStep={setStep} />,
                <Fade colorText={colorText} file={file} step={step} setStep={setStep} />,
                <Cards colorText={colorText} file={file} step={step} setStep={setStep} />,
                <Coverflow colorText={colorText} file={file} step={step} setStep={setStep} />,
                <Centered
                    colorText={colorText}
                    file={file}
                    step={step}
                    setStep={setStep}
                    handleImageUpload={handleImageUpload}
                    ColumnCentered={ColumnCentered}
                    dataCentered={dataCentered}
                    setDataCentered={setDataCentered}
                    setColumnCen={setColumnCen}
                />,
            ][selectChild.id - 1]
        ) : (
            <P color="#bd5050">Please select at least 3 files!</P>
        ),
        <Circle colorText={colorText} file={file} step={step} setStep={setStep} />,
    ];
    console.log(ImotionsDel, 'ImotionsDel');

    let timeS: any;
    const handleShowI = (e: any) => {
        document.addEventListener('touchstart', handleMouseDown);

        function handleMouseDown(event: any) {
            if (event.target === e.target || event.target === e.target.closest) {
                // Clicked inside the div
                console.log('Clicked inside the box', e.target);
            } else {
                // Clicked outside the div
                if (actImotion) setActImotion(false);
            }
        }
        timeS = setTimeout(() => {
            setActImotion(true);
        }, 500);
    };
    const handleClearI = () => {
        clearTimeout(timeS);
    };
    return {
        selectType,
        setSelectType,
        selectChild,
        setSelectChild,
        ColumnCentered,
        setColumnCentered,
        columnCen,
        column,
        setColumn,
        step,
        setStep,
        options,
        setOptions,
        showAc,
        setShowAc,
        showComment,
        setShowComment,
        showI,
        setShowI,
        acEmo,
        setAcEmo,
        textA,
        valuePrivacy,
        setValuePrivacy,
        valueSeePost,
        setValueSeePost,
        typeExpire,
        setTypeExpire,
        Imotions,
        setImotions,
        ImotionsDel,
        setImotionsDel,
        font,
        more,
        setMore,
        OpSelect,
        setOpSelect,
        images,
        videos,
        checkImg,
        handlePost,
        postTypes,
        handleShowI,
        handleClearI,
        acList,
        loading,
        setLoading,
        actImotion,
        setActImotion,
        dispatch,
    };
}
