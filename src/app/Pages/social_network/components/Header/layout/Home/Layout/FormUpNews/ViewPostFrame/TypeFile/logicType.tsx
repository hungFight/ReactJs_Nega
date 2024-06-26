import { useState } from 'react';
import { ScreenI, TitleI, UndoI } from '~/assets/Icons/Icons';
import { DivFlexPosition } from '~/reUsingComponents/styleComponents/styleComponents';

const LogicType = (step: number, setStep: React.Dispatch<React.SetStateAction<number>>, colorText: string) => {
    const [moreFile, setMoreFile] = useState<number>(6);
    const [update, setUpdate] = useState<number>(-1);
    const [cc, setCC] = useState<number | null>(null);
    const [showTitle, setShowTitle] = useState<boolean>(false);
    const [showComment, setShowComment] = useState<number[]>([]);
    const handleStep = (e: any, index: number) => {
        setCC(index);
        if (step === 0) {
            setStep(3);
        } else if (step === 1) {
            setStep(2);
        } else if (step === 2 && e.target.getAttribute('class').includes('aaa')) {
            setStep(1);
        }
    };

    const ToolDefault = (st: number) => {
        if (st === 0)
            return (
                <DivFlexPosition
                    size="20px"
                    top="-25px"
                    right="11.5px"
                    color={colorText}
                    onClick={() => {
                        setStep(0);
                        setShowTitle(false);
                        setCC(null);
                    }}
                    css={`
                        border-radius: 50%;
                        ${step > 0
                            ? `${
                                  step > 1 ? 'background-color: #a1a1a18a;' : 'background-color: #0304048a;'
                              };position: fixed; top: 8px; right: 11.5px; color: #e2d2d2; font-size: 22px; z-index: 999; width: 35px; height: 35px;  transition: all 0.5s linear; `
                            : ''}
                    `}
                >
                    <ScreenI />
                </DivFlexPosition>
            );

        if (st === 2)
            return (
                <DivFlexPosition
                    size="20px"
                    top="50px"
                    right="11.5px"
                    onClick={() => {
                        setCC(null);
                        setStep(1);
                    }}
                    css="position: fixed;  color: #e2d2d2; font-size: 22px; z-index: 888; width: 35px; height: 35px; background-color: #a1a1a18a; transition: all 0.5s linear; "
                >
                    <UndoI />
                </DivFlexPosition>
            );
        if (st === 1)
            return (
                <DivFlexPosition
                    size="20px"
                    top="50px"
                    right="11.5px"
                    onClick={() => setShowTitle(!showTitle)}
                    css="position: fixed;  color: #e2d2d2; font-size: 22px; z-index: 888; width: 35px; height: 35px; background-color: #0304048a; transition: all 0.5s linear; "
                >
                    <TitleI />
                </DivFlexPosition>
            );
    };

    return {
        moreFile,
        cc,
        handleStep,
        setMoreFile,
        ToolDefault,
        showTitle,
        update,
        setUpdate,
        showComment,
        setShowComment,
    };
};
export default LogicType;
