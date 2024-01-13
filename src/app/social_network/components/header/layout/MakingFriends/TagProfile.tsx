import { memo } from 'react';
import Avatar from '../../../../../reUsingComponents/Avatars/Avatar';
import { DivContainer, DivImg, Hname } from '../../../../../reUsingComponents/styleComponents/styleComponents';
import { Button, Buttons, Div, P } from '../../../../../reUsingComponents/styleComponents/styleDefault';
import { setOpenProfile } from '~/redux/hideShow';
import { useDispatch } from 'react-redux';
import CommonUtils from '~/utils/CommonUtils';
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
        <Div width="100%" wrap="wrap" css=" align-items: center;">
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
                <Avatar
                    profile="po"
                    css={cssImage}
                    src={data.avatar}
                    alt={data.fullName}
                    gender={data.gender}
                    id={data.id}
                />
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
    );
};
export default memo(TagProfile);
