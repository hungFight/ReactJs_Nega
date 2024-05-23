import React, { useRef, useState } from 'react';
import { ArrowRightI, CameraI, SendOPTI } from '~/assets/Icons/Icons';
import { DivFlexPosition } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { Label } from '../FormUpNews/styleFormUpNews';
import QuillText from '~/reUsingComponents/Libraries/QuillText';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { PropsUser } from 'src/App';
import ReactQuill from 'react-quill';
import { PropsValueQuill } from '../FormUpNews/FormUpNews';

const ReplyComment: React.FC<{
    onAc: boolean;
    you: PropsUser;
    activate: '' | 'anonymousMale' | 'anonymousFemale';
    handleAnonymousComment: () => void;
    anonymous: boolean;
    anonymousIndex: 'anonymousComment';
    anony: {
        id: string;
        name: string;
    }[];
    handleComment: (reply_com?: { id: string; name: string; id_user: string; title: string; text: string; file?: string | undefined }) => Promise<void>;
    setOnAC: React.Dispatch<React.SetStateAction<boolean>>;
    onChange: (value: string, placeholder: string, isReply?: boolean, id_comment?: string) => void;
    r: {
        id: string;
        name: string;
        id_user: string;
        title: string;
        text: string;
        file?: string | undefined;
    };
}> = ({ onAc, you, activate, handleAnonymousComment, anony, anonymous, anonymousIndex, handleComment, setOnAC, onChange, r }) => {
    const quillRef = useRef<ReactQuill | null>(null);
    const consider = useRef<number>(0);
    const valueQuill = useRef<PropsValueQuill>({ url: '', text: '' });
    const tagDivURL = useRef<HTMLDivElement | null>(null);
    const [insertURL, setInsertURL] = useState<boolean>(false);
    return (
        <Div width="100%">
            <Div width="1px" height="40px" css="background-color: #4f4f4f; margin-left: 7px"></Div>
            <Div
                width="100%"
                css={`
                    border-bottom: 1px solid #4f4f4f;
                    align-items: flex-start;
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
                        margin: 0;
                        z-index: 2;
                        background-color: #4e4e4e;
                    }
                `}
            >
                <Avatar
                    src={!onAc ? you.avatar : ''}
                    alt="son-tung"
                    staticI={onAc}
                    gender={activate}
                    radius="50%"
                    css={`
                        width: 30px;
                        height: 30px;
                    `}
                    onClick={handleAnonymousComment}
                >
                    {anonymous && anony.some((a) => a.id === anonymousIndex) ? ( // anonymous comment
                        <Div
                            css={`
                                position: absolute;
                                top: 40px;
                                width: fit-content;
                                padding: 4px 10px;
                                background-color: #1c5689;
                                border-radius: 5px;
                                left: 14px;
                                cursor: var(--pointer);
                            `}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOnAC(!onAc);
                            }}
                        >
                            <Avatar css="width: 30px; height: 30px; min-width: 30px; margin-right: 3px;" src={onAc ? you.avatar : ''} staticI={!onAc} radius="50%" gender={activate} />
                            <P z="1.5rem">{onAc ? you.fullName : 'Anonymous'}</P>
                        </Div>
                    ) : (
                        <></>
                    )}
                </Avatar>
                <Div css="font-size: 20px;margin-top: 5px;">
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
                <Div width="70%" css="position: relative;">
                    <QuillText
                        consider={consider}
                        css={`
                            width: 100%;
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
                                font-size: 1.3rem;
                            }
                        `}
                        insertURL={insertURL}
                        setInsertURL={setInsertURL}
                        onChange={(e) => onChange(e, 'placeholder_comment_post_reply', true, r.id)}
                        quillRef={quillRef}
                        tagDivURL={tagDivURL}
                        valueQuill={valueQuill}
                        valueText={r.text}
                    />
                    <DivFlexPosition id="placeholder_comment_post_reply" css="cursor: auto !important; pointer-events: none;opacity: 0.9;" top="7px" left="11px" size="1.2rem">
                        {r.title}
                        <ArrowRightI /> {r.name}
                    </DivFlexPosition>
                </Div>
                <Div css="font-size: 20px; cursor: var(--pointer);margin-top: 5px;" onClick={() => handleComment(r)}>
                    <SendOPTI />
                </Div>
            </Div>
        </Div>
    );
};

export default ReplyComment;
