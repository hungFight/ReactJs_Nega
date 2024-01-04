import { useState } from 'react';
import { ImageI } from '~/assets/Icons/Icons';
import { Buttons, Div, H3 } from '~/reUsingComponents/styleComponents/styleDefault';
import { Label } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';

const SettingOtherProfile: React.FC<{
    editP: { name: string; id: number; icon?: { id: number; name: string }[] }[];
    colorText: string;
}> = ({ editP, colorText }) => {
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
        <>
            <Div
                wrap="wrap"
                css="background-color: #252525; position: absolute; right: 55px; top: -14px; border-radius: 5px; z-index: 2;"
            >
                <H3 css="width: 100%; text-align: center; font-size: 1.4rem; padding: 10px 5px 5px 5px;">Editor</H3>
                {editP.map((ed) => (
                    <Div
                        key={ed.id}
                        width="100%"
                        wrap="wrap"
                        css="justify-content: center; padding: 3px; margin: 5px; background-color: #636363; font-size: 1.4rem; form{width: 100%;}"
                        onClick={(e) => handleMore(e, ed.id)}
                    >
                        <Div id="edit" width="100%" css="cursor: pointer; justify-content: center;" onClick={() => {}}>
                            {ed.name}
                        </Div>
                    </Div>
                ))}
            </Div>
        </>
    );
};
export default SettingOtherProfile;
