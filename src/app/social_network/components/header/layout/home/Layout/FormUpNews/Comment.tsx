import { Div, DivFill, DivFlex, DivNone, Img, Input, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivComment, Label } from './styleFormUpNews';
import {
    BanI,
    CameraI,
    EscalatorI,
    PostCommentInI,
    ResetI,
    SendI,
    SendOPTI,
    UndoIRegister,
} from '~/assets/Icons/Icons';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { useState } from 'react';

const Comment: React.FC<{
    anony: {
        id: number;
        name: string;
    }[];
    setShowComment: React.Dispatch<React.SetStateAction<boolean>>;
    colorText: string;
}> = ({ anony, setShowComment, colorText }) => {
    const anonymousIndex = 4;
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
        { id: 3, icon: 'Bạn bè' },
    ];
    return (
        <DivComment onClick={(e) => e.stopPropagation()}>
            <Div
                width="100%"
                css={`
                    height: 30%;
                    background-color: #202023;
                    opacity: 0.5;
                `}
                onClick={() => setShowComment(false)}
            ></Div>
            <Div
                width="100%"
                wrap="wrap"
                css={`
                    height: 70%;
                    background-color: #18191b6b;
                    position: relative;
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
                    <DivPos size="20px" top="3px" left="6px" onClick={() => setShowComment(false)}>
                        <UndoIRegister />
                    </DivPos>
                    <P z="1.4rem">Comment</P>
                    <DivPos size="20px" top="3px" right="6px">
                        <ResetI />
                    </DivPos>
                </Div>

                <DivFill css=" padding: 10px 35px">
                    <DivFill css="heigh: 100%; border-top: 1px solid #545454; border-left: 1px solid #545454;border-right: 1px solid #545454; border-top-right-radius: 5px;border-top-left-radius: 5px">
                        <DivFlex justify="start" css="padding: 4px">
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
                                    margin: 5px 0;
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
                                <Input
                                    placeholder="Comment"
                                    width="70%"
                                    border="0"
                                    radius="50px"
                                    color={colorText}
                                    background="#454545;"
                                />
                                <Div css="font-size: 20px">
                                    <SendOPTI />
                                </Div>
                            </Div>
                        </DivFill>
                    </DivFill>
                    <DivFill>
                        <DivNone width="100px" height="1px" border="1px solid"></DivNone>
                    </DivFill>
                </DivFill>
            </Div>
        </DivComment>
    );
};
export default Comment;
