import React, { useState } from 'react';
import { CloseI, HashI, PlusI, SearchI, TagPostI } from '~/assets/Icons/Icons';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, H3, Input, P } from '~/reUsingComponents/styleComponents/styleDefault';

const Hashtag: React.FC<{
    setHashTags: React.Dispatch<React.SetStateAction<string[]>>;
    setOnTags: React.Dispatch<React.SetStateAction<boolean>>;
    hashTagsInitially: string[];
}> = ({ setHashTags: setHash, setOnTags, hashTagsInitially }) => {
    const [hashTags, setHashTags] = useState<string[]>(hashTagsInitially);
    const [hashTag, setHashTag] = useState<string>('');
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
                @media (min-width: 400px) {
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
                    color: white;
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
                        color: white;
                    `}
                >
                    <HashI /> Hashtag
                    <DivPos size="20px" top="3px" left="10px" onClick={() => setOnTags(false)}>
                        <CloseI />
                    </DivPos>
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
                            z="1.4rem"
                            key={t}
                            css={`
                                height: fit-content;
                                padding: 4px 6px;
                                border-radius: 5px;
                                background-color: #3d3e3fb8;
                                margin-right: 3px;
                                cursor: var(--pointer);
                                margin-bottom: 5px;
                                &:hover {
                                    background-color: #853737;
                                }
                            `}
                            onClick={() => {
                                if (hashTags.some((ts) => ts.toLowerCase() === t.toLowerCase()))
                                    setHashTags((pre) => pre.filter((ts) => ts.toLowerCase() !== t.toLowerCase()));
                            }}
                        >
                            {t}
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
                    <P
                        z="1.4rem"
                        css="padding: 3px 10px; border-radius: 5px; background-color: #187bd7; margin-right: 5px; @media(min-width: 768px){margin-right: 10px;}"
                    >
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
                        <Div
                            css={`
                                position: absolute;
                                right: 10px;
                                top: 30px;
                                border-radius: 50%;
                                padding: 8px;
                                background-color: #292929;
                                box-shadow: 0 0 1px white;
                                cursor: var(--pointer);
                            `}
                            onClick={() => {
                                const occurrences = (hashTag.match(/#/g) || []).length;
                                if (
                                    hashTag.length > 1 &&
                                    occurrences === 1 &&
                                    !hashTags.some((ts) => ts.toLowerCase() === hashTag.toLowerCase())
                                ) {
                                    if (!hashTags.includes(hashTag)) {
                                        setHashTags([...hashTags, hashTag]);
                                    }
                                }
                                setHashTag('');
                            }}
                        >
                            <Div
                                width="0.5px"
                                css="position: inherit; right: 15px; top: -34px; background-color: #727272; height: 33px;"
                            ></Div>
                            <PlusI />
                        </Div>
                        <Div css="margin-top: 5px; position: relative">
                            <Input
                                width="75%"
                                padding="6px 40px 6px 10px"
                                margin="auto"
                                placeholder="Search # tag or add"
                                border="1px solid rgb(47 47 47)"
                                color="white"
                                value={hashTag}
                                onChange={(e) => setHashTag(e.target.value)}
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
                                        e.preventDefault();
                                        const occurrences = (hashTag.match(/#/g) || []).length;
                                        if (
                                            hashTag.length > 1 &&
                                            occurrences === 1 &&
                                            !hashTags.some((ts) => ts.toLowerCase() === hashTag.toLowerCase())
                                        ) {
                                            if (!hashTags.includes(hashTag)) {
                                                setHashTags([...hashTags, hashTag]);
                                            }
                                        }
                                        setHashTag('');
                                    }
                                }}
                            />
                            <DivPos size="20px" right="50px" top="4px">
                                <SearchI />
                            </DivPos>
                        </Div>
                        <Div width="100%" wrap="wrap" css="padding: 10px; margin-top: 15px;">
                            {['#hello', '#world', '#nana', '#football', '#fiction', '#love', '#goodlife'].map((t) => (
                                <P
                                    z="1.4rem"
                                    key={t}
                                    css={`
                                        height: fit-content;
                                        padding: 4px 6px;
                                        border-radius: 5px;
                                        background-color: #3d3e3fb8;
                                        margin-right: 3px;
                                        cursor: var(--pointer);
                                        margin-bottom: 5px;
                                        ${hashTags.some((ts) => ts.toLowerCase() === t.toLowerCase())
                                            ? 'background-color: #1f4749;'
                                            : ''}
                                    `}
                                    onClick={() => {
                                        if (!hashTags.some((ts) => ts.toLowerCase() === t.toLowerCase())) {
                                            setHashTags([...hashTags, t]);
                                        } else {
                                            setHashTags((pre) =>
                                                pre.filter((ts) => ts.toLowerCase() !== t.toLowerCase()),
                                            );
                                        }
                                    }}
                                >
                                    {t}
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
