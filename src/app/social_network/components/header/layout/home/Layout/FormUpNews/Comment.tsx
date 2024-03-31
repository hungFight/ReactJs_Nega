import {
    Div,
    DivFill,
    DivFlex,
    DivFlexPosition,
    DivNone,
    Img,
    Input,
    P,
    Textarea,
} from '~/reUsingComponents/styleComponents/styleDefault';
import { DivComment, Label } from './styleFormUpNews';
import {
    BanI,
    CameraI,
    DotI,
    EscalatorI,
    MinusI,
    PostCommentInI,
    ResetI,
    SendI,
    SendOPTI,
    UndoIRegister,
} from '~/assets/Icons/Icons';
import { DivPos, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { useRef, useState } from 'react';
import { BsDot } from 'react-icons/bs';
import { FcReadingEbook } from 'react-icons/fc';
import QuillText from '~/reUsingComponents/Libraries/QuillText';
import { PropsValueQuill } from './FormUpNews';
import ReactQuill from 'react-quill';

const Comment: React.FC<{
    anony: {
        id: number;
        name: string;
    }[];
    setShowComment: React.Dispatch<React.SetStateAction<string>>;
    colorText: string;
}> = ({ anony, setShowComment, colorText }) => {
    const anonymousIndex = 4;
    const textarea = useRef<HTMLTextAreaElement | null>(null);
    const quillRef = useRef<ReactQuill>(null);
    const consider = useRef<number>(0);
    const valueQuill = useRef<PropsValueQuill>({ url: '', text: '' });
    const valueSelected = useRef<boolean>(false);
    const tagDivURL = useRef<HTMLDivElement | null>(null);
    const [insertURL, setInsertURL] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');
    const [anonymous, setAnonymous] = useState<boolean>(false);
    const [activate, setActivate] = useState<number>(1);
    const handleComment = () => {
        setAnonymous(!anonymous);
    };
    console.log(activate, anony, 'anonymous');
    const iconDatas = [
        { id: 1, icon: 'Mới nhất' },
        { id: 2, icon: 'Cũ nhất' },
        { id: 3, icon: 'Nhiều lượt thích nhất' },
        { id: 4, icon: 'Bạn bè' },
    ];
    const handleOnKeyup = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // handleSend(conversation?._id, conversation?.user.id);
        } else {
            e.target.setAttribute('style', 'height: auto');
            if (e.key === 'Backspace') {
                e.target.setAttribute(
                    'style',
                    `height: ${value ? e.target.scrollHeight : e.target.scrollHeight - 16}px`,
                );
            } else {
                e.target.setAttribute('style', `height: ${e.target.scrollHeight}px`);
            }
        }
    };
    const handleOnKeyDown = (e: any) => {
        console.log(e.key);
        if (e.key === 'Enter') e.preventDefault();
        if (e.key === 'Alt') {
            e.preventDefault();
            e.target.value += '\n';
        }
    };
    const handleWriteText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log(e.target.value, 'enter');
        setValue(e.target.value);
    };
    const onChange = (value: string) => {};
    return (
        <DivComment onClick={(e) => e.stopPropagation()}>
            <DivFill
                css={`
                    height: 100%;
                    background-color: #24262a;
                    position: relative;
                    @media (min-width: 550px) {
                        background-color: #18191b6b;
                    }
                `}
            >
                <Div
                    width="100%"
                    css={`
                        height: 30px;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        border-bottom: 1px solid #494949;
                    `}
                >
                    <DivPos size="20px" top="3px" left="6px" onClick={() => setShowComment('')}>
                        <UndoIRegister />
                    </DivPos>
                    <P z="1.4rem">Comment</P>{' '}
                    <Div css="margin-right: 5px;">
                        <FcReadingEbook />
                    </Div>{' '}
                    <DivPos size="20px" top="3px" right="6px">
                        <ResetI />
                    </DivPos>
                </Div>

                <DivFill css=" padding: 10px 14px">
                    <DivFill css="heigh: 100%; border-top: 1px solid #545454; border-left: 1px solid #545454;border-right: 1px solid #545454; border-top-right-radius: 5px;border-top-left-radius: 5px">
                        <DivFlex justify="start" css="padding: 9px">
                            {iconDatas.map((i) => (
                                <P
                                    z="1.3rem"
                                    key={i.id}
                                    css={`
                                        padding: 0 5px;
                                        cursor: var(--pointer);
                                        ${i.id === 1 ? 'border-bottom: 1px solid;' : ''}
                                    `}
                                >
                                    {i.icon}
                                </P>
                            ))}
                        </DivFlex>
                        <DivFill css="border-top: 1px solid #494848;">
                            <Div
                                width="100%"
                                css={`
                                    height: 40px;
                                    align-items: center;
                                    justify-content: space-around;
                                    padding: 5px;
                                    margin: 11px 0;
                                    input {
                                        padding: 8px 14px;
                                    }
                                    @media (max-width: 550px) {
                                        input {
                                            padding: 8px;
                                        }
                                        position: absolute;
                                        bottom: 2px;
                                        left: 0;
                                        background-color: transparent;
                                    }
                                `}
                            >
                                <Avatar
                                    src={
                                        activate < 5
                                            ? 'https://gaixinhbikini.com/wp-content/uploads/2023/02/anh-gai-dep-2k-005.jpg'
                                            : ''
                                    }
                                    alt="son-tung"
                                    gender={activate}
                                    radius="50%"
                                    css={`
                                        width: 30px;
                                        height: 30px;
                                    `}
                                    onClick={handleComment}
                                >
                                    {anonymous && anony.some((a) => a.id === anonymousIndex) ? ( // anonymous comment
                                        <Div
                                            css={`
                                                position: absolute;
                                                top: 0px;
                                                width: fit-content;
                                                padding: 4px 10px;
                                                background-color: #1c5689;
                                                border-radius: 5px;
                                                left: 0;
                                                cursor: var(--pointer);
                                            `}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (activate === 0) {
                                                    setActivate(11);
                                                } else if (activate === 1) {
                                                    setActivate(12);
                                                } else if (activate === 11) {
                                                    setActivate(0);
                                                } else if (activate === 12) {
                                                    setActivate(1);
                                                }
                                            }}
                                        >
                                            <Avatar
                                                css="width: 30px; height: 30px; min-width: 30px; margin-right: 3px;"
                                                src={
                                                    activate > anonymousIndex
                                                        ? 'https://gaixinhbikini.com/wp-content/uploads/2023/02/anh-gai-dep-2k-005.jpg'
                                                        : ''
                                                }
                                                radius="50%"
                                                gender={
                                                    activate === 0 ? 11 : activate === 1 ? 12 : activate === 11 ? 0 : 1
                                                }
                                            />
                                            <P z="1.5rem">{activate > anonymousIndex ? 'hung' : 'Anonymous'}</P>
                                        </Div>
                                    ) : (
                                        <></>
                                    )}
                                </Avatar>
                                <Div css="font-size: 20px">
                                    <input
                                        id="uploadC"
                                        type="file"
                                        name="file[]"
                                        // onChange={handleImageUpload}
                                        multiple
                                        hidden
                                    />
                                    <Label htmlFor="uploadC">
                                        <CameraI />
                                    </Label>
                                </Div>
                                {/* <Textarea
                                    ref={textarea}
                                    width="70%"
                                    height="32px"
                                    placeholder="comment"
                                    value={value}
                                    bg="#333333"
                                    color="white"
                                    radius="10px"
                                    size="1.4rem"
                                    padding="8px 14px"
                                    border="0"
                                    css={`
                                        overflow-y: overlay;
                                    `}
                                    onKeyDown={(e) => handleOnKeyDown(e)}
                                    onKeyUp={(e) => handleOnKeyup(e)}
                                    onChange={handleWriteText}
                                /> */}
                                <QuillText
                                    consider={consider}
                                    css={`
                                        width: 70%;
                                        background-color: #373737;
                                        border-radius: 10px;
                                        padding: 5px 10px;
                                        .ql-editor {
                                            outline: none;
                                        }
                                        .ql-container.ql-snow {
                                            border: 0;
                                        }
                                        * {
                                            font-size: 1.4rem;
                                        }
                                    `}
                                    insertURL={insertURL}
                                    setInsertURL={setInsertURL}
                                    onChange={onChange}
                                    quillRef={quillRef}
                                    tagDivURL={tagDivURL}
                                    valueQuill={valueQuill}
                                    valueText=""
                                />
                                <Div css="font-size: 20px">
                                    <SendOPTI />
                                </Div>
                            </Div>
                        </DivFill>
                        <DivFill css="@media(min-width: 550px){margin-top: 15px;}">
                            <DivFlex justify="start" css="margin-bottom: 40px">
                                <DivNone
                                    width="40px"
                                    css="border-bottom: 1px solid #4f4f4f; @media(min-width: 550px){width: 100px}"
                                ></DivNone>
                                <DivFlexPosition wrap="wrap" position="relative">
                                    <DivFlex>
                                        <Avatar
                                            src=""
                                            alt=""
                                            gender={1}
                                            css="min-width: 30px; width: 30px; height: 30px; margin: 0 5px;"
                                            radius="50%"
                                        />
                                        <DivFlex wrap="wrap" justify="start">
                                            <Hname>Nguyen Thi Han</Hname>
                                            <Div>
                                                <Div css="margin-right: 5px;">
                                                    <FcReadingEbook />
                                                </Div>{' '}
                                                <P z="1.2rem">These are what I want to be</P>
                                            </Div>
                                        </DivFlex>
                                    </DivFlex>
                                    <DivFlexPosition justify="start" bottom="-25px" position="absolute">
                                        <BsDot /> <P z="1.1rem">10 phút</P>{' '}
                                        <P z="1.1rem" css="margin: 0 5px">
                                            -
                                        </P>
                                        <P
                                            z="1.1rem"
                                            css="cursor: var(--pointer); &:hover{text-decoration: underline;}font-weight: 600;"
                                        >
                                            Cảm xúc
                                        </P>
                                        <P z="1.1rem" css="margin: 0 5px">
                                            -
                                        </P>
                                        <P
                                            z="1.1rem"
                                            css="cursor: var(--pointer); &:hover{text-decoration: underline;}font-weight: 600;"
                                        >
                                            trả lời
                                        </P>{' '}
                                        <P z="1.1rem" css="margin: 0 5px">
                                            -
                                        </P>
                                        <P
                                            z="1.1rem"
                                            css="cursor: var(--pointer); &:hover{text-decoration: underline;}font-weight: 600;"
                                        >
                                            Nhắc đến
                                        </P>{' '}
                                        <P z="1.1rem" css="margin: 0 5px">
                                            -
                                        </P>
                                        <Div css="cursor: var(--pointer); font-size: 25px;">
                                            <DotI />
                                        </Div>
                                    </DivFlexPosition>
                                </DivFlexPosition>
                            </DivFlex>{' '}
                            <DivFlex justify="start" css="margin-bottom: 40px">
                                <DivNone
                                    width="40px"
                                    css="border-bottom: 1px solid #4f4f4f; @media(min-width: 550px){width: 100px}"
                                ></DivNone>
                                <DivFlexPosition wrap="wrap" position="relative">
                                    <DivFlex>
                                        <Avatar
                                            src=""
                                            alt=""
                                            gender={1}
                                            css="min-width: 30px; width: 30px; height: 30px; margin: 0 5px;"
                                            radius="50%"
                                        />
                                        <DivFlex wrap="wrap" justify="start">
                                            <Hname>Nguyen Hung</Hname>
                                            <Div>
                                                <Div css="margin-right: 5px;">
                                                    <FcReadingEbook />
                                                </Div>{' '}
                                                <P z="1.2rem">Wow Awesome</P>
                                            </Div>
                                        </DivFlex>
                                    </DivFlex>
                                    <DivFlexPosition justify="start" bottom="-25px" position="absolute">
                                        <BsDot /> <P z="1.1rem">10 phút</P>
                                        <P z="1.1rem" css="margin: 0 5px">
                                            -
                                        </P>
                                        <P
                                            z="1.1rem"
                                            css="cursor: var(--pointer); &:hover{text-decoration: underline;}font-weight: 600;"
                                        >
                                            Cảm xúc
                                        </P>
                                        <P z="1.1rem" css="margin: 0 5px">
                                            -
                                        </P>
                                        <P
                                            z="1.1rem"
                                            css="cursor: var(--pointer); &:hover{text-decoration: underline;}font-weight: 600;"
                                        >
                                            trả lời
                                        </P>{' '}
                                        <P z="1.1rem" css="margin: 0 5px">
                                            -
                                        </P>
                                        <P
                                            z="1.1rem"
                                            css="cursor: var(--pointer); &:hover{text-decoration: underline;}font-weight: 600;"
                                        >
                                            Nhắc đến
                                        </P>{' '}
                                        <P z="1.1rem" css="margin: 0 5px">
                                            -
                                        </P>
                                        <Div css="cursor: var(--pointer); font-size: 25px;">
                                            <DotI />
                                        </Div>
                                    </DivFlexPosition>
                                </DivFlexPosition>
                            </DivFlex>
                        </DivFill>
                    </DivFill>
                </DivFill>
            </DivFill>
        </DivComment>
    );
};
export default Comment;
