import { useEffect, useState } from 'react';
import { Div, P, Span } from '../styleComponents/styleDefault';
import { BeforeI, CheckI, NextI, OclockI, PrivateI, ResetI, UndoIRegister } from '~/assets/Icons/Icons';
import { DivFlexPosition } from '../styleComponents/styleComponents';
import LogicText from './logicOpFeature';

const OpFeatureSetting: React.FC<{
    setOptions: React.Dispatch<React.SetStateAction<boolean>>;
    valuePrivacy: { id: string; name: string }[];
    typeExpire: { cate: number; value: number } | undefined;
    setValuePrivacy: React.Dispatch<
        React.SetStateAction<
            {
                id: string;
                name: string;
            }[]
        >
    >;
    setTypeExpire: React.Dispatch<
        React.SetStateAction<
            | {
                  cate: number;
                  name: string;
                  value: number;
              }
            | undefined
        >
    >;
    setMore: React.Dispatch<React.SetStateAction<number[]>>;
    more: number[];
    setOpSelect: React.Dispatch<React.SetStateAction<string[]>>;
    OpSelect: string[];
    setImotions: React.Dispatch<
        React.SetStateAction<
            {
                id: number;
                icon: string;
            }[]
        >
    >;
    Imotions: { id: number; icon: string }[];
    ImotionsDel: {
        id: number;
        icon: string;
    }[];
    setImotionsDel: React.Dispatch<
        React.SetStateAction<
            {
                id: number;
                icon: string;
            }[]
        >
    >;
    valueSeePost: {
        id: string;
        name: string;
        icon: React.ReactElement;
    };
    setValueSeePost: React.Dispatch<
        React.SetStateAction<{
            id: string;
            name: string;
            icon: React.ReactElement;
        }>
    >;
}> = ({
    typeExpire,
    valuePrivacy,
    setTypeExpire,
    setValuePrivacy,
    setOptions,
    setMore,
    more,
    setOpSelect,
    OpSelect,
    setImotions,
    Imotions,
    ImotionsDel,
    setImotionsDel,
    valueSeePost,
    setValueSeePost,
}) => {
    const { option, handleReset, handleFirst, handleImotion, privateIndex, seenIndex } = LogicText(
        valuePrivacy,
        setTypeExpire,
        setValuePrivacy,
        setOpSelect,
        setImotions,
        Imotions,
        ImotionsDel,
        setImotionsDel,
        valueSeePost,
        setValueSeePost,
    );
    return (
        <Div
            display="block"
            css={`
                position: absolute;
                right: 0px;
                top: 0px;
                width: 100%;
                height: 100%;
                overflow-y: overlay;
                background-color: #292a2d;
                z-index: 10;
                padding: 10px;
            `}
        >
            <Div width="100%" css="justify-content: space-between;">
                <Div width="30px" css="height: 30px; font-size: 20px; align-items: center; justify-content: center;  cursor: var(--pointer);" onClick={() => setOptions(false)}>
                    <UndoIRegister />
                </Div>
                <Div width="50px" css="align-items: center; justify-content: space-evenly;">
                    {typeExpire && <OclockI />}
                    {valuePrivacy.length > 0 && <PrivateI />}
                </Div>
                <Div width="30px" css="height: 30px; font-size: 20px; align-items: center; justify-content: center;" onClick={handleReset}>
                    <ResetI />
                </Div>
            </Div>
            {option.map((rs, index, arr) => (
                <Div
                    width="100%"
                    wrap="wrap"
                    key={rs.id}
                    css={`
                        padding: 8px;
                        margin: 3px 0;
                        background-image: ${rs.title.backgroundImage};
                        ${more.includes(rs.id) ? '' : 'cursor: var(--pointer);'}
                        ${index === 0 && 'border-top-right-radius: 5px;border-top-left-radius: 5px'};
                        ${index === arr.length - 1 && 'border-bottom-right-radius: 5px;border-bottom-left-radius: 5px'}
                    `}
                >
                    <Div
                        css="font-size: 1.4rem; width: 100%;display: flex; align-items: flex-end;"
                        onClick={() => {
                            if (!more.includes(rs.id)) {
                                setMore([...more, rs.id]);
                            } else {
                                setMore(() => more.filter((v) => v !== rs.id));
                            }
                        }}
                    >
                        {rs.title.name}{' '}
                        {rs.id === privateIndex && valuePrivacy.length > 0 && (
                            <>
                                <Span css="margin-left: 10px; color: #53d4bf;">(</Span>
                                {valuePrivacy.map((v, index) => (
                                    <P
                                        key={v.id}
                                        z="1.2rem"
                                        css={`
                                            margin-left: 3px;
                                            margin-right: ${valuePrivacy.length === index + 1 ? '3px' : '0'};
                                        `}
                                    >
                                        {v.name + (valuePrivacy.length === index + 1 ? '' : ',')}
                                    </P>
                                ))}
                                <Span css=" color: #53d478;">)</Span>
                            </>
                        )}
                        {rs.id === seenIndex && valueSeePost && (
                            <>
                                <Span css="margin-left: 10px; color: #53d4bf;">(</Span>
                                <P
                                    z="1.2rem"
                                    css={`
                                        margin-left: 3px;
                                        margin-right: 3px;
                                    `}
                                >
                                    {valueSeePost.name}
                                </P>
                                <Span css=" color: #53d478;">)</Span>
                            </>
                        )}
                    </Div>
                    {more.includes(rs.id) && (
                        <Div width="100%" wrap="wrap" css="margin-top: 5px; padding: 10px; border-radius: 5px; background-color: #272727;" onClick={(e) => e.stopPropagation()}>
                            {rs.title.children.map((child, index2, ar2) => (
                                <Div
                                    width="100%"
                                    wrap="wrap"
                                    key={child.id}
                                    css={`
                                        position: relative;
                                        padding: 4px;
                                        cursor: var(--pointer);
                                        &:hover {
                                            background-color: #3a3a3a;
                                        }
                                        ${index2 === 0 && 'border-top-right-radius: 5px;border-top-left-radius: 5px'};
                                        ${index2 === ar2.length - 1 && 'border-bottom-right-radius: 5px;border-bottom-left-radius: 5px'}
                                    `}
                                >
                                    <P
                                        z="1.3rem"
                                        css={`
                                            width: 100%;
                                            /* ${OpSelect?.includes(child.id + `2`) && ' padding: 5px 0;'} */
                                        `}
                                        onClick={() => handleFirst(rs, child)}
                                    >
                                        {child.name}
                                    </P>
                                    {Array.isArray(child.icon) ? (
                                        <Div
                                            width="100%"
                                            wrap="wrap"
                                            css={`
                                                justify-content: center;
                                                background-color: ${typeof child.icon[0] === 'number' ? '#1c5689' : '#5c5c5c'};
                                                padding: 8px;
                                                border-radius: 5px;
                                            `}
                                        >
                                            {child.icon.map((s: { id: number; icon: string }, index, arr) => (
                                                <Div
                                                    key={s.id}
                                                    width="30px"
                                                    css={`
                                                        height: 30px;
                                                        justify-content: center;
                                                        align-items: center;
                                                        ${Imotions.some((i) => i.id === s.id) && 'background-color: #2f2f2f;'}
                                                        ${index === 0 && 'border-top-left-radius: 5px; border-bottom-left-radius: 5px'};
                                                        ${index === arr.length - 1 && 'border-top-right-radius: 5px; border-bottom-right-radius: 5px'};
                                                    `}
                                                    onClick={() => handleImotion(s)}
                                                >
                                                    {s.icon}
                                                </Div>
                                            ))}
                                        </Div>
                                    ) : (
                                        <>
                                            {valuePrivacy.some((p) => p.id === child.id) && rs.id === 1 && (
                                                <DivFlexPosition top="5px" left="150px" color="#61ff61;">
                                                    <CheckI />
                                                </DivFlexPosition>
                                            )}
                                            {valueSeePost.id === child.id && rs.id === 2 && (
                                                <DivFlexPosition top="5px" left="150px" color="#61ff61;">
                                                    <CheckI />
                                                </DivFlexPosition>
                                            )}
                                        </>
                                    )}
                                </Div>
                            ))}
                        </Div>
                    )}
                </Div>
            ))}
        </Div>
    );
};
export default OpFeatureSetting;
