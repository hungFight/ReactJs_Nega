import { P } from '~/reUsingComponents/styleComponents/styleDefault';
import { FriendI, HeartI, LikeI } from '~/assets/Icons/Icons';
import { useEffect, useRef, useState } from 'react';
import Coverflow from './ViewPostFrame/TypeFile/Swipers/Coverflow';
import postAPI from '~/restAPI/socialNetwork/postAPI';
import Cards from './ViewPostFrame/TypeFile/Swipers/Cards';
import Centered from './ViewPostFrame/TypeFile/Swipers/Centered';
import { PropsPreViewFormHome } from './PreView';
import ServerBusy from '~/utils/ServerBusy';
import { useDispatch } from 'react-redux';
import { PropsDataFileUpload } from './FormUpNews';
import { PropsUser } from 'src/App';
import DefaultType from './ViewPostFrame/TypeFile/DefaultType';
import Dynamic from './ViewPostFrame/TypeFile/Swipers/Dynamic';
import Fade from './ViewPostFrame/TypeFile/Swipers/Fade';
import Circle from './ViewPostFrame/TypeFile/Circle';
import fileWorkerAPI from '~/restAPI/fileWorkerAPI';
export default function LogicPreView(
    user: PropsUser,
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
    hashTags: {
        _id: string;
        value: string;
    }[],
    tags: {
        id: string;
        avatar: string;
        gender: number;
        fullName: string;
    }[],
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
    // column of grid
    const [column, setColumn] = useState<number>(3);
    const [bg, setBg] = useState<string>('#1b1919'); //default
    // steps of feature
    const [step, setStep] = useState<number>(0);
    // show option of post
    const [options, setOptions] = useState<boolean>(false);
    const [showAc, setShowAc] = useState<boolean>(false);
    const [showComment, setShowComment] = useState<string>('');
    const [actImotion, setActImotion] = useState<boolean>(false);
    const [showI, setShowI] = useState<{ id: number; icon: string } | undefined>();
    const [acEmo, setAcEmo] = useState<{ id: number; icon: React.ReactElement }>({ id: 1, icon: <LikeI /> }); // display a button as like to press
    const textA = useRef<any>();

    // options of setting
    const [valuePrivacy, setValuePrivacy] = useState<{ id: string; name: string }[]>([]);
    const [valueSeePost, setValueSeePost] = useState<{ id: string; name: string; icon: React.ReactElement }>({
        id: 'friend',
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
        if (file[i].type === 'image') images.push(file[i].pre);
        if (file[i].type === 'video') videos.push(file[i].pre);
        if (file[i].type === '!images' && checkImg === false) checkImg = true;
    }
    const handlePost = async () => {
        if (file.length > 0 || valueText) {
            setLoading(true);
            console.log('Option', selectType, 'private', valuePrivacy, 'Expire', typeExpire);

            let res: any;
            let id_c: string[] = [];
            const formDataFake: {
                text: string;
                category: string;
                hashTags: string;
                tags: string;
                fontFamily: string;
                privacy: string;
                act: string;
                whoSeePost: string;
                imotions: string;
                bg_default?: string;
                id_file:
                    | null
                    | {
                          id: string;
                          type: string;
                          tail: string;
                          title?: string | undefined;
                      }[];
            } = {
                text: valueText,
                category: String(selectType),
                hashTags: JSON.stringify(hashTags),
                tags: String(tags.map((t) => t.id)),
                fontFamily: font,
                privacy: JSON.stringify(valuePrivacy),
                act: JSON.stringify(acEmo.id),
                whoSeePost: JSON.stringify({
                    id: valueSeePost.id,
                    name: valueSeePost.name,
                }),
                imotions: JSON.stringify(Imotions),
                id_file: null,
            };
            const formData = new FormData();
            console.log('valuePrivacy', valuePrivacy, valueSeePost, 'valueSeePost');
            switch (selectType) {
                case 0: // default
                    for (let fil of file) {
                        if (fil.file) formData.append('file', fil.file, fil.name + '@_id_get_$' + fil._id);
                        formData.append('title', JSON.stringify({ title: fil.title, id: fil._id }));
                        formData.append('id_sort', JSON.stringify({ id_sort: fil.id_sort, id: fil._id }));
                    }
                    formDataFake.bg_default = bg;
                    if (file.length) {
                        const returnDataAdded = await fileWorkerAPI.addFiles(formData);
                        formDataFake.id_file = returnDataAdded;
                    }
                    console.log('text', valueText, 'file', file, 'fontFamily', font, Imotions);
                    res = await postAPI.setPost(formDataFake);
                    const dataR = ServerBusy(res, dispatch);
                    setLoading(false);
                    id_c = res.id_c;
                    handleClear();
                    break;
                case 1:
                    formData.append('categoryOfSwiper', JSON.stringify(selectChild));
                    if (selectChild.id === 5) {
                        formData.append('columnOfCentered', JSON.stringify(columnCen));
                        console.log('text', valueText, 'file', file, 'fontFamily', font, 'swiper', selectChild, 'ColumnCentered', columnCen, 'More raw', dataCentered);
                        dataCentered.forEach((c) => {
                            formData.append(`dataCentered${c.id}`, JSON.stringify({ id: c.id, columns: c.columns, data: [] }));
                            for (const f of c.data) {
                                if (f.file) formData.append('file', f.file, JSON.stringify(c.id));
                            }
                        });
                        res = await postAPI.setPost(formData);
                        const dataR = ServerBusy(res, dispatch);

                        setLoading(false);
                        //     console.log(res, 'res');
                    } else {
                        for (let fil of file) {
                            if (fil.file) formData.append('files', fil.file);
                        }
                        console.log('text', valueText, 'file', file, 'fontFamily', font, 'swiper', selectChild);
                        res = await postAPI.setPost(formData);
                        const dataR = ServerBusy(res, dispatch);

                        setLoading(false);
                        console.log(res, 'res');
                    }
                    break;
                case 2:
                    console.log('text', valueText, 'file', file, 'fontFamily', font, 'color-bg', bg, 'column', column);
                    formData.append('BgColor', bg);
                    formData.append('columnOfGrid', JSON.stringify(column));
                    res = await postAPI.setPost(formData);
                    const dataRq = ServerBusy(res, dispatch);

                    setLoading(false);
                    break;
                case 3:
                    for (let fil of file) {
                        if (fil.file) formData.append('files', fil.file);
                    }
                    console.log('text', valueText, 'file', file, 'fontFamily', font, Imotions);
                    res = await postAPI.setPost(formData);
                    const dataRs = ServerBusy(res, dispatch);

                    console.log(res, 'res');
                    setLoading(false);
                    break;
                default:
                    break;
            }
            console.log(id_c, 'id_c');
            if (id_c.length > 0) {
                // const exp = await postAPI.exp(id_c, newExpire);
            }
        }
    };
    const postTypes = [
        // working in side OptionType
        <DefaultType colorText={colorText} file={file} step={step} setStep={setStep} bg={bg} setBg={setBg} />,
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
