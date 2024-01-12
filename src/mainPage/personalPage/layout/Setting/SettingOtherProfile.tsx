import { useState } from 'react';
import { PropsUserPer } from 'src/App';
import { CheckI, CopyI, ImageI } from '~/assets/Icons/Icons';
import { Buttons, Div, H3, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { Label } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';

const SettingOtherProfile: React.FC<{
    editP: { name: string; id: number; icon?: { id: number; name: string }[] }[];
    colorText?: string;
    AllArray: PropsUserPer[];
    userId: string;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ editP, colorText, AllArray, userId, setEdit }) => {
    const [more, setMore] = useState<number | null>(null);

    const handleMore = (e: any, id: number) => {};
    // : (
    //                             <Div
    //                                 width="100%"
    //                                 css="justify-content: start; align-items: center; background-color: #2b2c2d; padding: 10px;"
    //                             >
    //                                 {ed.icon?.map((i) => (
    //                                     <Div css="font-size: 1.6rem; padding: 3px 9px; background-color: #434546; border-radius: 5px; ">
    //                                         {i.name}
    //                                     </Div>
    //                                 ))}
    //                             </Div>
    //                         )
    return (
        <Div
            wrap="wrap"
            css="width: 300px; box-shadow: 0px 2px 5px #121212; padding: 8px 0;background-color: #1e1f25; position: absolute; right: 0px; top: -14px; border-radius: 5px; z-index: 2; @media(min-width: 370px){right: 55px;}"
            onClick={(e) => e.stopPropagation()}
        >
            <Div
                color={colorText}
                width="100%"
                css="padding-left: 23px; margin-top: 5px; cursor: var(--pointer)"
                onClick={() => {
                    const copyToClipboard = async (text: string) => {
                        try {
                            await navigator.clipboard.writeText(text);
                            AllArray.forEach((us) => {
                                if (us.id === userId) {
                                    document
                                        .getElementById(`profileCopyId=${userId}`)
                                        ?.setAttribute('style', 'display: flex;');
                                } else {
                                    document
                                        .getElementById(`profileCopyId=${us.id}`)
                                        ?.setAttribute('style', 'display: none;');
                                }
                            });
                            console.log('Text copied to clipboard:', text);
                        } catch (error) {
                            console.error('Clipboard API not available. Falling back to execCommand.');
                            const textarea = document.createElement('textarea');
                            textarea.value = text;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                            AllArray.forEach((us) => {
                                if (us.id === userId) {
                                    document
                                        .getElementById(`profileCopyId=${userId}`)
                                        ?.setAttribute('style', 'display: flex;');
                                } else {
                                    document
                                        .getElementById(`profileCopyId=${us.id}`)
                                        ?.setAttribute('style', 'display: none;');
                                }
                            });
                            console.log('Text copied to clipboard (fallback):', text);
                        }
                    };
                    copyToClipboard(`${process.env.REACT_APP_ROUTE}profile?id=${userId}`);
                }}
            >
                <Div
                    id={`profileCopyId=${userId}`}
                    display="none"
                    css="color: #2aa02a; font-size: 22px; padding: 0 5px;"
                >
                    <CheckI />
                </Div>
                <P z="1.4rem" css="width: max-content;">
                    Copy link of profile
                </P>
                <Div css="padding: 5px;">
                    <CopyI />
                </Div>
            </Div>
            <Div
                width="100%"
                css="padding-left: 23px; margin-top: 5px; cursor: var(--pointer)"
                onClick={() => setEdit(false)}
            >
                <P z="1.4rem" css="width: max-content;">
                    Đóng tap
                </P>
            </Div>
        </Div>
    );
};
export default SettingOtherProfile;
