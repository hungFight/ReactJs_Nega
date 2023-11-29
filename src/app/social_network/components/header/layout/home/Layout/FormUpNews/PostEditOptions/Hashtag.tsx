import React from 'react';
import { CloseI, HashI, SearchI, TagPostI } from '~/assets/Icons/Icons';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, H3, Input, P } from '~/reUsingComponents/styleComponents/styleDefault';

const Hashtag = () => {
    return (
        <Div
            css={`
                position: fixed;
                width: 330px;
                height: 660px;
                background-color: #84848475;
                z-index: 9999;
                top: 50%;
                translate: -50% -50%;
                left: 50%;
                right: 50%;
                align-items: center;
            `}
        >
            <Div
                width="100%"
                display="block"
                css={`
                    height: 80%;
                    position: relative;
                    color: white;
                    background-color: #0e0e0e;
                `}
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
                    <DivPos size="20px" top="3px" left="10px">
                        <CloseI />
                    </DivPos>
                </H3>
                <Div
                    width="94%"
                    wrap="wrap"
                    css={`
                        max-height: 300px;
                        background-color: #28282870;
                        margin-top: 10px;
                        border: 1px solid #3f3f3f;
                        margin: auto;
                        margin-top: 10px;
                        border-radius: 10px;
                        padding: 5px;
                    `}
                >
                    {['#hello', '#world', '#nana', '#football', '#fiction', '#love', '#goodlife'].map((t) => (
                        <P
                            z="1.3rem"
                            key={t}
                            css={`
                                height: fit-content;
                                padding: 2px 6px;
                                border-radius: 5px;
                                background-color: #3d3e3fb8;
                                margin-right: 3px;
                                margin-bottom: 5px;
                            `}
                        >
                            {t}
                        </P>
                    ))}
                </Div>
                <Div width="100%" css="justify-content: end; padding-right: 3px;">
                    <P z="1.3rem" css="padding: 3px 7px; border-radius: 5px;">
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
                    <Div css="margin-top: 5px; position: relative">
                        <Input
                            width="75%"
                            padding="6px 40px 6px 10px"
                            margin="auto"
                            placeholder="Search tag"
                            border="1px solid rgb(47 47 47)"
                            color="white"
                        />
                        <DivPos size="20px" right="50px" top="4px">
                            <SearchI />
                        </DivPos>
                    </Div>
                    <Div width="100%" wrap="wrap" css="padding: 5px; margin-top: 15px;">
                        {['#hello', '#world', '#nana', '#football', '#fiction', '#love', '#goodlife'].map((t) => (
                            <P
                                z="1.3rem"
                                key={t}
                                css={`
                                    height: fit-content;
                                    padding: 2px 6px;
                                    border-radius: 5px;
                                    background-color: #3d3e3fb8;
                                    margin-right: 3px;
                                    margin-bottom: 5px;
                                `}
                            >
                                {t}
                            </P>
                        ))}
                    </Div>
                </Div>
            </Div>
        </Div>
    );
};

export default Hashtag;
