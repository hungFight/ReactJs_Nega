import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import PreviewPost from './PreView';
import { ImageI, VideoI } from '~/assets/Icons/Icons';
import { setTrueErrorServer } from '~/redux/hideShow';
import { useDispatch } from 'react-redux';
import { PropsDataFileUpload, PropsFormHome } from './FormUpNews';
import CommonUtils from '~/utils/CommonUtils';
import { useCookies } from 'react-cookie';
import Cookies from '~/utils/Cookies';
import { Link } from 'react-router-dom';
import { Links, Smooth } from '~/reUsingComponents/styleComponents/styleDefault';
import ReactQuill, { Quill } from 'react-quill';
import { PropsUser } from 'src/App';

export default function LogicForm(
    form: PropsFormHome,
    colorText: string,
    colorBg: number,
    setOpenPostCreation: () => void,
    user?: PropsUser,
    originalInputValue?: string,
) {
    const dispatch = useDispatch();
    const { userId, token } = Cookies();
    const divRef = useRef<any>(null);

    const [displayEmoji, setdisplayEmoji] = useState<boolean>(false);
    const [displayFontText, setDisplayFontText] = useState<boolean>(false);

    const [uploadPre, setuploadPre] = useState<PropsDataFileUpload[]>([]);
    const [inputValue, setInputValue] = useState<string>(originalInputValue || '');

    const uploadPreRef = useRef<PropsDataFileUpload[]>([]);
    // upload submit
    // add data when select type centered of swiper for submit
    const [dataCentered, setDataCentered] = useState<
        {
            id: number;
            columns: number;
            data: PropsDataFileUpload[];
        }[]
    >([]);
    const CenteredRef = useRef<{ id: number; columns: number; data: { file: Blob; title: string }[] }[]>([]);
    // preView

    const [loading, setLoading] = useState<boolean>(false);
    const [fontFamily, setFontFamily] = useState<{ name: string; type: string }>({
        name: 'OpenSans',
        type: 'Straight',
    });
    const handleClear = () => {
        setInputValue('');
        setOpenPostCreation();
        setuploadPre([]);
        setDataCentered([]);
        const inpuFile: any = document.getElementById('upload');
        if (inpuFile) inpuFile.value = '';
    };
    const { textarea, buttonOne, buttonTwo, preView: dataTextPreView } = form;
    let fileAmount = 25;
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, addMore?: boolean) => {
        e.stopPropagation();
        setLoading(true);
        const file = e.target.files;
        const options = {
            maxSizeMB: 10,
        };
        if (file?.length && file.length < fileAmount) {
            uploadPreRef.current = [];
            for (let i = 0; i < file.length; i++) {
                console.log(file[i], 'file[i]');
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
                    const antit = await new Promise<PropsDataFileUpload>((resolve, reject) => {
                        vid.ondurationchange = function () {
                            if (vid.duration <= 15) {
                                resolve({
                                    id_sort: i + 1,
                                    pre: url,
                                    type: file[i].type.split('/')[0],
                                    file: file[i],
                                    title: '',
                                });
                            } else {
                                dispatch(setTrueErrorServer('Our length of the video must be less than 16 seconds!'));
                            }
                        };
                    });
                    uploadPreRef.current.push(antit);
                } else if (
                    file[i].type.includes('image/jpg') ||
                    file[i].type.includes('image/jpeg') ||
                    file[i].type.includes('image/png') ||
                    file[i].type.includes('image/webp')
                ) {
                    try {
                        if (Number((file[i].size / 1024 / 1024).toFixed(1)) <= 8) {
                            uploadPreRef.current.push({
                                id_sort: i + 1,
                                pre: URL.createObjectURL(file[i]),
                                type: file[i].type.split('/')[0],
                                file: file[i],
                                title: '',
                            });
                        } else {
                            const compressedFile: any = await CommonUtils.compress(file[i]);
                            const sizeImage = Number((compressedFile.size / 1024 / 1024).toFixed(1));
                            if (sizeImage <= 8) {
                                uploadPreRef.current.push({
                                    id_sort: i + 1,
                                    pre: URL.createObjectURL(compressedFile),
                                    type: file[i].type.split('/')[0],
                                    file: compressedFile,
                                    title: '',
                                });
                            } else {
                                dispatch(setTrueErrorServer(`${file[i].name} big than our limit is 8MB`));
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    dispatch(setTrueErrorServer(`${file[i].name} format is not support!`));
                }
                // console.log(newDa, 'newDa');
            }
            if (!addMore) {
                console.log('ok uploadPreRef', uploadPreRef.current);

                setuploadPre(uploadPreRef.current);
            } else {
                setDataCentered([
                    ...dataCentered,
                    { id: dataCentered.length + 1, columns: 4, data: uploadPreRef.current },
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
        setInputValue('');
    };
    const handleEmojiSelect = (e: any) => {
        if (quillRef.current) {
            const range = quillRef.current.getEditor().getSelection();
            if (range) {
                quillRef.current.getEditor().insertText(range.index, e.native);
            }
        }
    };
    const handleDisEmoji = useCallback(() => {
        setdisplayEmoji(!displayEmoji);
    }, [displayEmoji]);
    const handleDuration = (e: { target: any }) => {
        console.log(e.target, 'here');
    };
    let imageL = 0;
    let videoL = 0;
    for (let i = 0; i < uploadPre.length; i++) {
        uploadPre[i].type.includes('image') ? imageL++ : videoL++;
    }
    const cart: { type: ReactNode; amount: number }[] = [
        { type: <ImageI />, amount: imageL },
        { type: <VideoI />, amount: videoL },
    ];
    const quillRef = useRef<ReactQuill>(null);

    const handleChange = (value: string) => {
        console.log('value', value);

        if (value.length <= 10000) {
            // Define a regex pattern to match URLs
            const hashTagRegex = /#([^]+?)\s*#@/g; // #...#@
            let dp = false; //dis is displayed
            // Use the match method to find all matches in the text
            if (quillRef.current && quillRef.current.editor) {
                const delta = quillRef.current.editor.clipboard.convert(value); // Convert HTML to Delta object

                // Apply formatting using regex
                if (delta.ops) {
                    delta.ops.map((op, index, arr) => {
                        if (typeof op.insert === 'string') {
                            op.insert = op.insert.replace(hashTagRegex, (match: any, group: any) => {
                                dp = true;
                                return `<a href="/sn/hashTags/${group}" style='color: #66a6de;'>#${group}</a>`;
                            });
                        }
                    });
                    if (dp) {
                        var tempCont = document.createElement('div');
                        if (delta.ops)
                            delta.ops.map((op) => {
                                if (op.attributes)
                                    if (op.attributes.link) {
                                        op.insert = `<a href="${op.attributes.link}" style='color: ${op.attributes.color}'>${op.insert}</a>`;
                                    }
                                return op;
                            });
                        new Quill(tempCont).setContents(delta);
                        if (tempCont) {
                            setInputValue(
                                tempCont
                                    .getElementsByClassName('ql-editor')[0]
                                    .innerHTML.replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>'),
                            );
                        }
                    } else {
                        setInputValue(value);
                    }
                }
            }
        }
    };

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
        textarea,
        setFontFamily,
        setDisplayFontText,
        uploadPre,
        setuploadPre,
        loading,
        dataTextPreView,
        token,
        userId,
        dataCentered,
        setDataCentered,
        handleClear,
        divRef,
        handleChange,
        quillRef,
    };
}
