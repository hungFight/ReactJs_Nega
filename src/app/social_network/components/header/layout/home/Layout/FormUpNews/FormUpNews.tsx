import dataEmoji from '@emoji-mart/data/sets/14/facebook.json';
import Picker from '@emoji-mart/react';
import 'video-react/dist/video-react.css';
import './formUpNews.scss';

import { CameraI, CloseI, HashI, LoadingI, PreviewI, TagPostI } from '~/assets/Icons/Icons';

import { Player } from 'video-react';
import {
    DivDataFake,
    DivForm,
    DivImage,
    DivItems,
    DivOptions,
    DivUpNews,
    DivWrapButton,
    Form,
    Input,
    Label,
    Textarea,
} from './styleFormUpNews';
import { Button, Buttons, Div, H3, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivLoading, DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import HoverTitle from '~/reUsingComponents/HandleHover/HoverTitle';
import FontFamilys from '~/reUsingComponents/Font/FontFamilys';
import PreviewPost, { PropsPreViewFormHome } from './PreView';
import LogicForm from './LogicForm';
import { PropsUserHome } from '../../Home';
import { useState } from 'react';
import Hashtag from './PostEditOptions/Hashtag';
import Tags from './PostEditOptions/Tags';
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
    include: boolean;
    setInclude: React.Dispatch<React.SetStateAction<boolean>>;
}
const FormUpNews: React.FC<PropsFormUpNews> = ({ form, colorText, colorBg, user, include, setInclude }) => {
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
    } = LogicForm(form, colorText, colorBg, user);

    const [hashTags, setHashTags] = useState<string[]>([]);
    const [onTags, setOnTags] = useState<boolean>(false);

    return (
        <>
            <DivForm top="12px">
                <Form method="post" encType="multipart/form-data">
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
                                    height: 30px;
                                    flex-wrap: wrap;
                                    padding: 0 7px;
                                    margin-top: 5px;
                                    align-items: center;
                                    background-color: #43464cbf;
                                    border-radius: 10px;
                                    justify-content: space-evenly;
                                    border: 1px solid #5d5d5d;
                                    @media (min-width: 500px) {
                                        height: 35px;
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
                                    onClick={() => setDisplayFontText(!displayFontText)}
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
                                    onClick={() => setOnTags(!onTags)}
                                >
                                    <HashI />
                                </DivItems>
                                <DivItems
                                    borderB={displayFontText ? '1px solid white' : ''}
                                    color={colorText}
                                    onClick={() => setDisplayFontText(!displayFontText)}
                                >
                                    <TagPostI />
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
                            {onTags && (
                                <Hashtag setHashTags={setHashTags} hashTagsInitially={hashTags} setOnTags={setOnTags} />
                            )}
                            {/* <Tags /> */}
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
                                        setInputValue({ dis: '', textarea: '' });
                                    }}
                                >
                                    <CloseI />
                                </DivPos>
                                <Textarea
                                    className="textHome"
                                    color={colorText}
                                    bg={colorBg === 1 ? '#202124f5;' : ''}
                                    font={fontFamily.name + ' ' + fontFamily.type}
                                    value={inputValue.textarea}
                                    onKeyUp={handleOnKeyup}
                                    onChange={handleGetValue}
                                    placeholder={textarea}
                                    BoBg="transparent"
                                    css="@media(max-width: 580px){width: 98%; margin: auto; margin-top: 10px; box-shadow: 0 0 2px #afafaf;}"
                                ></Textarea>
                            </Div>
                            {loading && (
                                <DivLoading>
                                    <LoadingI />
                                </DivLoading>
                            )}
                            {(inputValue || uploadPre.length > 0) && (
                                <PreviewPost
                                    upload={uploadRef.current}
                                    user={user}
                                    fontFamily={fontFamily}
                                    colorText={colorText}
                                    colorBg={colorBg}
                                    file={uploadPre}
                                    valueText={inputValue.dis}
                                    dataText={dataTextPreView}
                                    token={token}
                                    userId={userId}
                                    handleImageUpload={handleImageUpload}
                                    dataCentered={dataCentered}
                                    setDataCentered={setDataCentered}
                                    dataCenteredPre={dataCenteredPre}
                                    setDataCenteredPre={setDataCenteredPre}
                                    handleClear={handleClear}
                                    include={include}
                                    setInclude={setInclude}
                                    hashTags={hashTags} // hashTags
                                />
                            )}
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
