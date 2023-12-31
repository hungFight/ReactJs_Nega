import moment from 'moment';
import { PropsChat, PropsItemRoom, PropsPinC } from './LogicConver';
import { Div, DivFlex, P } from '~/reUsingComponents/styleComponents/styleDefault';
import FileConversation from '../File';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { memo, useEffect, useRef, useState } from 'react';
import { DotI, GarbageI, LoadingI, ReplyI } from '~/assets/Icons/Icons';
import CryptoJS from 'crypto-js';
import { PropsUser } from 'src/App';
import { PropsPhraseText } from 'src/dataText/DataMessenger';
import { DivLoading, DivPos, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import Conversation from './Conversation';
type PropsRc = PropsItemRoom;
const ItemsRoom: React.FC<{
    setChoicePin: React.Dispatch<React.SetStateAction<string>>;
    pins: PropsPinC[];
    del: React.MutableRefObject<HTMLDivElement | null>;
    rc: PropsRc;
    index: number;
    targetChild: React.MutableRefObject<HTMLDivElement | null>;
    archetype: PropsRc[];
    handleWatchMore: (e: any) => void;
    ERef: React.MutableRefObject<any>;
    handleTime: (dateTime: string, type: string) => string;
    user: {
        id: string;
        avatar: any;
        fullName: string;
        gender: number;
    };
    timeS: string;
    setOptions: React.Dispatch<
        React.SetStateAction<
            | {
                  _id: string;
                  id: string;
                  text: string;
                  secondary?: string | undefined;
                  who: string;
                  byWhoCreatedAt: string;
                  imageOrVideos: {
                      v: string;
                      type?: string | undefined;
                      icon: string;
                      _id: string;
                  }[];
              }
            | undefined
        >
    >;
    options:
        | {
              _id: string;
              id: string;
              text: string;
              secondary?: string | undefined;
              who: string;
              byWhoCreatedAt: string;
              imageOrVideos: {
                  v: string;
                  type?: string | undefined;
                  icon: string;
                  _id: string;
              }[];
          }
        | undefined;
    dataFirst: PropsUser;
    wch: string | undefined;
    setWch: React.Dispatch<React.SetStateAction<string | undefined>>;
    rr: React.MutableRefObject<string>;
    roomId: string;
    phraseText: PropsPhraseText;
    choicePin: string;
    background?: {
        v: string;
        type: string;
        id: string;
        userId: string;
        latestChatId: string;
    };
    setRoomImage: React.Dispatch<
        React.SetStateAction<
            | {
                  id_room: string;
                  id_file: string;
              }
            | undefined
        >
    >;
    roomImage:
        | {
              id_room: string;
              id_file: string;
          }
        | undefined;
    scrollCheck: React.MutableRefObject<boolean>;
}> = ({
    rc,
    index,
    archetype,
    handleWatchMore,
    ERef,
    handleTime,
    user,
    del,
    timeS,
    setOptions,
    options,
    dataFirst,
    wch,
    setWch,
    rr,
    roomId,
    phraseText,
    targetChild,
    choicePin,
    pins,
    setChoicePin,
    background,
    roomImage,
    setRoomImage,
    scrollCheck,
}) => {
    const elWatChTime = useRef<HTMLDivElement | null>(null);
    const width = useRef<HTMLDivElement | null>(null);

    if (rc.id === dataFirst.id && !wch) {
        if (rc.seenBy.includes(user.id) && !rr.current) {
            rr.current = rc._id;
        } else {
            if (archetype[index + 1]?.seenBy.includes(user.id) && !rc?.seenBy.includes(user.id)) {
                rr.current = archetype[index + 1]?._id;
            }
        }
    }
    if (wch) rr.current = '';
    useEffect(() => {
        if (width.current) {
            if (width.current.clientWidth >= 150) {
                console.log(width.current.clientWidth, 'clientWidth', width.current);
                width.current.classList.add('adjustDate');
            }
        }
        if (elWatChTime.current) {
            if (elWatChTime.current.clientWidth >= 150) {
                console.log(elWatChTime.current.clientWidth, 'clientWidth', elWatChTime.current);
                elWatChTime.current.classList.add('adjustDate');
            }
        }
    }, [width, elWatChTime]);
    const chatId = pins.some((p) => p.chatId === rc._id);
    const changedBG = background?.latestChatId === rc._id;
    const whoChangedBG =
        background?.userId === dataFirst.id ? 'You have' : background?.userId === user.id ? user.fullName + ' has' : '';

    const selfChatID = pins.filter((p) => p.chatId === rc._id)[0]?.userId === dataFirst.id;
    const otherChatId = pins.filter((p) => p.chatId === rc._id)[0]?.userId === user.id;
    const fullNameChatId = selfChatID ? 'You have pined' : otherChatId ? user.fullName + ' has pined' : '';
    const self = pins.filter((p) => p.latestChatId === rc._id)[0]?.userId === dataFirst.id; // filter by latest chatId(room._id) to display who has pined
    const others = pins.filter((p) => p.latestChatId === rc._id)[0]?.userId === user.id;
    const avatarPin = self ? dataFirst.avatar : others ? user.avatar : '';
    const fullName = self ? 'You have pined' : others ? user.fullName + ' has pined' : '';
    const gender = self ? dataFirst.gender : others ? user.gender : 0;
    const displayById = pins.filter((p) => p.latestChatId === rc._id);
    const marginTop = moment(archetype[index + 1]?.createdAt ? archetype[index + 1].createdAt : new Date()).diff(
        rc?.createdAt,
        'minutes',
    );
    // reply
    const selfReply = rc?.reply?.id_replied === dataFirst.id;
    const avatarReply = selfReply ? dataFirst.avatar : rc?.reply?.id_replied === user.id ? user.avatar : '';
    const nameReply = selfReply ? dataFirst.fullName : rc?.reply?.id_replied === user.id ? user.fullName : '';
    const genderReply = selfReply ? dataFirst.gender : rc?.reply?.id_replied === user.id ? user.gender : 0;
    let alarm = useRef<NodeJS.Timeout | null>(null);
    const handleTouchStart = (data: any) => {
        if (!(rc?.delete === 'all')) {
            alarm.current = setTimeout(() => {
                if (scrollCheck.current) {
                    setOptions(data);
                    scrollCheck.current = false;
                }
            }, 500);
        }
    };
    const handleTouchEnd = (e: any) => {
        console.log('end');
        if (alarm.current) clearTimeout(alarm.current);
    };
    console.log(alarm.current, 'marginTop');

    return (
        <>
            {changedBG && (
                <Div width="100%" css="justify-content: center;">
                    <P z="1rem">{whoChangedBG} changed background</P>
                </Div>
            )}
            {displayById.map((dis) => (
                <DivFlex key={dis.chatId} css="margin: 5px 0 15px 0;">
                    <Div
                        css="padding: 0px 7px;border-radius: 5px; cursor: var(--pointer);  border: 1px solid #5f5f5f; &:hover{background-color: #3f3f3f;} align-items: center;"
                        onClick={() => {
                            setChoicePin(dis.chatId);
                        }}
                    >
                        <Avatar
                            src={avatarPin}
                            alt={fullName}
                            gender={gender}
                            radius="50%"
                            css={`
                                width: 15px;
                                height: 15px;
                                margin: 0 5px 5px 0;
                            `}
                        />
                        <P z="1rem">{fullName}</P>
                        {choicePin === dis.chatId && (
                            <DivLoading css="margin: 0 5px; width: auto; font-size: 13px;">
                                <LoadingI />
                            </DivLoading>
                        )}
                    </Div>
                </DivFlex>
            ))}
            {rc?.delete !== dataFirst.id && timeS && index !== 0 && (
                <P css="font-size: 1rem; text-align: center;padding: 2px 0;  margin: 10px 0;">{timeS}</P>
            )}
            {rc.id === dataFirst.id
                ? rc?.delete !== dataFirst.id && (
                      <>
                          <Div
                              id={`chat_to_scroll_${rc._id}`}
                              width="100%"
                              css={`
                                  padding-left: ${rc.imageOrVideos.length <= 1 ? '35%' : '20%'};
                                  margin-bottom: ${rc.imageOrVideos.length ? '19px' : '8px'};
                                  justify-content: right;
                                  position: relative;
                                  z-index: ${roomImage?.id_room === rc._id ? 2 : 6};
                                  ${marginTop <= -5 ? 'margin-top: 10px;' : ''}
                                  margin-top: ${rc?.reply?.imageOrVideos.length
                                      ? rc?.reply?.imageOrVideos.length <= 3
                                          ? rc?.reply?.imageOrVideos.length * 45
                                          : 150
                                      : rc?.reply?.text
                                      ? rc?.reply?.text.length <= 38
                                          ? 24
                                          : 50
                                      : ''}px;
                                  .chatTime {
                                      &:hover {
                                          #showDotAtRoomChat {
                                              display: none;
                                          }
                                      }
                                      .dateTime {
                                          display: block;
                                      }
                                  }
                                  p {
                                      z-index: 1;
                                  }
                                  .adjustDate {
                                      .dateTime {
                                          top: unset;
                                          bottom: 1px;
                                          left: -31px;
                                      }
                                      .dateTimeN {
                                          bottom: -10px;
                                      }
                                  }
                                  &:hover {
                                      z-index: 5;
                                  }
                              `}
                          >
                              {rc?.reply && (rc?.reply?.imageOrVideos.length || rc.reply.text) && (
                                  <Div
                                      css={`
                                          position: absolute;
                                          right: 0;
                                          max-width: 65%;
                                          background-color: #363636;
                                          width: fit-content;
                                          border-radius: 5px;
                                          padding: 5px;
                                          bottom: 100%;

                                          cursor: var(--pointer);
                                          user-select: none;
                                      `}
                                      onClick={() => {
                                          if (rc.reply.id_room) setChoicePin(rc.reply.id_room);
                                      }}
                                  >
                                      <Div width="inherit" css="position: relative;">
                                          {rc?.reply?.imageOrVideos.length > 3 && (
                                              <DivPos size="1.2rem" bottom="3px" right="10px" index={1}>
                                                  + {rc.reply.imageOrVideos.length - 3}
                                              </DivPos>
                                          )}
                                          <Div
                                              css="position: absolute; top: 0px; left: -25px; z-index: 1"
                                              onClick={(e) => e.stopPropagation()}
                                          >
                                              <Div
                                                  wrap="wrap"
                                                  css="position: relative;  &:hover{.moreReplyInfo {display: flex;}}"
                                              >
                                                  <ReplyI />
                                                  <DivPos
                                                      className="moreReplyInfo"
                                                      top="-90px"
                                                      width="190px"
                                                      left="-82px"
                                                      css="display: none; height: auto; user-select: none; background-color: #1b5c5ffc; padding: 5px; border-radius: 5px;"
                                                  >
                                                      <Div wrap="wrap" width="100%">
                                                          <DivFlex css="flex-wrap: wrap;">
                                                              <Avatar
                                                                  src={avatarReply}
                                                                  alt={nameReply}
                                                                  gender={genderReply}
                                                                  radius="50%"
                                                                  css="min-width: 25px; min-height: 25px; width: 25px; height: 25px;"
                                                              />
                                                              <Hname css="width: 100%; font-size: 1.2rem; text-align: center">
                                                                  {nameReply}
                                                              </Hname>
                                                          </DivFlex>
                                                          <Div
                                                              wrap="wrap"
                                                              width="100%"
                                                              css="padding: 3px; background-color: #262728; margin-top: 3px"
                                                          >
                                                              <P z="1rem" css="width:100%;">
                                                                  sent on thứ hai, 20 tháng 11 năm 2023
                                                              </P>
                                                          </Div>
                                                      </Div>
                                                  </DivPos>
                                              </Div>
                                          </Div>
                                          <Div wrap="wrap" width="inherit" css="opacity: 0.5;">
                                              {rc.reply.text && (
                                                  <P
                                                      z="1.2rem"
                                                      css={`
                                                          padding: 2px;
                                                          display: -webkit-box;
                                                          -webkit-line-clamp: 2;
                                                          -webkit-box-orient: vertical;
                                                          overflow: hidden;
                                                          width: fit-content;
                                                          white-space: pre;
                                                          text-wrap: wrap;
                                                          word-wrap: break-word;
                                                          max-width: 212px;
                                                      `}
                                                  >
                                                      {rc.reply.text}
                                                  </P>
                                              )}
                                              {rc?.reply?.imageOrVideos.length > 0 && (
                                                  <Div
                                                      css={`
                                                          align-items: end;
                                                          flex-grow: 1;
                                                      `}
                                                  >
                                                      <Div
                                                          width="100%"
                                                          wrap="wrap"
                                                          css={`
                                                              .roomIf {
                                                                  height: 50px;
                                                                  width: auto;
                                                              }
                                                          `}
                                                      >
                                                          {rc?.reply?.imageOrVideos.map((fl, index) => {
                                                              if (index <= 2) {
                                                                  return (
                                                                      <FileConversation
                                                                          id_room={rc._id}
                                                                          key={fl._id + '103' + index}
                                                                          type={fl?.type}
                                                                          id_file={fl._id}
                                                                          v={fl.v}
                                                                          icon={fl.icon}
                                                                          ERef={ERef}
                                                                          del={del}
                                                                          who="you"
                                                                      />
                                                                  );
                                                              }
                                                          })}
                                                      </Div>
                                                  </Div>
                                              )}
                                          </Div>
                                      </Div>
                                  </Div>
                              )}

                              {chatId && (
                                  <DivPos
                                      top="-13px"
                                      right="-11px"
                                      index={16}
                                      css={`
                                          /* transform: rotate(70deg); */
                                          &:hover {
                                              p {
                                                  display: block;
                                                  width: max-content;
                                                  padding: 2px 4px;
                                                  background-color: #4d31b4;
                                                  border-radius: 5px;
                                                  position: absolute;
                                                  right: 35px;
                                                  top: -8;
                                              }
                                          }
                                      `}
                                  >
                                      📌
                                      <P z="1rem" css="display: none">
                                          {fullNameChatId}
                                      </P>
                                  </DivPos>
                              )}
                              <Div
                                  ref={elWatChTime}
                                  display="block"
                                  className="noTouch"
                                  width="fit-content"
                                  css={`
                                      position: relative;
                                      max-width: 100%;
                                      justify-content: right;
                                      ${rc.imageOrVideos.length < 1 ? 'display: block;' : 'flex-grow: 1;'}
                                      ${rc.text.t &&
                                      `&::after {display: block; content: ''; width: 100%; height: ${
                                          rc.imageOrVideos.length > 0 ? '10%' : '100%'
                                      }; position: absolute; top: 0;left: 0;}`}
                                &:hover {
                                          #showDotAtRoomChat {
                                              display: flex;
                                          }
                                      }
                                  `}
                                  onTouchEnd={handleTouchEnd}
                                  onTouchStart={(e) => {
                                      handleTouchStart({
                                          _id: rc._id,
                                          id: rc.id,
                                          text: rc.text.t,
                                          secondary: rc?.secondary,
                                          imageOrVideos: rc.imageOrVideos,
                                          who: 'you',
                                          byWhoCreatedAt: rc.createdAt,
                                      });
                                  }}
                                  onTouchMove={(e) => {
                                      if (scrollCheck.current) scrollCheck.current = false;
                                  }}
                              >
                                  {!rc?.delete && (
                                      <Div
                                          display="none"
                                          id="showDotAtRoomChat"
                                          css={`
                                              position: absolute;
                                              width: 114%;
                                              left: -35px;
                                              height: 100%;
                                              top: 1px;
                                              padding-left: 4px;
                                              border-radius: 5px;
                                              font-size: 25px;
                                              z-index: 0;
                                              cursor: var(--pointer);
                                          `}
                                          onClick={(e) => {
                                              e.stopPropagation();
                                          }}
                                      >
                                          <Div
                                              onClick={() => {
                                                  setOptions({
                                                      _id: rc._id,
                                                      id: rc.id,
                                                      text: rc.text.t,
                                                      secondary: rc?.secondary,
                                                      imageOrVideos: rc.imageOrVideos,
                                                      who: 'you',
                                                      byWhoCreatedAt: rc.createdAt,
                                                  });
                                              }}
                                          >
                                              <DotI />
                                          </Div>
                                      </Div>
                                  )}

                                  {(rc.text.t || rc?.delete) && (
                                      <Div
                                          width="100%"
                                          css="justify-content: end; z-index: 11; position: relative;"
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              handleWatchMore(elWatChTime.current);
                                          }}
                                      >
                                          <P
                                              z={rc?.delete === 'all' ? '1.2rem' : '1.4rem'}
                                              css={`
                                                  margin: 0;
                                                  padding: 2px 12px 4px;
                                                  border-radius: 7px;
                                                  white-space: pre;
                                                  border-top-left-radius: 13px;
                                                  border-bottom-left-radius: 13px;
                                                  align-items: center;
                                                  text-wrap: wrap;
                                                  width: max-content;
                                                  word-wrap: break-word;
                                                  max-width: 100%;
                                                  background-color: ${rc?.delete === 'all'
                                                      ? '#1d1c1c; display: flex;'
                                                      : '#1a383b'};
                                                  border: 1px solid #4e4d4b;
                                                  svg {
                                                      margin-right: 3px;
                                                  }
                                                  ${rc.update && 'border: 1px solid #889a21c7;'}
                                              `}
                                          >
                                              {rc.text.t}
                                              {rc?.delete === 'all' && <GarbageI />}
                                              {rc?.delete === 'all' && "You've deleted"}
                                          </P>
                                      </Div>
                                  )}
                                  {rc.imageOrVideos.length > 0 && (
                                      <Div css=" align-items: end; flex-grow: 1;">
                                          <Div
                                              width="100%"
                                              wrap="wrap"
                                              css={`
                                                  position: relative;
                                                  justify-content: end;
                                                  .roomOfChat {
                                                      position: fixed;
                                                      width: 100%;
                                                      height: 100%;
                                                      top: 0;
                                                      left: 0;
                                                      background-color: #171718;
                                                      img {
                                                          object-fit: contain;
                                                      }
                                                      border-radius: 5px;
                                                      ${rc.update && 'border: 1px solid #889a21c7;'}
                                                  }
                                                  ${rc.imageOrVideos.length > 2 && 'background-color: #ca64b8;'}
                                              `}
                                              onClick={(e) => e.stopPropagation()}
                                          >
                                              {rc.imageOrVideos.map((fl, index) => {
                                                  if (roomImage?.id_file === fl._id) {
                                                      return (
                                                          <>
                                                              <FileConversation
                                                                  id_room={rc._id}
                                                                  key={fl._id + '11' + index}
                                                                  type={fl?.type}
                                                                  id_file={fl._id}
                                                                  v={fl.v}
                                                                  icon={fl.icon}
                                                                  ERef={ERef}
                                                                  del={del}
                                                                  who="you"
                                                                  roomImage={roomImage}
                                                                  setRoomImage={setRoomImage}
                                                                  fixed
                                                              />
                                                              <FileConversation
                                                                  id_room={rc._id}
                                                                  key={fl._id + '12' + index}
                                                                  type={fl?.type}
                                                                  id_file={fl._id}
                                                                  v={fl.v}
                                                                  icon={fl.icon}
                                                                  ERef={ERef}
                                                                  del={del}
                                                                  who="you"
                                                                  roomImage={roomImage}
                                                                  setRoomImage={setRoomImage}
                                                              />
                                                          </>
                                                      );
                                                  }
                                                  return (
                                                      <FileConversation
                                                          id_room={rc._id}
                                                          key={fl._id + '10' + index}
                                                          type={fl?.type}
                                                          id_file={fl._id}
                                                          v={fl.v}
                                                          icon={fl.icon}
                                                          ERef={ERef}
                                                          del={del}
                                                          who="you"
                                                          roomImage={roomImage}
                                                          setRoomImage={setRoomImage}
                                                      />
                                                  );
                                              })}
                                          </Div>
                                      </Div>
                                  )}

                                  {rc?.sending ? (
                                      <P z="1rem" css="text-align: end;">
                                          sending...
                                      </P>
                                  ) : (
                                      <>
                                          {rc.imageOrVideos.length > 0 ? (
                                              <P
                                                  css={`
                                                      display: ${!rc.text.t ? 'block' : 'none'};
                                                      width: 100%;
                                                      font-size: 1rem;
                                                      margin-right: 5px;
                                                      text-align: right;
                                                  `}
                                                  className="dateTime"
                                              >
                                                  {handleTime(rc.createdAt, 'hour')}, {handleTime(rc.createdAt, 'date')}
                                              </P>
                                          ) : (
                                              <>
                                                  <P
                                                      className="dateTime"
                                                      css="display: none; font-size: 1rem; margin-left: 5px; position: absolute; left: -179px; top: 5px;"
                                                  >
                                                      {handleTime(rc.createdAt, 'date')}
                                                  </P>
                                                  {rc?.updatedAt && (rc.delete || rc?.update) && (
                                                      <P
                                                          className="dateTime dateTimeN"
                                                          css="display: none; font-size: 1rem; margin-left: 5px; position: absolute; left: -203px; top: 18px;"
                                                      >
                                                          {rc?.update
                                                              ? phraseText.dateTime.replace
                                                              : phraseText.dateTime.remove}{' '}
                                                          {handleTime(rc?.updatedAt, 'date')}
                                                      </P>
                                                  )}
                                                  <P
                                                      className="dateTime"
                                                      css="display: none; width: 100%; font-size: 1rem; margin-right: 5px; text-align: right;"
                                                  >
                                                      {handleTime(rc.createdAt, 'hour')}
                                                  </P>
                                              </>
                                          )}
                                          {rc.seenBy.includes(user.id) && (
                                              <Avatar
                                                  className="dateTime"
                                                  src={user.avatar}
                                                  alt=""
                                                  gender={user.gender}
                                                  radius="50%"
                                                  css={`
                                                      display: none;
                                                      width: 15px;
                                                      height: 15px;
                                                      position: absolute;
                                                      bottom: 12px !important;
                                                      left: -5px !important;
                                                      z-index: 1;
                                                  `}
                                              />
                                          )}
                                      </>
                                  )}
                              </Div>
                              {(wch === rc._id || rr.current === rc._id) && (
                                  <Avatar
                                      src={user.avatar}
                                      alt={user.fullName}
                                      gender={user.gender}
                                      radius="50%"
                                      css={`
                                          min-width: 17px;
                                          width: 15px;
                                          height: 15px;
                                          margin-right: 4px;
                                          margin-top: 3px;
                                          position: absolute;
                                          right: -10px;
                                          z-index: 11;
                                          bottom: 0;
                                      `}
                                  />
                              )}
                          </Div>
                      </>
                  )
                : rc?.delete !== dataFirst.id && (
                      <Div
                          id={`chat_to_scroll_${rc._id}`}
                          key={rc.text.t + index}
                          wrap="wrap"
                          css={`
                              padding-right: ${rc.imageOrVideos.length <= 1 ? '35%' : '20%'};
                              justify-content: left;
                              align-items: center;
                              margin-bottom: ${rc.imageOrVideos.length ? '19px' : '8px'};
                              position: relative;
                              z-index: ${roomImage?.id_room === rc._id ? 2 : 6};
                              ${marginTop <= -5 ? 'margin-top: 10px;' : ''}
                              margin-top: ${rc?.reply?.imageOrVideos.length
                                  ? rc?.reply?.imageOrVideos.length <= 2
                                      ? rc?.reply?.imageOrVideos.length * 45
                                      : 150
                                  : rc?.reply?.text
                                  ? rc?.reply?.text.length <= 38
                                      ? 40
                                      : 90
                                  : ''}px;
                              .chatTime {
                                  .dateTime {
                                      display: block;
                                  }
                              }
                              &:hover {
                                  z-index: 5;
                              }
                          `}
                      >
                          {rc?.reply && (rc?.reply?.imageOrVideos.length || rc.reply.text) && (
                              <Div
                                  css={`
                                      position: absolute;
                                      left: 21px;
                                      max-width: 65%;
                                      background-color: #0a0a0ad4;
                                      width: fit-content;
                                      border-radius: 5px;
                                      padding: 5px;
                                      bottom: 100%;
                                      cursor: var(--pointer);
                                      user-select: none;
                                  `}
                                  onClick={() => {
                                      if (rc.reply.id_room) setChoicePin(rc.reply.id_room);
                                  }}
                              >
                                  <Div width="inherit" css="position: relative;">
                                      {rc?.reply?.imageOrVideos.length > 3 && (
                                          <DivPos size="1.2rem" bottom="3px" right="10px" index={1}>
                                              + {rc.reply.imageOrVideos.length - 3}
                                          </DivPos>
                                      )}
                                      <Div
                                          css="position: absolute; top: 0px; right: -25px; z-index: 1"
                                          onClick={(e) => e.stopPropagation()}
                                      >
                                          <Div
                                              wrap="wrap"
                                              css="position: relative;  &:hover{.moreReplyInfo {display: flex;}}"
                                          >
                                              <ReplyI />
                                              <DivPos
                                                  className="moreReplyInfo"
                                                  top="-90px"
                                                  width="190px"
                                                  right="-82px"
                                                  css="display: none; height: auto; user-select: none; background-color: #1b5c5ffc; padding: 5px; border-radius: 5px;"
                                              >
                                                  <Div wrap="wrap" width="100%">
                                                      <DivFlex css="flex-wrap: wrap;">
                                                          <Avatar
                                                              src={avatarReply}
                                                              alt={nameReply}
                                                              gender={genderReply}
                                                              radius="50%"
                                                              css="min-width: 25px; min-height: 25px; width: 25px; height: 25px;"
                                                          />
                                                          <Hname css="width: 100%; font-size: 1.2rem; text-align: center">
                                                              {nameReply}
                                                          </Hname>
                                                      </DivFlex>
                                                      <Div
                                                          wrap="wrap"
                                                          width="100%"
                                                          css="padding: 3px; background-color: #262728; margin-top: 3px"
                                                      >
                                                          <P z="1rem" css="width:100%;">
                                                              sent on thứ hai, 20 tháng 11 năm 2023
                                                          </P>
                                                      </Div>
                                                  </Div>
                                              </DivPos>
                                          </Div>
                                      </Div>
                                      <Div wrap="wrap" width="inherit" css="opacity: 0.5;">
                                          {rc.reply.text && (
                                              <P
                                                  z="1.2rem"
                                                  css={`
                                                      padding: 2px;
                                                      display: -webkit-box;
                                                      -webkit-line-clamp: 2;
                                                      -webkit-box-orient: vertical;
                                                      overflow: hidden;
                                                      width: fit-content;
                                                      white-space: pre;
                                                      text-wrap: wrap;
                                                      word-wrap: break-word;
                                                      max-width: 212px;
                                                  `}
                                              >
                                                  {rc.reply.text}
                                              </P>
                                          )}
                                          {rc?.reply?.imageOrVideos.length > 0 && (
                                              <Div
                                                  css={`
                                                      align-items: end;
                                                      flex-grow: 1;
                                                  `}
                                              >
                                                  <Div
                                                      width="100%"
                                                      wrap="wrap"
                                                      css={`
                                                          .roomIf {
                                                              height: 50px;
                                                              width: auto;
                                                          }
                                                      `}
                                                  >
                                                      {rc?.reply?.imageOrVideos.map((fl, index, arr) => {
                                                          if (index <= 2) {
                                                              return (
                                                                  <FileConversation
                                                                      id_room={rc._id}
                                                                      key={fl._id + '103' + index}
                                                                      type={fl?.type}
                                                                      id_file={fl._id}
                                                                      v={fl.v}
                                                                      icon={fl.icon}
                                                                      ERef={ERef}
                                                                      del={del}
                                                                      who="you"
                                                                  />
                                                              );
                                                          }
                                                      })}
                                                  </Div>
                                              </Div>
                                          )}
                                      </Div>
                                  </Div>
                              </Div>
                          )}
                          {chatId && (
                              <DivPos
                                  top="-13px"
                                  left="14px"
                                  index={16}
                                  css={`
                                      transform: rotate(275deg);
                                      &:hover {
                                          p {
                                              transform: rotate(85deg);
                                              display: block;
                                              width: max-content;
                                              padding: 2px 4px;
                                              background-color: #4d31b4;
                                              border-radius: 5px;
                                              position: absolute;
                                              left: -27px;
                                              top: 72px;
                                          }
                                      }
                                  `}
                              >
                                  📌
                                  <P z="1rem" css="display: none">
                                      {fullNameChatId}
                                  </P>
                              </DivPos>
                          )}
                          <Div
                              ref={elWatChTime}
                              css={`
                                  ${rc.imageOrVideos.length < 1 ? 'display: flex;' : ''}
                                  position: relative;
                                  max-width: 100%;
                                  justify-content: left;
                                  .adjustDate {
                                      .dateTime {
                                          right: -50px;
                                          top: unset;
                                          bottom: 1px;
                                      }
                                      .dateTimeN {
                                          bottom: -10px;
                                      }
                                  }
                                  ${rc.imageOrVideos.length > 0 ? 'flex-grow: 1;' : ''}
                              `}
                          >
                              <Avatar
                                  src={user.avatar}
                                  alt={user.fullName}
                                  gender={user.gender}
                                  radius="50%"
                                  css="min-width: 17px; width: 17px; height: 17px; margin-right: 4px; margin-top: 3px;"
                              />
                              <Div
                                  width="fit-content"
                                  ref={width}
                                  display="block"
                                  className="noTouch"
                                  css={`
                                      width: 100%;
                                      max-width: 100%;
                                      position: relative;
                                      justify-content: start;
                                      ${rc.text.t &&
                                      `&::after {display: block; content: ''; width: 100%; height: ${
                                          rc.imageOrVideos.length > 0 ? '10%' : '100%'
                                      }; position: absolute; top: 0;left: 0;}`}
                                      &:hover {
                                          #showDotAtRoomChat {
                                              display: flex;
                                          }
                                      }
                                  `}
                                  onClick={(e) => {
                                      console.log('hello');
                                      e.stopPropagation();
                                      handleWatchMore(elWatChTime.current);
                                  }}
                                  onTouchStart={(e) => {
                                      handleTouchStart({
                                          _id: rc._id,
                                          id: rc.id,
                                          text: rc.text.t,
                                          secondary: rc?.secondary,
                                          imageOrVideos: rc.imageOrVideos,
                                          who: 'others',
                                          byWhoCreatedAt: rc.createdAt,
                                      });
                                  }}
                                  onTouchEnd={handleTouchEnd}
                                  onTouchMove={(e) => {
                                      if (scrollCheck.current) scrollCheck.current = false;
                                  }}
                              >
                                  {!rc?.delete && (
                                      <Div
                                          display="none"
                                          id="showDotAtRoomChat"
                                          css={`
                                              position: absolute;
                                              width: 114%;
                                              height: 100%;
                                              right: -35px;
                                              top: 1px;
                                              padding-left: 4px;
                                              border-radius: 5px;
                                              font-size: 25px;
                                              z-index: 0;
                                              justify-content: right;
                                              cursor: var(--pointer);
                                          `}
                                          onClick={(e) => {
                                              e.stopPropagation();
                                          }}
                                      >
                                          <Div
                                              onClick={() => {
                                                  setOptions({
                                                      _id: rc._id,
                                                      id: rc.id,
                                                      text: rc.text.t,
                                                      secondary: rc?.secondary,
                                                      imageOrVideos: rc.imageOrVideos,
                                                      who: 'others',
                                                      byWhoCreatedAt: rc.createdAt,
                                                  });
                                              }}
                                          >
                                              <DotI />
                                          </Div>
                                      </Div>
                                  )}
                                  {(rc.text.t || rc?.delete === 'all') && (
                                      <Div width="100%" css="justify-content: start; z-index: 11; position: relative;">
                                          <P
                                              z={rc?.delete === 'all' ? '1.2rem' : '1.4rem'}
                                              css={`
                                                  width: fit-content;
                                                  padding: 2px 12px 4px;
                                                  border-radius: 7px;
                                                  border-top-right-radius: 13px;
                                                  align-items: center;
                                                  white-space: pre;
                                                  text-wrap: wrap;
                                                  word-wrap: break-word;
                                                  max-width: 100%;
                                                  border-bottom-right-radius: 13px;
                                                  background-color: ${rc?.delete === 'all'
                                                      ? '#1d1c1c; display: flex;'
                                                      : background
                                                      ? '#272727bd'
                                                      : '#393838bd'};
                                                  border: 1px solid #4e4d4b;
                                                  svg {
                                                      margin-right: 3px;
                                                  }
                                                  ${rc.update && 'border: 1px solid #889a21c7;'}
                                              `}
                                          >
                                              {rc.text.t}
                                              {rc?.delete === 'all' && <GarbageI />}
                                              {rc?.delete === 'all' && `${user.fullName} has deleted`}
                                          </P>
                                      </Div>
                                  )}
                                  {rc.imageOrVideos.length > 0 && (
                                      <Div css=" align-items: start;flex-grow: 1; ">
                                          <Div
                                              width="100%"
                                              wrap="wrap"
                                              css={`
                                                  justify-content: start;
                                                  .roomOfChat {
                                                      position: fixed;
                                                      width: 100%;
                                                      height: 100%;
                                                      top: 0;
                                                      left: 0;
                                                      background-color: #171718;
                                                      img {
                                                          object-fit: contain;
                                                      }
                                                  }
                                                  border-radius: 5px;
                                                  ${rc.update && 'border: 1px solid #889a21c7;'}
                                                  ${rc.imageOrVideos.length > 2 && 'background-color: #ca64b8;'}
                                              `}
                                          >
                                              {rc.imageOrVideos.map((fl, index) => {
                                                  if (roomImage?.id_file === fl._id) {
                                                      return (
                                                          <>
                                                              <FileConversation
                                                                  key={fl.v + index + '13' + index}
                                                                  id_room={rc._id}
                                                                  type={fl?.type}
                                                                  v={fl.v}
                                                                  id_file={fl._id}
                                                                  del={del}
                                                                  icon={fl.icon}
                                                                  ERef={ERef}
                                                                  who="other"
                                                                  roomImage={roomImage}
                                                                  setRoomImage={setRoomImage}
                                                                  fixed
                                                              />
                                                              <FileConversation
                                                                  key={fl.v + index + '14' + index}
                                                                  id_room={rc._id}
                                                                  type={fl?.type}
                                                                  v={fl.v}
                                                                  id_file={fl._id}
                                                                  del={del}
                                                                  icon={fl.icon}
                                                                  ERef={ERef}
                                                                  who="other"
                                                                  roomImage={roomImage}
                                                                  setRoomImage={setRoomImage}
                                                              />
                                                          </>
                                                      );
                                                  }
                                                  return (
                                                      <FileConversation
                                                          key={fl.v + index + '15' + index}
                                                          id_room={rc._id}
                                                          type={fl?.type}
                                                          v={fl.v}
                                                          id_file={fl._id}
                                                          del={del}
                                                          icon={fl.icon}
                                                          ERef={ERef}
                                                          who="other"
                                                          roomImage={roomImage}
                                                          setRoomImage={setRoomImage}
                                                      />
                                                  );
                                              })}
                                          </Div>
                                      </Div>
                                  )}
                                  {rc.imageOrVideos.length > 0 ? (
                                      <P
                                          className="dateTime"
                                          css={`
                                              display: ${!rc.text.t ? 'block' : 'none'};
                                              width: 100%;
                                              font-size: 1rem;
                                              margin-left: 5px;
                                              text-align: left;
                                          `}
                                      >
                                          {handleTime(rc.createdAt, 'hour')}, {handleTime(rc.createdAt, 'date')}
                                      </P>
                                  ) : (
                                      <>
                                          <P
                                              className="dateTime"
                                              css={`
                                                  display: none;
                                                  font-size: 1rem;
                                                  margin-left: 5px;
                                                  position: absolute;
                                                  right: -157px;
                                                  top: 5px;
                                                  ${rc?.delete && 'right: -55px; top: 31px;'}
                                              `}
                                          >
                                              {handleTime(rc.createdAt, 'date')}
                                          </P>
                                          {rc?.updatedAt && (rc?.update || rc?.delete) && (
                                              <P
                                                  className="dateTime dateTimeN"
                                                  css={`
                                                      display: none;
                                                      font-size: 1rem;
                                                      margin-left: 5px;
                                                      position: absolute;
                                                      right: -220px;
                                                      top: 21px;
                                                  `}
                                              >
                                                  {rc?.update
                                                      ? phraseText.dateTime.replace
                                                      : phraseText.dateTime.remove}{' '}
                                                  {handleTime(rc?.updatedAt, 'date')}
                                              </P>
                                          )}
                                          <P
                                              className="dateTime"
                                              css="display: none; width: 100%; font-size: 1rem; margin-left: 5px; text-align: left;"
                                          >
                                              {handleTime(rc.createdAt, 'hour')}
                                          </P>
                                      </>
                                  )}
                              </Div>
                          </Div>
                      </Div>
                  )}
        </>
    );
};
export default memo(ItemsRoom);
