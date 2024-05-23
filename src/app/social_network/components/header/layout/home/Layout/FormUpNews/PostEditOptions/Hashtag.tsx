import React, { useState } from 'react';
import { CloseI, HashI, PlusI, SearchI, TagPostI } from '~/assets/Icons/Icons';
import { DivFlexPosition } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, H3, Input, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { v4 as primaryKey } from 'uuid';

const Hashtag: React.FC<{
    setHashTags: React.Dispatch<React.SetStateAction<{ _id: string; value: string }[]>>;
    setOnTags: React.Dispatch<React.SetStateAction<boolean>>;
    hashTagsInitially: { _id: string; value: string }[];
}> = ({ setHashTags: setHash, setOnTags, hashTagsInitially }) => {
    const [hashTags, setHashTags] = useState<{ _id: string; value: string }[]>(hashTagsInitially);
    const [hashTag, setHashTag] = useState<string>('');
    const [realData, setRealData] = useState<{ _id: string; value: string }[]>([
        { _id: '1', value: '#hello' },
        { _id: '2', value: '#world' },
        { _id: '3', value: '#nana' },
        { _id: '4', value: '#football' },
        { _id: '5', value: '#fiction' },
        { _id: '6', value: '#love' },
        { _id: '7', value: '#goodlife' },
    ]);
    return (
        <Div
            css={`
                position: fixed;
                width: 100%;
                height: 100%;
                background-color: #1d1d1da8;
                z-index: 9999;
                top: 0;
                left: 0;
                align-items: end;
                @media (min-width: 500px) {
                    width: 98%;
                    z-index: 0;
                    height: 400px;
                    translate: unset;
                    margin-top: 11px;
                    position: unset;
                }
            `}
            onClick={(e) => {
                e.stopPropagation();
                setOnTags(false);
            }}
            onTouchStart={(e) => e.stopPropagation()}
        >
            <Div
                width="100%"
                display="block"
                css={`
                    height: 100%;
                    padding: 5px 0;
                    position: relative;
                    color: #ededed;
                    background-color: #1a1a1a;
                    @media (min-width: 400px) {
                        height: 100%;
                        box-shadow: 0 0 3px #60a6c7;
                        border-radius: 5px;
                        background-color: #18191b;
                    }
                `}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <H3
                    css={`
                        width: 100%;
                        margin: 3px 0;
                        justify-content: center;
                        padding: 2px 4px;
                        font-size: 1.4rem;
                        display: flex;
                        align-items: center;
                        position: relative;
                    `}
                >
                    <HashI /> Hashtag
                    <DivFlexPosition size="20px" top="3px" left="10px" onClick={() => setOnTags(false)}>
                        <CloseI />
                    </DivFlexPosition>
                </H3>
                <Div
                    width="94%"
                    wrap="wrap"
                    css={`
                        max-height: 140px;
                        background-color: #28282870;
                        margin-top: 10px;
                        border: 1px solid #3f3f3f;
                        margin: auto;
                        margin-top: 10px;
                        border-radius: 10px;
                        overflow: overlay;
                        padding: 5px;
                        @media (min-width: 400px) {
                            max-height: 125px;
                        }
                    `}
                >
                    {hashTags.map((t) => (
                        <P
                            z="1.5rem"
                            key={t._id}
                            css={`
                                height: fit-content;
                                padding: 6px 8px;
                                border-radius: 5px;
                                background-color: #3d3e3fb8;
                                margin-right: 3px;
                                cursor: var(--pointer);
                                margin-bottom: 5px;
                                @media (min-width: 768px) {
                                    font-size: 1.4rem;
                                }
                                &:hover {
                                    background-color: #853737;
                                }
                            `}
                            onClick={() => {
                                if (hashTags.some((ts) => ts.value === t.value)) setHashTags((pre) => pre.filter((ts) => ts.value !== t.value));
                            }}
                        >
                            {t.value}
                        </P>
                    ))}
                </Div>
                <Div
                    width="100%"
                    css="justify-content: end; padding-right: 3px; padding: 0px 5px; margin: 3px 0; cursor: var(--pointer);"
                    onClick={() => {
                        setHash(hashTags);
                        setOnTags(false);
                    }}
                >
                    <P z="1.5rem" css="padding: 5px 10px; border-radius: 5px; background-color: #187bd7; margin-right: 5px; @media(min-width: 768px){margin-right: 10px;}">
                        Done
                    </P>
                </Div>

                <Div
                    display="block"
                    css={`
                        width: 100%;
                        height: 60%;
                        margin-top: 20px;
                        border-top: 1px solid #707070;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                    `}
                >
                    <Div width="100%" display="block" css="height: 100%; position: relative;">
                        <Div css="margin-top: 5px; position: relative">
                            {/* <Div
                                width="50px"
                                css={`
                                    position: absolute;
                                    right: 5px;
                                    top: 3px;
                                    border-radius: 5px;
                                    justify-content: center;
                                    padding: 8px;
                                    background-color: #207394;
                                    box-shadow: 0 0 1px white;
                                    @media (min-width: 768px) {
                                        right: 14px;
                                    }
                                    cursor: var(--pointer);
                                `}
                                onClick={() => {
                                    const occurrences = (hashTag.match(/#/g) || []).length;
                                    if (
                                        hashTag.length > 1 &&
                                        occurrences === 1 &&
                                        !hashTags.some((ts) => ts === hashTag)
                                    ) {
                                        if (!hashTags.includes(hashTag)) {
                                            setHashTags([...hashTags, hashTag]);
                                        }
                                    }
                                    setHashTag('');
                                }}
                            >
                                <PlusI />
                            </Div> */}
                            <Input
                                width="75%"
                                padding="10px 40px 10px 10px"
                                margin="auto"
                                placeholder="Search # tag or add"
                                border="1px solid rgb(47 47 47)"
                                type="text"
                                color="white"
                                value={hashTag}
                                onChange={(e) => {
                                    setHashTag(e.target.value);
                                    const occurrences = (e.target.value.match(/#/g) || []).length;
                                    if (occurrences === 1) {
                                        if (!realData.some((ts) => ts.value === e.target.value)) {
                                            if (!realData.some((v) => v._id === 'dataAdd')) {
                                                setRealData([{ _id: 'dataAdd', value: e.target.value }, ...realData]);
                                            } else {
                                                setRealData((pre) =>
                                                    pre.map((c) => {
                                                        if (c._id === 'dataAdd') {
                                                            c.value = e.target.value;
                                                        }
                                                        return c;
                                                    }),
                                                );
                                            }
                                        } else {
                                            setRealData((pre) => pre.filter((l) => l._id !== 'dataAdd'));
                                        }
                                    }
                                    if (!e.target.value || e.target.value === '#') {
                                        setRealData((pre) => pre.filter((l) => l._id !== 'dataAdd'));
                                    }
                                }}
                                onFocus={() => {
                                    if (hashTag.indexOf('#') < 0) {
                                        setHashTag('#' + hashTag);
                                    }
                                }}
                                onBlur={() => {
                                    if (hashTag === '#') {
                                        setHashTag('');
                                    }
                                }}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        const occurrences = (hashTag.match(/#/g) || []).length;
                                        if (hashTag.length > 1 && occurrences === 1 && !hashTags.some((ts) => ts.value === hashTag)) {
                                            if (!hashTags.some((v) => v.value.includes(hashTag))) {
                                                const uId = primaryKey();
                                                setRealData((pre) =>
                                                    pre.map((c) => {
                                                        if (c._id === 'dataAdd') {
                                                            c._id = uId;
                                                        }
                                                        return c;
                                                    }),
                                                );
                                                setHashTags([...hashTags, { _id: uId, value: hashTag }]);
                                            }
                                        }
                                        setHashTag('#');
                                    }
                                }}
                            />
                            <DivFlexPosition size="25px" right="60px" top="6px" css="@media(min-width: 768px){right: 80px}">
                                <SearchI />
                            </DivFlexPosition>
                        </Div>
                        <Div width="100%" wrap="wrap" css="padding: 10px; margin-top: 15px;">
                            {realData.map((t) => (
                                <P
                                    z="1.5rem"
                                    key={t._id}
                                    css={`
                                        height: fit-content;
                                        padding: 6px 8px;
                                        border-radius: 5px;
                                        background-color: #3d3e3fb8;
                                        margin-right: 3px;
                                        @media (min-width: 768px) {
                                            font-size: 1.4rem;
                                        }
                                        cursor: var(--pointer);
                                        margin-bottom: 5px;
                                        ${hashTags.some((ts) => ts.value === t.value) ? 'background-color: #1f4749;' : ''}
                                        ${hashTag === t.value ? 'background-image: linear-gradient(45deg, black, transparent);box-shadow: 0 0 3px #97b8a8;' : ''}
                                    `}
                                    onClick={() => {
                                        if (!hashTags.some((ts) => ts.value === t.value)) {
                                            setHashTags([...hashTags, t]);
                                        } else {
                                            setHashTags((pre) => pre.filter((ts) => ts.value !== t.value));
                                        }
                                    }}
                                >
                                    {t.value}
                                </P>
                            ))}
                        </Div>
                    </Div>
                </Div>
            </Div>
        </Div>
    );
};

export default Hashtag;
