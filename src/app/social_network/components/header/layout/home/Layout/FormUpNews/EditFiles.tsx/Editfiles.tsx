import React, { useRef, useState } from 'react';
import { CheckI, ImageI, SortFileI, UndoIRegister, VideoI } from '~/assets/Icons/Icons';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { PropsDataFileUpload } from '../FormUpNews';
import { ButtonSubmit, UpLoadForm } from '~/reUsingComponents/styleComponents/styleComponents';
import handleFileUpload from '~/utils/handleFileUpload';
import Player from '~/reUsingComponents/Videos/Player';
import { Textarea } from '../styleFormUpNews';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import AllFIlesEdited from './AllFIlesEdited';
type PropsIdPre = { id_pre: number };
type MergeType = PropsDataFileUpload & PropsIdPre;
const EditFiles: React.FC<{
    file: PropsDataFileUpload[];
    colorText: string;
    setEditFile: React.Dispatch<React.SetStateAction<boolean>>;
    setUploadPre: React.Dispatch<React.SetStateAction<PropsDataFileUpload[]>>;
    step: number;
    dispatch: Dispatch<AnyAction>;
}> = ({ file, colorText, setEditFile, setUploadPre, step, dispatch }) => {
    const [process, setProcess] = useState<string>('');
    const [chosen, setChosen] = useState<number[]>([]);
    const [sortData, setSortData] = useState<MergeType[]>([]);
    const coordS = useRef<number>(1);
    console.log(file, 'chosen', sortData, 'sortData');
    const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const { upLoad } = await handleFileUpload(e.target.files, 10, 8, 15, dispatch, 'chat', true);
            console.log(upLoad, 'upLoad');

            const filUp: PropsDataFileUpload[] = [];
            for (let i = 0; i < upLoad.length; i++) {
                filUp.push({
                    type: upLoad[i].type.split('/')[0],
                    pre: URL.createObjectURL(upLoad[i]),
                    file: upLoad[i],
                    title: '',
                    id_sort: file[file.length - 1].id_sort + i + 1,
                    link: '',
                });
            }
            setUploadPre((pre) => [...pre, ...filUp]);
            e.target.value = '';
        }
    };
    return (
        <Div
            width="100%"
            css={`
                position: fixed;
                top: 0;
                left: 0;
                background-color: #010101bd;
                width: 100%;
                height: 100%;
                z-index: 8;
            `}
            onClick={(e) => e.stopPropagation()}
        >
            <Div width="100%" display="block">
                <Div width="100%" css="justify-content: center; position: relative; margin-top: 10px;">
                    <Div css="position: absolute; cursor: var(--pointer); top: 1px; left: 20px;font-size: 22px; padding: 5px;" onClick={() => setEditFile(false)}>
                        <UndoIRegister />
                    </Div>
                    <Div
                        onClick={() => setEditFile(false)}
                        width="fit-content"
                        css="align-items:center;font-size: 1.4rem; cursor: var(--pointer);  padding: 5px; border-radius:5px; border-bottom: 1px solid #1eacdc6b; &:hover{border-color: #1eacdc;} cursor: var(--pointer);"
                    >
                        Chỉnh sửa
                        <Div width="50px" css="font-size: 20px; justify-content: space-around; margin-left: 5px;">
                            <ImageI />
                            <VideoI />
                        </Div>
                    </Div>
                </Div>
                <Div css="margin: 15px 0; padding: 5px; @media(min-width: 500px){padding: 5px 20px;}">
                    {' '}
                    {/* options for editor */}
                    <Div
                        width="fit-content"
                        css="position: relative; cursor: var(--pointer); align-items: center; margin-right: 10px; padding: 5px 10px; border-radius: 5px; background-color: #004262;"
                        onClick={() => setProcess('sort')}
                    >
                        <SortFileI /> <P z="1.3rem">Sắp xếp</P>
                    </Div>
                    <Div width="fit-content" css="position: relative; align-items: center; padding: 5px 10px; border-radius: 5px; background-color: #004262;">
                        <UpLoadForm
                            submit={handleAddFile}
                            id="addMoreFileAtEditorPreview"
                            colorText={colorText}
                            children={
                                <Div css="align-items: center;">
                                    <P z="1.3rem">Thêm</P>
                                    <Div width="50px" css="font-size: 20px; justify-content: space-around; margin-left: 5px;">
                                        <ImageI />
                                        <VideoI />
                                    </Div>
                                </Div>
                            }
                        />
                    </Div>
                </Div>

                {process === 'sort' && ( // show file to sort
                    <Div width="100%" display="block" css="position: absolute; z-index: 7; height: 100%; top: 0; left: 0; background-color: #131313db;">
                        <Div css="position: relative;">
                            <Div css="position: absolute; cursor: var(--pointer); top: 9px; left: 20px;font-size: 22px; padding: 5px;" onClick={() => setProcess('')}>
                                <UndoIRegister />
                            </Div>
                        </Div>
                        <Div width="fit-content" css=" align-items: center;  margin: auto; margin-top: 11px; padding: 5px 10px; border-radius: 5px; background-color: #004262;">
                            <SortFileI /> <P z="1.3rem">Sắp xếp</P>
                        </Div>
                        {sortData.length > 0 ? (
                            <Div width="100%" wrap="wrap" css="margin: 10px 0; background-color: #1e1e1e;">
                                {/* sort file */}
                                {sortData.map(
                                    (
                                        f,
                                        index, // data is sorted
                                    ) => (
                                        <Div
                                            key={f.id_sort}
                                            width="90px"
                                            wrap="wrap"
                                            css="justify-content: center; cursor: pointer; padding: 2px; box-shadow: 0 0 2px #757575; border-radius: 5px; margin: 4px;"
                                            onClick={() => {
                                                setSortData((pre) => pre.filter((r) => r.id_sort !== f.id_sort));
                                                setChosen((pre) => pre.filter((r) => r !== f.id_pre));
                                            }}
                                        >
                                            <Div width="100%" css="height: 60px; position:relative; overflow: hidden; z-index: 5;  border-radius: 5px;">
                                                {' '}
                                                <Img
                                                    src={f?.pre}
                                                    id="baby"
                                                    alt={f?.pre}
                                                    css={`
                                                        z-index: -1;
                                                        position: absolute;
                                                        top: 0;
                                                        left: 0;
                                                        filter: blur(12px);
                                                        object-fit: cover;
                                                    `}
                                                />
                                                {f?.type.includes('image') ? (
                                                    <Img src={f?.pre} id="baby" alt={f?.pre} css="object-fit: contain;" />
                                                ) : f?.type.includes('video') ? (
                                                    <Player src={f?.link ?? f.pre} step={step} />
                                                ) : (
                                                    ''
                                                )}
                                            </Div>
                                        </Div>
                                    ),
                                )}
                                <Div width="100%" css="text-align: center;">
                                    <ButtonSubmit
                                        title="Hoàn thành"
                                        css="background: #263f8b;"
                                        submit={false}
                                        onClick={() => {
                                            setUploadPre(
                                                sortData.map((r, index) => {
                                                    r.id_sort = index;
                                                    return r;
                                                }),
                                            );
                                            setChosen([]);
                                            setSortData([]);
                                            setProcess('');
                                        }}
                                    />
                                </Div>
                            </Div>
                        ) : (
                            ''
                        )}
                        <Div width="100%" wrap="wrap" css="margin: 10px 0; background-color: #1e1e1e;">
                            {/* sort file */}
                            {file.map((f, index) => (
                                <Div
                                    key={f.id_sort}
                                    width="90px"
                                    wrap="wrap"
                                    css={`
                                        justify-content: center;
                                        cursor: pointer;
                                        padding: 2px;
                                        box-shadow: 0 0 2px ${chosen.includes(f.id_sort) ? '#5bffba' : '#757575'};
                                        border-radius: 5px;
                                        margin: 4px;
                                    `}
                                    onClick={() => {
                                        if (chosen.includes(f.id_sort)) {
                                            setChosen((pre) => pre.filter((r) => r !== f.id_sort));
                                        } else {
                                            setChosen((pre) => [...pre, f.id_sort]);
                                        }
                                        if (!sortData.some((s) => s.id_pre === f.id_sort)) {
                                            setSortData((pre) => [
                                                ...pre,
                                                {
                                                    ...f,
                                                    id: pre.length ? pre[pre.length - 1].id_sort + 1 : 0 + 1,
                                                    id_pre: f.id_sort,
                                                },
                                            ]);
                                        } else {
                                            setSortData((pre) => pre.filter((r) => r.id_pre !== f.id_sort));
                                        }
                                    }}
                                >
                                    <Div
                                        width="20px"
                                        css={`
                                            height: 20px;
                                            border: 1px solid;
                                            border-radius: 3px;
                                            margin: 2px 0;
                                            justify-content: center;
                                            align-items: center;
                                            ${chosen.includes(f.id_sort) ? 'color: #2cb72c;' : ''}
                                        `}
                                    >
                                        {chosen.includes(f.id_sort) && <CheckI />}
                                    </Div>

                                    <Div width="100%" css="height: 60px; position:relative; overflow: hidden; z-index: 5;  border-radius: 5px;">
                                        {' '}
                                        <Img
                                            src={f?.link}
                                            id="baby"
                                            alt={f?.link}
                                            css={`
                                                z-index: -1;
                                                position: absolute;
                                                top: 0;
                                                left: 0;
                                                filter: blur(12px);
                                                object-fit: cover;
                                            `}
                                        />
                                        {f?.type.includes('image') ? (
                                            <Img src={f?.link || f.pre} id="baby" alt={f?.title || f?.link} css="object-fit: contain;" />
                                        ) : f?.type.includes('video') ? (
                                            <Player src={f?.link || f.pre} step={step} />
                                        ) : (
                                            ''
                                        )}
                                    </Div>
                                </Div>
                            ))}
                        </Div>
                    </Div>
                )}

                <Div css="height: 100%;">
                    <Div width="100%" wrap="wrap" css="max-height: 87%; height: fit-content; padding: 5px 0 20px; justify-content: center; overflow-y: overlay;">
                        {file.map((f, index) => (
                            <AllFIlesEdited key={index} file={file} coordS={coordS} colorText={colorText} index={index} f={f} chosen={chosen} step={step} setUploadPre={setUploadPre} />
                        ))}
                    </Div>
                </Div>
            </Div>
        </Div>
    );
};

export default EditFiles;
