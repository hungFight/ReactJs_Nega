import { ReactNode, SetStateAction, useEffect, useState } from 'react';

import authAPI from '~/restAPI/authAPI/authAPI';

import { DivLoading, Htitle } from '~/reUsingComponents/styleComponents/styleComponents';
import { EmailI, LoadingI, PhoneI, SendOPTI } from '~/assets/Icons/Icons';
import { DivExpireTime, DivOtp, DivReSend, DivSendMail, DivVerifymail, Form } from './styleVerify';
import { Pcontent, SpanIconPhoneMail } from '../Register/styleRegister';
import { Button, Input } from '~/reUsingComponents/styleComponents/styleDefault';
import { useDispatch, useSelector } from 'react-redux';
import { PropsBgRD } from '~/redux/background';
interface PropsVerify {
    setEnable: React.Dispatch<SetStateAction<boolean>>;
    setAccount: React.Dispatch<React.SetStateAction<string | number>>;
    Next: ReactNode;
    setAcc: React.Dispatch<React.SetStateAction<number>>;
    whatKind: 'register' | 'changePassword';
}
const Verify: React.FC<PropsVerify> = ({ setAcc, setEnable, setAccount, Next, whatKind }) => {
    const dispatch = useDispatch();
    const { colorText, colorBg } = useSelector((state: PropsBgRD) => state.persistedReducer.background);
    const [loading, setLoading] = useState<boolean>(false);
    const [otpStatus, setOtpStatus] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>('');
    const [error, setError] = useState<{ mail: string; otp: string }>({ mail: '', otp: '' });
    const [valuePhoneNumberEmail, setPhoneNumberEmail] = useState<{
        value: string;
        icon?: string | React.ReactElement;
    }>({ value: '', icon: '' });

    const [checkPhoneNumberEmail, setCheckPhoneNumberEmail] = useState<{
        check: boolean;
        title: string;
    }>({ check: false, title: '' });

    const handlePhoneNumberEmail = (e: { target: any }) => {
        if (isNaN(e.target.value)) {
            // mail
            const validateEmail = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,5})+$/;
            setPhoneNumberEmail({ value: e.target.value, icon: <EmailI /> });

            if (validateEmail.test(e.target.value) === true) {
                setCheckPhoneNumberEmail({ title: '', check: false });
            } else {
                setCheckPhoneNumberEmail({
                    check: false,
                    title: 'Email Invalid',
                });
            }
        } else if (e.target.value === '') {
            setPhoneNumberEmail({ value: '', icon: '' });
            setCheckPhoneNumberEmail({ check: false, title: '' });
        } else {
            // phone
            if (e.target.value.length <= 11 && e.target.value.length >= 9) {
                setCheckPhoneNumberEmail({ check: false, title: '' });
            } else {
                setCheckPhoneNumberEmail({ check: false, title: 'Phone Number must 9 - 11 characters. ' });
            }
            setPhoneNumberEmail({ value: e.target.value, icon: <PhoneI /> });
        }
    };

    const handleInputOtp = (e: { target: { value: string } }) => {
        if (!isNaN(Number(e.target.value))) {
            if (e.target.value.length >= 0 && e.target.value.length < 7) {
                setOtp(e.target.value);
            }
        }
    };
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setError({ otp: '', mail: '' });

        if (!otpStatus) {
            if (!checkPhoneNumberEmail.check && valuePhoneNumberEmail.value) {
                const params = {
                    whatKind,
                    phoneMail: valuePhoneNumberEmail.value,
                };
                setLoading(true);
                const res = await authAPI.postSendOTP(params);
                console.log('prohibit', res);

                setLoading(false);
                if (res && res.status === 1) {
                    setError({ otp: '', mail: '' });
                    setAccount(valuePhoneNumberEmail.value);
                    setOtpStatus(true);
                } else {
                    setError({ ...error, mail: res?.message });
                }
            }
            if (!valuePhoneNumberEmail.value) setCheckPhoneNumberEmail({ check: true, title: 'Please Enter Your Data!' });
        } else {
            if (otp) {
                if (otp.length === 6) {
                    const params = {
                        phoneMail: valuePhoneNumberEmail.value,
                        whatKind,
                        otp: otp,
                    };
                    const res = await authAPI.postVerifyOTP(dispatch, params);
                    if (res?.status === 1) {
                        setError({ otp: '', mail: '' });
                        setEnable(true);
                        setOtpStatus(false);
                    } else setError({ ...error, otp: 'Account was wrong or not signed up' });
                } else {
                    setError({ ...error, otp: 'Please otp code must be 6 characters!' });
                }
            } else {
                setError({ ...error, otp: 'Please Enter Your code!' });
            }
        }
    };
    // async check the email
    const insertOTP = () => {
        if (otpStatus) {
            return (
                <DivOtp>
                    <DivExpireTime>This code will be existed in 1 minute.</DivExpireTime>
                    <Input placeholder="Enter your OTP." color={colorText} onChange={handleInputOtp} value={otp} />
                    <Pcontent>{error.otp}</Pcontent>
                    {otpStatus && btnSubmit().Div2()}
                    {btnSubmit().Div1()}
                </DivOtp>
            );
        }
    };
    const handleReSend = () => {
        setOtpStatus(false);
    };
    const btnSubmit = () => {
        const css1 = `
                padding: 0 15px;
                margin: 25px auto 0;
           `;
        const btn: any = {
            Div1: () => {
                if (otpStatus) {
                    return <DivReSend onClick={handleReSend}>Resend</DivReSend>;
                } else if (!loading) {
                    return btn.Div2();
                }
            },
            Div2: () => (
                <Button size="2.2rem" css={css1} color="var(--color-light)">
                    <SendOPTI />
                </Button>
            ),
        };
        return btn;
    };
    console.log(error);

    return (
        <Form action="" onSubmit={handleSubmit}>
            <DivVerifymail>
                <Htitle>
                    Verify Email or Phone Number
                    {Next}
                </Htitle>
                <DivSendMail>
                    <Input placeholder="Your Email" onChange={handlePhoneNumberEmail} color={checkPhoneNumberEmail.check ? 'rgb(255 97 97 / 83%)' : colorText} />

                    <Pcontent>{error.mail}</Pcontent>
                    <SpanIconPhoneMail top="25px">{valuePhoneNumberEmail.icon}</SpanIconPhoneMail>
                    <Pcontent>{checkPhoneNumberEmail.title}</Pcontent>
                </DivSendMail>
                {!otpStatus && btnSubmit().Div1()}
            </DivVerifymail>

            {loading && (
                <DivLoading>
                    <LoadingI />
                </DivLoading>
            )}
            {insertOTP()}
        </Form>
    );
};
export default Verify;
