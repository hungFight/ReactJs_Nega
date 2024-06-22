import { memo } from 'react';
import { Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import { Buttons, Div } from '~/reUsingComponents/styleComponents/styleDefault';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
interface PropsTagP {
    data: {
        id: string;
        fullName: string;
        avatar: string | undefined;
        gender: number;
    };
    onClick?: (id: string) => void;
    button?: { css: string; text: string; onClick?: (args: any) => void }[];
    margin?: string;
    bg?: string;
    cssImage?: string;
    colorText?: string;
}
const TagProfile: React.FC<PropsTagP> = ({ data, onClick, button, margin, bg, colorText, cssImage }) => {
    return (
        <Div
            wrap="wrap"
            css={`
                width: 185px;
                padding: 1px;
                border: 1px solid #414141;
                margin: 10px auto;
                transition: all 0.2s linear;
                position: relative;
                background-image: linear-gradient(13deg, #00ffff73, #784fbf, #ff16165e);
                opacity: 0.9;
                &:hover {
                    box-shadow: 0 0 4px #6a48bc;
                }
                @media (min-width: 480px) {
                    width: 306px;
                    margin: 10px;
                }
                @media (min-width: 769px) {
                    width: 190px;
                    height: fit-content;
                    flex-wrap: wrap;
                    justify-content: center;
                    text-align: center;
                    background-color: #292a2c;
                    border-radius: 5px;
                }
            `}
        >
            <Div width="100%" wrap="wrap" css=" align-items: center; background-color: #292a2c; padding: 0 0 12px;">
                <Div
                    width="100%"
                    css={`
                        align-items: center;
                        padding: 5px;
                        @media (min-width: 769px) {
                            padding: 0;
                            width: 100%;
                            flex-wrap: wrap;
                            justify-content: center;
                        }
                    `}
                >
                    <Avatar profile="po" css={cssImage} src={data.avatar} alt={data.fullName} gender={data.gender} id={data.id} />
                    <Div
                        width="100%"
                        wrap="wrap"
                        css={`
                            height: 45px;
                            color: ${colorText || '#cbcbcb'};
                            @media (min-width: 769px) {
                                margin-top: 7px;
                                justify-content: center;
                                text-align: center;
                                cursor: var(--pointer);
                            }
                        `}
                    >
                        <Hname>{data.fullName}</Hname>
                    </Div>
                </Div>
                {button && (
                    <Div
                        width="100%"
                        css={`
                            justify-content: space-evenly;
                            padding: 8px 0;
                            background-color: #414141;
                            @media (min-width: 769px) {
                                flex-wrap: wrap;
                                padding: 0;
                                background-color: transparent;
                                margin-top: 8px;
                            }
                        `}
                    >
                        <Buttons text={button} />
                    </Div>
                )}
            </Div>
        </Div>
    );
};
export default memo(TagProfile);
