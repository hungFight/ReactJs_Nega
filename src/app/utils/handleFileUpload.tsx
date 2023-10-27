import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTrueErrorServer } from '~/redux/hideShow';
import CommonUtils from './CommonUtils';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const handleFileUpload = (
    file: FileList,
    quantity: number,
    imageSize: number,
    videoTime: number,
    dispatch: Dispatch<AnyAction>,
    type: string,
) => {
    const getFilesToPre: { link: string; type: string; _id: string }[] = [];
    const upLoad: any = [];
    const getFilesToPrePer: { file: string; type: string }[] = [];
    const upLoadPer: { file: Blob; type: string }[] = [];
    if (file && file.length < quantity) {
        for (let i = 0; i < file.length; i++) {
            const _id = uuidv4();
            const fil: any = file[i];
            if (fil.type === 'video/mp4' || fil.type === 'video/mov' || fil.type === 'video/x-matroska') {
                if (type === 'chat') {
                    const url = URL.createObjectURL(file[i]);
                    const vid = document.createElement('video');
                    // create url to use as the src of the video
                    vid.src = url;
                    // wait for duration to change from NaN to the actual duration
                    // eslint-disable-next-line no-loop-func
                    vid.ondurationchange = function () {
                        console.log(vid.duration);
                        if (vid.duration <= videoTime) {
                            upLoad.push(fil);
                            getFilesToPre.push({ _id, link: url, type: fil.type });
                        } else {
                            dispatch(setTrueErrorServer('Our length of the video must be less than 16 seconds!'));
                        }
                    };
                }
            } else if (
                file[i].type.includes('image/jpg') ||
                file[i].type.includes('image/jpeg') ||
                file[i].type.includes('image/png')
            ) {
                try {
                    if (Number((file[i].size / 1024 / 1024).toFixed(1)) <= imageSize) {
                        if (type === 'per') {
                            upLoadPer.push({ file: file[i], type: 'image' });
                            getFilesToPrePer.push({ file: URL.createObjectURL(file[i]), type: 'image' });
                        } else {
                            fil._id = _id; // _id flow setupload's _id
                            upLoad.push(fil);
                            getFilesToPre.push({ _id, link: URL.createObjectURL(fil), type: fil.type });
                        }
                    } else {
                        const compressedFile: any = CommonUtils.compress(file[i]);
                        const sizeImage = Number((compressedFile.size / 1024 / 1024).toFixed(1));
                        if (sizeImage <= imageSize) {
                            if (type === 'per') {
                                upLoadPer.push({ file: file[i], type: 'image' });
                                getFilesToPrePer.push({ file: URL.createObjectURL(compressedFile), type: 'image' });
                            } else {
                                fil._id = _id; // _id flow setupload's _id
                                upLoad.push(compressedFile);
                                getFilesToPre.push({
                                    _id,
                                    link: URL.createObjectURL(compressedFile),
                                    type: fil.type,
                                });
                            }
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
        upLoadPer,
        getFilesToPrePer,
    };
};

export default handleFileUpload;
