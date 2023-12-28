import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import PreviewPost from './PreView';
import { ImageI, VideoI } from '~/assets/Icons/Icons';
import { setTrueErrorServer } from '~/redux/hideShow';
import { useDispatch } from 'react-redux';
import { PropsFormHome } from './FormUpNews';
import { PropsUserHome } from '../../Home';
import CommonUtils from '~/utils/CommonUtils';
import { useCookies } from 'react-cookie';
import Cookies from '~/utils/Cookies';
import { Link } from 'react-router-dom';
import { Links, Smooth } from '~/reUsingComponents/styleComponents/styleDefault';

export default function LogicForm(form: PropsFormHome, colorText: string, colorBg: number, user?: PropsUserHome) {
    const dispatch = useDispatch();
    const { userId, token } = Cookies();

    const [displayEmoji, setdisplayEmoji] = useState<boolean>(false);
    const [displayFontText, setDisplayFontText] = useState<boolean>(false);

    const [uploadPre, setuploadPre] = useState<{ link: string; type: string }[]>([]);
    const [inputValue, setInputValue] = useState<{ dis: string; textarea: string }>({ dis: '', textarea: '' });

    const uploadPreRef = useRef<{ link: string; type: string }[]>([]);
    // upload submit
    const uploadRef = useRef<{ file: Blob; title: string }[]>([]);
    // add data when select type centered of swiper for submit
    const [dataCentered, setDataCentered] = useState<
        { id: number; columns: number; data: { file: Blob; title: string }[] }[]
    >([]);
    const CenteredRef = useRef<{ id: number; columns: number; data: { file: Blob; title: string }[] }[]>([]);
    // preView
    const [dataCenteredPre, setDataCenteredPre] = useState<
        { id: number; columns: number; data: { link: string; type: string }[] }[]
    >([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fontFamily, setFontFamily] = useState<{ name: string; type: string }>({
        name: 'Noto Sans',
        type: 'Straight',
    });
    const handleClear = () => {
        setInputValue({ dis: '', textarea: '' });
        setuploadPre([]);
        setDataCentered([]);
        const inpuFile: any = document.getElementById('upload');
        console.log(inpuFile, 'inpuFile');

        if (inpuFile) inpuFile.value = '';
    };

    const { textarea, buttonOne, buttonTwo, preView: dataTextPreView } = form;

    const handleOnKeyup = (e: any) => {
        e.target.setAttribute('style', 'height: auto');
        e.target.setAttribute('style', `height: ${e.target.scrollHeight}px`);
    };

    console.log(form);
    let fileAmount = 25;
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, addMore?: boolean) => {
        e.stopPropagation();
        console.log(e.target.files, 'addMore');
        setLoading(true);
        uploadPreRef.current = [];
        uploadRef.current = [];
        const file = e.target.files;
        const options = {
            maxSizeMB: 10,
        };

        if (file && file.length < fileAmount) {
            for (let i = 0; i < file.length; i++) {
                console.log('ffff');

                if (
                    file[i].type.includes('video/mp4') ||
                    file[i].type.includes('video/mov') ||
                    file[i].type.includes('video/x-matroska')
                ) {
                    const url = URL.createObjectURL(file[i]);
                    const vid = document.createElement('video');
                    // create url to use as the src of the video
                    vid.src = url;
                    // wait for duration to change from NaN to the actual duration
                    // eslint-disable-next-line no-loop-func
                    vid.ondurationchange = function () {
                        if (vid.duration <= 15) {
                            uploadPreRef.current.push({ link: url, type: 'video' });
                            uploadRef.current.push({ file: file[i], title: '' });
                        } else {
                            dispatch(setTrueErrorServer('Our length of the video must be less than 16 seconds!'));
                        }
                    };
                } else if (
                    file[i].type.includes('image/jpg') ||
                    file[i].type.includes('image/jpeg') ||
                    file[i].type.includes('image/png')
                ) {
                    try {
                        if (Number((file[i].size / 1024 / 1024).toFixed(1)) <= 8) {
                            uploadRef.current.push({ file: file[i], title: '' });
                            uploadPreRef.current.push({ link: URL.createObjectURL(file[i]), type: 'image' });
                        } else {
                            const compressedFile: any = await CommonUtils.compress(file[i]);
                            const sizeImage = Number((compressedFile.size / 1024 / 1024).toFixed(1));
                            if (sizeImage <= 8) {
                                uploadPreRef.current.push({
                                    link: URL.createObjectURL(compressedFile),
                                    type: 'image',
                                });
                                uploadRef.current.push({ file: compressedFile, title: '' });
                            } else {
                                dispatch(setTrueErrorServer(`${sizeImage}MB big than our limit is 8MB`));
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    dispatch(setTrueErrorServer('This format is not support!'));
                }
                // console.log(newDa, 'newDa');
            }
            if (!addMore) {
                setuploadPre(uploadPreRef.current);
            } else {
                setDataCentered([
                    ...dataCentered,
                    { id: dataCentered.length + 1, columns: 4, data: uploadRef.current },
                ]);
                setDataCenteredPre([
                    ...dataCenteredPre,
                    {
                        id: dataCenteredPre.length + 1,
                        columns: 4,
                        data: uploadPreRef.current,
                    },
                ]);
            }

            console.log('no');
        } else {
            dispatch(setTrueErrorServer(`You can only select ${fileAmount} file at most!`));
        }
        setLoading(false);
    };

    const handleAbolish = () => {
        setuploadPre([]);
        setInputValue({ dis: '', textarea: '' });
    };

    const handleEmojiSelect = (e: any) => {
        setInputValue({ textarea: inputValue.textarea + e.native, dis: inputValue.dis + e.native });
    };
    const handleDisEmoji = useCallback(() => {
        setdisplayEmoji(!displayEmoji);
    }, [displayEmoji]);
    const handleGetValue = (e: { target: { value: any } }) => {
        if (e.target.value.length <= 2500) {
            // Define a regex pattern to match URLs
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const hashTagRegex = /#([^]+?)\s*#@/g;
            const dp = { dis: '', textarea: '' }; //dis is displayed

            // Use the match method to find all matches in the text
            const urls: string[] = e.target.value.match(urlRegex) ?? [];
            const hashs: string[] = e.target.value.match(hashTagRegex) ?? [];
            dp.dis = e.target.value;

            urls.map((u) => {
                dp.dis = dp.dis.replace(u, `<a href='${u}' target='_blank' style='color: #6ca0ce'>${u}</a>`);
            });
            hashs.map((u) => {
                const protoType = u.split(/#|#@/);
                console.log(protoType, 'protoType', u);

                dp.dis = dp.dis.replace(
                    u,
                    `<a href='/sn/hashTags/${'#' + protoType[1]}' style="color: #6ca0ce">${'#' + protoType[1]}</a>`,
                );
            });
            console.log(hashs, 'hashs', dp.dis);
            dp.textarea = e.target.value;
            setInputValue(dp);
        }
    };

    const handleDuration = (e: { target: any }) => {
        console.log(e.target, 'here');
    };
    console.log(uploadPre, 'uploadPre', inputValue);
    let imageL = 0;
    let videoL = 0;
    for (let i = 0; i < uploadPre.length; i++) {
        uploadPre[i].type === 'image' ? imageL++ : videoL++;
    }
    const cart: { type: ReactNode; amount: number }[] = [
        { type: <ImageI />, amount: imageL },
        { type: <VideoI />, amount: videoL },
    ];
    return {
        displayEmoji,
        setdisplayEmoji,
        handleEmojiSelect,
        handleDisEmoji,
        displayFontText,
        handleImageUpload,
        fontFamily,
        inputValue,
        setInputValue,
        handleOnKeyup,
        handleGetValue,
        textarea,
        setFontFamily,
        setDisplayFontText,
        uploadPre,
        loading,
        uploadRef,
        dataTextPreView,
        token,
        userId,
        dataCentered,
        setDataCentered,
        dataCenteredPre,
        setDataCenteredPre,
        handleClear,
    };
}
