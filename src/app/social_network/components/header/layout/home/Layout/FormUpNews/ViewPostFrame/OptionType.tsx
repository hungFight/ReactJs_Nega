import { BanI, BeforeI, NextI } from '~/assets/Icons/Icons';
import { Div, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivItemsType, DivsetC } from './styleOptionType';
import OnlyImages from './TypeFile/Grid';
import Coverflow from './TypeFile/Swipers/Coverflow';
import DefaultType from './TypeFile/DefaultType';
import { ReactElement, useState } from 'react';
import { PropsDataFileUpload } from '../FormUpNews';

const OptionType: React.FC<{
    colorText: string;
    colorBg: number;
    file: PropsDataFileUpload[];
    column: number;
    setColumn: React.Dispatch<React.SetStateAction<number>>;
    setSelectType: React.Dispatch<React.SetStateAction<number>>;
    setSelectChild: React.Dispatch<React.SetStateAction<{ id: number; name: string }>>;
    selectChild: { id: number; name: string };
    step: number;
    selectType: number;
}> = ({
    colorText,
    colorBg,
    file,
    setSelectType,
    setColumn,
    selectChild,
    setSelectChild,
    column,
    step,
    selectType,
}) => {
    const [children, setChildren] = useState<{ id: number; name: string; icon?: ReactElement }[]>();
    const postTypes: {
        name: string;
        id: number;
        column?: number;
        children?: { id: number; name: string; icon?: ReactElement }[];
    }[] = [
        {
            name: 'Swiper',
            id: 1,
            children: [
                {
                    id: 1,
                    name: 'Dynamic',
                },
                {
                    id: 2,
                    name: 'Fade',
                },
                {
                    id: 3,
                    name: 'Cards',
                },
                {
                    id: 4,
                    name: 'Coverflow',
                },
                {
                    id: 5,
                    name: 'Centered',
                },
            ],
        },
        { name: 'Layout', id: 2, children: [{ id: 1, name: 'Circle', icon: <Div>Icon</Div> }] },
    ];
    const [swiper, setSwiper] = useState<number>(0);
    console.log('I know that');
    const select = (sl: number) => {
        return selectType === sl;
    };

    return (
        <Div
            width="100%"
            wrap="wrap"
            css={`
                margin: 8px 0;
                align-items: center;
                background-color: #292a2d;
                border-radius: 5px;
                color: ${colorText};
            `}
        >
            {file.length > 4 && (
                <Div width="100%" css="padding: 5px;">
                    <Div>
                        <Div
                            css={`
                                font-size: 2rem;
                                padding: 4px 7px;
                                &:hover {
                                    color: #1eacdc;
                                }
                                ${selectType === 0 ? 'border-bottom: 1px solid #1eacdc;' : ''}
                            `}
                            onClick={() => setSelectType(0)}
                        >
                            <BanI />
                        </Div>
                        {postTypes.map((t) => (
                            <DivItemsType
                                key={t.name}
                                onClick={() => {
                                    setSelectType(t.id);
                                    if (t.children) setChildren(t.children);
                                }}
                                css={`
                                    &:hover {
                                        color: #1eacdc;
                                    }
                                    ${selectType === t.id ? 'border-bottom: 1px solid #1eacdc;' : ''}
                                `}
                            >
                                {t.column ? (
                                    <Div
                                        css={`
                                            align-items: center;
                                            ${step === 1 && select(2)
                                                ? ' width: 50px; position: fixed; top: 55px; flex-direction: column; z-index: 9999; right: 4px; justify-content: center; div{background-color: #4e4343}'
                                                : ''}
                                        `}
                                    >
                                        {!(step === 1 && select(2)) && t.name}
                                        <DivsetC
                                            size={`${step === 1 && selectType === 2 ? '22px' : ''}`}
                                            onClick={() =>
                                                setColumn((pre) =>
                                                    file.length > 6
                                                        ? pre > 3
                                                            ? pre - 1
                                                            : pre
                                                        : file.length > 2
                                                        ? pre > 2
                                                            ? pre - 1
                                                            : pre
                                                        : file.length > 1
                                                        ? pre > 1
                                                            ? pre - 1
                                                            : pre
                                                        : 1,
                                                )
                                            }
                                        >
                                            <BeforeI />
                                        </DivsetC>
                                        {column}
                                        <DivsetC
                                            size={`${step === 1 && select(2) ? '22px' : ''}`}
                                            onClick={() =>
                                                setColumn((pre) => (pre < file.length && pre < 8 ? pre + 1 : pre))
                                            }
                                        >
                                            <NextI />
                                        </DivsetC>
                                    </Div>
                                ) : (
                                    t.name
                                )}
                            </DivItemsType>
                        ))}
                    </Div>
                </Div>
            )}
            {(select(1) || select(2)) && (
                <Div
                    width="90%"
                    wrap="wrap"
                    css={`
                        padding: 5px;
                        background-color: #0b0b0b87;
                        margin: auto;
                        border-radius: 5px;
                        margin-bottom: 5px;
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children?.map((c) => (
                        <Div>
                            <P
                                z="1.3rem"
                                key={c.id}
                                css={`
                                    width: fit-content;
                                    padding: 5px;
                                    margin: 0 8px;
                                    border-radius: 5px;
                                    cursor: var(--pointer);
                                    &:hover {
                                        color: #1eacdc;
                                    }
                                    ${selectChild.id === c.id ? 'border-bottom: 1px solid #1eacdc;' : ''}
                                `}
                                onClick={() => setSelectChild(c)}
                            >
                                {c.name}
                            </P>
                            {c.icon && c.icon}
                        </Div>
                    ))}
                </Div>
            )}
        </Div>
    );
};
export default OptionType;
