
import React, { useCallback, useMemo, useContext, useEffect, useState } from "react";
import {
  ThreeColumnLayout,
  Loader,
  SimplePostCard,
  QuestionCard,
  Placeholder,
  Composer,
  PostCard,
  OnchainPostCard,
} from ".";
import Link from "next/link";
import { useRelay } from "../context/RelayContext";
import { useAPI } from "../hooks/useAPI";

import BSocial from 'bsocial';

import { wrapRelayx } from 'stag-relayx'

import moment from "moment";
import { useTuning } from "../context/TuningContext";
import { useRouter } from "next/router";
import { useBitcoin } from "../context/BitcoinContext";

import {useDropzone} from 'react-dropzone'

import { useAuth } from '../hooks/useAuth'

import root from 'window-or-global'

function buf2hex(buffer: any) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};


function ago(period: any) {
  return moment().subtract(1, period).unix() * 1000;
}

const rexieContract = '12d8ca4bc0eaf26660627cc1671de6a0047246f39f3aa06633f8204223d70cc5_o2'

//import { JitsiMeeting } from '@jitsi/react-sdk';
import Script from 'next/script';

//import BlankLayout from 'src/@core/layouts/BlankLayout'
import axios from 'axios'

import { useTokenMeetLiveWebsocket } from '../hooks/useWebsocket';
//import { Socket } from 'socket.io-client/build/esm/socket';



const MINIMUM_POWCO_BALANCE = 218

const events = [
    'cameraError',
    'avatarChanged',
    'audioAvailabilityChanged',
    'audioMuteStatusChanged',
    'breakoutRoomsUpdated',
    'browserSupport',
    'contentSharingParticipantsChanged',
    'dataChannelOpened',
    'endpointTextMessageReceived',
    'faceLandmarkDetected',
    'errorOccurred',
    'knockingParticipant',
    'largeVideoChanged',
    'log',
    'micError',
    'screenSharingStatusChanged',
    'dominantSpeakerChanged',
    'raiseHandUpdated',
    'tileViewChanged',
    'chatUpdated',
    'incomingMessage',
    'mouseEnter',
    'mouseLeave',
    'mouseMove',
    'toolbarButtonClicked',
    'outgoingMessage',
    'displayNameChange',
    'deviceListChanged',
    'emailChange',
    'feedbackSubmitted',
    'filmstripDisplayChanged',
    'moderationStatusChanged',
    'moderationParticipantApproved',
    'moderationParticipantRejected',
    'participantJoined',
    'participantKickedOut',
    'participantLeft',
    'participantRoleChanged',
    'participantsPaneToggled',
    'passwordRequired',
    'videoConferenceJoined',
    'videoConferenceLeft',
    'videoAvailabilityChanged',
    'videoMuteStatusChanged',
    'videoQualityChanged',
    'readyToClose',
    'recordingLinkAvailable',
    'recordingStatusChanged',
    'subjectChange',
    'suspendDetected',
    'peerConnectionFailure'
]

import { sendMessage } from '../utils/bsocial/message'

import { checkForRexie } from "src/utils/relayx";

const Dashboard = ({ data, recent, error, loading }: any) => {
  const router = useRouter();
  const { startTimestamp, tag, setTag } = useTuning();
  console.log(data,recent)

  const { login } = useAuth()

  const { authenticated, setWallet, authenticate, paymail, avatar, relayToken } = useBitcoin()

  const { user, powcoBalance } = useAuth()

  const [jitsiInitialized, setJitsiInitialized] = useState<boolean>(false)

  const [nJitsis, setNJitsis] = useState(1)

  const { isConnected, socket } = useTokenMeetLiveWebsocket()

  const [jitsiJWT, setJitsiJWT] = useState()

  const [rexie, setRexie] = useState<boolean>()

  useEffect(() => {

    if (!paymail) { return }

    checkForRexie(paymail).then(setRexie)

  }, [paymail])

  const roomName = `vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/${rexieContract}`

  console.log({ relayToken, paymail })

  async function handleJitsiEvent(type: string, event: any, socket: any) {

      //TODO: Pipe the event to websocket server

      console.log('JIITSI EVENT', {type, event, user})

      socket.emit('jitsi-event', {
          type,
          event,
          user,
          jwt: jitsiJWT,
          timestamp: new Date().toISOString(),
          roomName
      })

      if (type === "outgoingMessage") {

          console.log('OUTGOING MESSAGE', event)

          try {

              const result = await sendMessage({
                  app: 'chat.pow.co',
                  channel: 'powco-development',
                  message: event.message,
                  paymail: user?.paymail
              })

              console.log('bsocial.sendMessage.result', result)

          } catch(error) {

              console.error('bsocial.sendMessage.error', error)
          }


      }
  }

  function handleLogin() {
      login()
  }

  useEffect(() => {

      console.log('USE EFFECT', {nJitsis})

      console.log("USER?", user)

      if (authenticated) {

        console.log('JitsiMeetExternalAPI', root.JitsiMeetExternalAPI)

          // @ts-ignore
          if (!root.JitsiMeetExternalAPI) {

              setTimeout(() => {
                  setNJitsis(nJitsis + 1)
              }, 520)
              
              return
          }

          if (jitsiInitialized) {

              return
          }

          setJitsiInitialized(true)


          axios.post('https://tokenmeet.live/api/v1/jaas/auth', {
              wallet: 'relay',
              paymail: user?.paymail || paymail,
              token: relayToken,              
              tokenOrigin: rexieContract
          })
          .then(({data}) => {

            console.log("JWT", data)

              const domain = "8x8.vc";

              setJitsiJWT(data.jwt)

              const options = {
                  jwt: data.jwt,                
                  roomName,
                  width: '100%',
                  height: 700,
                  parentNode: document.querySelector('#tokenmeet-video-container'),
                  lang: 'en',
                  configOverwrite: {
                      prejoinPageEnabled: false,
                      startWithAudioMuted: true,
                      startWithVideoMuted: true
                  },
              };

  
              var jitsi = new root.JitsiMeetExternalAPI(domain, options);

              root.jitsi = jitsi

              socket.on('jitsi.executeCommand', message => {

                  const { command, params } = message

                  console.log('jitsi.executeCommand', {command, params})

                  jitsi.executeCommand(command, params)

              })


              socket.on('jitsi.callFunction', async (message) => {

                  const { method, params, uid } = message

                  console.log('jitsi.callFunction', {method, params, uid})

                  const result = await jitsi[method](...params)

                  socket.emit('jitsi.callFunctionResult', {
                      uid,
                      result
                  })
                  
              })

              const handlers = events.reduce((acc: any, type) => {

                  acc[type] = (event: any) => {

                      if (event) {
                          handleJitsiEvent(type, event, socket)
                      }                    
                  }

                  return acc

              }, {})

              for (let type of events) {
                      
                      jitsi.addListener(type, handlers[type])
              }

              return function() {

                  for (let type of events) {
                          
                      jitsi.removeListener(type, handlers[type])
                  }
                          
                  jitsi.dispose()
              }
          })
          .catch(error => {

              console.log('AUTH ERROR', error)

          })
      }

      console.log('--end use effect--', {nJitsis})

  
  }, [root.JitsiMeetExternalAPI, jitsiJWT, authenticated])


  const handleChangeTab = (tag: string) => {
    switch (tag) {
      case "":
        router.push("/");
        break;
      //case "1F9E9":
      case "question":
        router.push("/questions");
        break;
      //case "1F4A1":
      case "answer":
        router.push("/answers");
        break;
      //case "1F48E":
      case "project":
        router.push("/projects");
        break;
      case "test":
        router.push("/test");
        break;
      default:
        console.log("unknown tag");
    }
  };

  return (
    <>
      <Script src={'https://8x8.vc/vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/external_api.js'} />

    <ThreeColumnLayout>
      <div className="col-span-12 lg:col-span-6 min-h-screen">
      {rexie && (
        <div id="tokenmeet-video-container"></div>
      )}
      {typeof rexie === 'undefined' && (
        <div className="px-4 mt-2">
          <div className="flex my-6">
            <div className="flex">
              <p>Checking your wallet for Rexie NFT....</p>
            </div>
          </div>
        </div>
      )}
      {!rexie && typeof rexie !== 'undefined' && (
        <p><button className="button button-lg">< a target="_blank" rel="noreferrer" href="https://relayx.com/market/12d8ca4bc0eaf26660627cc1671de6a0047246f39f3aa06633f8204223d70cc5_o2">Rexie Token Holders Only!! Buy one here </a></button></p>
      )}
      

        <div className="hidden lg:block mt-8">
          {/*<MemeDropzone/>*/}

        </div>
        <div className="px-4 mt-2">
          <div className="flex my-6">
            <div className="flex">
            {/*<div id="tokenmeet-video-container"></div>*/}


              {/* <div
                onClick={() => handleChangeTab("")}
                className={
                  tag === ""
                    ? "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap"
                    : "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap"
                }
              >
                All 🦚
              </div> */}


              {/* <div
                //onClick={() => handleChangeTab("1F48E")}
                onClick={() => handleChangeTab("project")}
                className={
                  //tag === "1F48E"
                  tag === "project"
                    ? "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap"
                    : "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap"
                }
              >
                Experiments 💎
              </div> */}
              {/* <div
                  onClick={() => handleChangeTab("test")}
                  className={
                    tag === "test"
                      ? "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap"
                      : "text-sm leading-4 py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap"
                  }
                >
                  Tests 🐛
                </div> */}
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="relative">

          {!rexie && (
            <div id="tokenmeet-video-container"></div>
          )}
          


            {/* <InfiniteScroll
                dataLength={posts.length}
                hasMore={hasMore}
                next={fetchMore}
                loader={<Loader />}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                refreshFunction={refresh}
              >
              </InfiniteScroll> */}
            
            {!loading &&
              !error &&
              data?.map((post: any) => {
                if (post.txid) {
                  return <OnchainPostCard key={post.txid} post={post} />;
                } else {
                  return <SimplePostCard key={post.tx_id} post={post} />;
                }
              })}
            {loading && <Loader />}
            {!loading && recent && (
              <div className="flex py-5 items-center">
                <div className="grow border border-bottom border-gray-600 dark:border-gray-300" />
                <div className="mx-5 font-semibold text-gray-600 dark:text-gray-300 text-lg">Recent</div>
                <div className="grow border border-bottom border-gray-600 dark:border-gray-300" />
              </div>
            )}

            {recent?.map((post: any) => (
              <SimplePostCard key={post.tx_id} post={post} />
            ))}
            {/* {!recentLoading &&
                !recentError &&
                recent.questions.map((post) => (
                  <QuestionCard key={post.tx_id} post={post} />
                ))} */}
          </div>
        </div>
        {authenticated && (
          <Link href="/compose">
            <div className=" lg:hidden fixed bottom-[73px] right-[14px] h-14 w-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </Link>
        )}
      </div>
    </ThreeColumnLayout>
    </>
  );
};

export default Dashboard;
