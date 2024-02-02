import dataEmoji from '@emoji-mart/data/sets/14/facebook.json';
import Picker from '@emoji-mart/react';
import './formUpNews.scss';

import { CameraI, CloseI, HashI, LoadingI, TagPostI, TextEditorI } from '~/assets/Icons/Icons';

import { DivDataFake, DivForm, DivItems, DivOptions, DivUpNews, Form, Label } from './styleFormUpNews';
import { Div } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivLoading, DivPos, ReactQuillF } from '~/reUsingComponents/styleComponents/styleComponents';
import FontFamilys from '~/reUsingComponents/Font/FontFamilys';
import PreviewPost, { PropsPreViewFormHome } from './PreView';
import LogicForm from './LogicForm';
import { PropsUserHome } from '../../Home';
import { useRef, useState } from 'react';
import Hashtag from './PostEditOptions/Hashtag';
import Tags from './PostEditOptions/Tags';
import TextEditor from './PostEditOptions/TextEditor';
export interface PropsFormHome {
    textarea: string;
    buttonOne: string;
    buttonTwo: string;
    emoji: string;
    preView: PropsPreViewFormHome;
}
interface PropsFormUpNews {
    colorText: string;
    colorBg: number;
    user: PropsUserHome;
    form: PropsFormHome;
}
export interface PropsDataFileUpload {
    id: number;
    link: string;
    type: string;
    title?: string | undefined;
    file: Blob;
}
const FormUpNews: React.FC<PropsFormUpNews> = ({ form, colorText, colorBg, user }) => {
    const [displayTags, setDisplayTags] = useState<boolean>(false);
    const {
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
    } = LogicForm(form, colorText, colorBg, user);
    const [edit, setEdit] = useState<boolean>(false);
    const [hashTags, setHashTags] = useState<{ id: string; value: string }[]>([]);
    const [tags, setTags] = useState<{ id: string; avatar: string; gender: number; fullName: string }[]>([]);
    const [onTags, setOnTags] = useState<boolean>(false);
    const [onTagU, setOnTagU] = useState<boolean>(false);
    const [onEditor, setOnEditor] = useState<boolean>(false);
    const yes = edit || uploadPre.length > 0 || inputValue || displayFontText || onTags || onTagU;
    return (
        <>
            <Div
                css={`
                    ${yes
                        ? 'width: 100%;  left: 0; position: fixed;  z-index: 999; background-color: #00000087; top: 0; height: 100%;'
                        : ''}
                `}
                onClick={() => setEdit(false)}
            ></Div>
            <DivForm
                top="12px"
                css={`
                    ${yes
                        ? 'width: inherit;  display: flex; justify-content: center; z-index: 1000; background-color: #181818;  overflow: overlay; height: 100%;'
                        : ''}
                `}
            >
                <Form
                    method="post"
                    encType="multipart/form-data"
                    css="width: 100%;"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                        }
                    }}
                >
                    <DivUpNews>
                        <DivOptions>
                            {displayEmoji && (
                                <Div
                                    id={colorBg === 1 ? 'pickerB' : ''}
                                    css={`
                                        position: fixed;
                                        bottom: 0px;
                                        z-index: 3;
                                        @media (min-width: 1240px) {
                                            bottom: 30px;
                                            left: -8px;
                                        }
                                    `}
                                >
                                    <DivPos
                                        width="30px"
                                        top="5px"
                                        right="-29px"
                                        size="22px"
                                        color={colorText}
                                        onClick={() => setdisplayEmoji(false)}
                                    >
                                        <CloseI />
                                    </DivPos>
                                    <Picker
                                        locale={form.emoji}
                                        set="facebook"
                                        emojiVersion={14}
                                        data={dataEmoji}
                                        theme={colorBg === 1 ? 'dark' : 'light'}
                                        onEmojiSelect={handleEmojiSelect}
                                    />
                                </Div>
                            )}
                            <Div
                                css={`
                                    width: 100%;
                                    height: 33px;
                                    flex-wrap: wrap;
                                    padding: 0 7px;
                                    margin-top: 5px;
                                    align-items: center;
                                    background-color: #43464cbf;
                                    border-radius: 10px;
                                    justify-content: space-evenly;
                                    border: 1px solid #5d5d5d;
                                    @media (min-width: 768px) {
                                        height: 32px;
                                    }
                                `}
                            >
                                <DivItems
                                    borderB={displayEmoji ? '1px solid white' : ''}
                                    color={colorText}
                                    position="relative"
                                    onClick={handleDisEmoji}
                                >
                                    🙂
                                </DivItems>
                                <DivItems
                                    borderB={displayFontText ? '1px solid white' : ''}
                                    color={colorText}
                                    onClick={() => {
                                        setDisplayFontText(!displayFontText);
                                    }}
                                >
                                    🖋️
                                </DivItems>

                                <DivItems>
                                    <input
                                        id="upload"
                                        type="file"
                                        name="file[]"
                                        onChange={(e) => handleImageUpload(e)}
                                        multiple
                                        hidden
                                    />
                                    <Label htmlFor="upload" color={colorText}>
                                        <CameraI />
                                    </Label>
                                </DivItems>
                                <DivItems
                                    borderB={onTags ? '1px solid white' : ''}
                                    color={colorText}
                                    position="relative"
                                    onClick={() => {
                                        setOnTags(!onTags);
                                    }}
                                >
                                    <HashI />
                                </DivItems>
                                <DivItems
                                    borderB={onTagU ? '1px solid white' : ''}
                                    color={colorText}
                                    onClick={() => {
                                        setOnTagU(!onTagU);
                                    }}
                                >
                                    <TagPostI />
                                </DivItems>
                                <DivItems
                                    borderB={onEditor ? '1px solid white' : ''}
                                    color={colorText}
                                    onClick={() => {
                                        setOnEditor(!onEditor);
                                    }}
                                >
                                    <TextEditorI />
                                </DivItems>
                            </Div>
                            {displayFontText && (
                                <FontFamilys
                                    colorBg={colorBg}
                                    colorText={colorText}
                                    fontFamily={fontFamily}
                                    setFontFamily={setFontFamily}
                                    displayEmoji={displayEmoji}
                                    setDisplayFontText={setDisplayFontText}
                                />
                            )}
                            {onEditor && (
                                <TextEditor
                                    setOnEditor={setOnEditor}
                                    setInputValue={setInputValue}
                                    valueText={inputValue}
                                    font={fontFamily.name + ' ' + fontFamily.type}
                                />
                            )}
                            {onTags && (
                                <Hashtag setHashTags={setHashTags} hashTagsInitially={hashTags} setOnTags={setOnTags} />
                            )}
                            {onTagU && (
                                <Tags colorText={colorText} setOnTagU={setOnTagU} setTags={setTags} tags={tags} />
                            )}
                            {/* <DivSignature>
                                <SignatureI />
                                </DivSignature> */}
                        </DivOptions>

                        <DivDataFake>
                            <Div width="100%" css="position: relative;">
                                <DivPos
                                    right="12px"
                                    top="10px"
                                    size="20px"
                                    color={colorText}
                                    onClick={() => {
                                        document.querySelector('.textHome')?.setAttribute('style', 'height: 42px');
                                        setInputValue('');
                                    }}
                                >
                                    <CloseI />
                                </DivPos>
                            </Div>
                            {loading && (
                                <DivLoading>
                                    <LoadingI />
                                </DivLoading>
                            )}
                            {
                                <PreviewPost
                                    onChangeQuill={handleChange}
                                    quillRef={quillRef}
                                    user={user}
                                    fontFamily={fontFamily}
                                    colorText={colorText}
                                    colorBg={colorBg}
                                    file={uploadPre}
                                    valueText={inputValue}
                                    dataText={dataTextPreView}
                                    token={token}
                                    userId={userId}
                                    setUploadPre={setuploadPre}
                                    handleImageUpload={handleImageUpload}
                                    dataCentered={dataCentered}
                                    setDataCentered={setDataCentered}
                                    handleClear={handleClear}
                                    hashTags={hashTags} // hashTags
                                    setEdit={setEdit}
                                    editForm={edit}
                                    setTags={setTags}
                                    tags={tags}
                                />
                            }
                        </DivDataFake>
                    </DivUpNews>
                </Form>
                {/* {(inputValue || upload.length > 0) && (
                    <DivWrapButton>
                        <Button size="1.5rem" padding="5px 15px;" bg="#d94755" onClick={handleAbolish}>
                            {buttonOne}
                        </Button>
                        <Button size="1.5rem" padding="5px 14px" bg="#2e54c6" onClick={handlePost}>
                            {buttonTwo}
                        </Button>
                    </DivWrapButton>
                )} */}
            </DivForm>
            {/* {preView} */}
        </>
    );
};
export default FormUpNews;
