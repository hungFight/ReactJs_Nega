import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTrueErrorServer } from '~/redux/hideShow';
import CommonUtils from './CommonUtils';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';

const handleFileUpload = async (
    file: FileList,
    quantity: number,
    imageSize: number,
    videoTime: number,
    dispatch: Dispatch<AnyAction>,
) => {
    const getFilesToPre: { file: string; type: string }[] = [];
    const upLoad: { file: Blob; type: string }[] = [];
    if (file && file.length < quantity) {
        for (let i = 0; i < file.length; i++) {
            if (
                file[i].type.includes('video/mp4') ||
                file[i].type.includes('video/mov') ||
                file[i].type.includes('video/x-matroska')
            ) {
                const url = URL.createObjectURL(file[i]);
                const vid = document.createElement('video');
                // create url to use as the src of the video
                vid.src = url;
                // wait for duration to change from NaN to the actual duration
                // eslint-disable-next-line no-loop-func
                vid.ondurationchange = function () {
                    console.log(vid.duration);

                    if (vid.duration <= videoTime) {
                        upLoad.push({ file: file[i], type: 'video' });
                        getFilesToPre.push({ file: URL.createObjectURL(file[i]), type: 'video' });
                    } else {
                        dispatch(setTrueErrorServer('Our length of the video must be less than 16 seconds!'));
                    }
                };
            } else if (
                file[i].type.includes('image/jpg') ||
                file[i].type.includes('image/jpeg') ||
                file[i].type.includes('image/png')
            ) {
                try {
                    if (Number((file[i].size / 1024 / 1024).toFixed(1)) <= imageSize) {
                        upLoad.push({ file: file[i], type: 'image' });
                        getFilesToPre.push({ file: URL.createObjectURL(file[i]), type: 'image' });
                    } else {
                        const compressedFile: any = await CommonUtils.compress(file[i]);
                        const sizeImage = Number((compressedFile.size / 1024 / 1024).toFixed(1));
                        if (sizeImage <= imageSize) {
                            upLoad.push({ file: file[i], type: 'image' });
                            getFilesToPre.push({ file: URL.createObjectURL(file[i]), type: 'image' });
                        } else {
                            dispatch(setTrueErrorServer(`${sizeImage}MB big than our limit is 8MB`));
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                dispatch(setTrueErrorServer('This format is not support!'));
            }
            // console.log(newDa, 'newDa');
        }
    } else {
        dispatch(setTrueErrorServer(`You can only select ${10} file at most!`));
    }
    return {
        getFilesToPre,
        upLoad,
    };
};

export default handleFileUpload;
