import { useState } from 'react';
import { PropsUserPer } from 'src/App';
import { ChangeI, CheckI, CopyI, GarbageI, ImageI } from '~/assets/Icons/Icons';
import { Buttons, Div, H3, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { Label } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';

const EditP: React.FC<{
    editP: { name: string; id: number; icon?: { id: number; name: string }[] }[];
    onClick: (e?: any, id?: number) => void;
    onText: (id: number) => Promise<void>;
    colorText: string;
    setEditTitle: React.Dispatch<React.SetStateAction<boolean>>;
    editTitle: boolean;
    AllArray: PropsUserPer[];
    userId: string;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ editP, onClick, onText, colorText, setEditTitle, editTitle, AllArray, userId, setEdit }) => {
    const [more, setMore] = useState<number | null>(null);
    const handleMore = (e: any, id: number) => {
        if (id === 4) setEditTitle(!editTitle);
        if (e.target.getAttribute('id') === 'edit') {
            if (id !== more) {
                setMore(id);
            } else {
                setMore(null);
            }
        }
    };
    return (
        <>
            <Div
                wrap="wrap"
                css="width: 300px; box-shadow: 0px 2px 5px #121212; padding: 8px 0;background-color: #1e1f25; position: absolute; right: 0px; top: -14px; border-radius: 5px; z-index: 2; @media(min-width: 370px){right: 55px;}"
                onClick={(e) => e.stopPropagation()}
            >
                {editP.map((ed) => (
                    <Div
                        key={ed.id}
                        width="100%"
                        wrap="wrap"
                        css=" padding: 3px; margin: 5px;  font-size: 1.4rem; form{width: 100%;}"
                        onClick={(e) => handleMore(e, ed.id)}
                    >
                        <Div
                            id="edit"
                            width="100%"
                            css="cursor: pointer; justify-content: start; padding-left: 15px"
                            onClick={() => {
                                if (ed.id === 2 || ed.id === 3) onText(ed.id);
                            }}
                        >
                            {ed.name}
                        </Div>
                        {more === ed.id && ed.icon && (
                            <Div width="100%" css="justify-content: start; align-items: center; padding: 5px 10px;">
                                {ed.icon?.map((i) => (
                                    <Div
                                        key={i.id}
                                        css="font-size: 20px; margin: 0 5px; background-color: #434546; &:hover{background-color: #0c769e;} border-radius: 5px; "
                                    >
                                        {i.id === 1 ? (
                                            <form encType="multipart/form-data">
                                                <input
                                                    id={`uploads${ed.id}`}
                                                    type="file"
                                                    name="file[]"
                                                    hidden
                                                    onChange={(e) => onClick(e, ed.id)}
                                                />
                                                <Label
                                                    htmlFor={`uploads${ed.id}`}
                                                    color={colorText}
                                                    css="padding: 5px 15px;"
                                                >
                                                    <ChangeI />
                                                </Label>
                                            </form>
                                        ) : (
                                            <Buttons
                                                text={[
                                                    {
                                                        text: <GarbageI />,
                                                        css: `color:${colorText}; box-shadow: none; padding: 7px 16px;`,
                                                        onClick: (e: any) => onClick(e, ed.id),
                                                    },
                                                ]}
                                            />
                                        )}
                                    </Div>
                                ))}
                            </Div>
                        )}
                    </Div>
                ))}
                <Div
                    color={colorText}
                    width="100%"
                    css="padding-left: 23px; margin-top: 5px; cursor: var(--pointer)"
                    onClick={() => {
                        navigator.clipboard.writeText(`${process.env.REACT_APP_ROUTE}profile?id=${userId}`);
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
        </>
    );
};
export default EditP;
