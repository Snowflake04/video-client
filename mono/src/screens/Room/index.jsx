import styled from 'styled-components';
import LeftNav from './LeftNav/LeftNav';
import MiddleContent from './MiddleContent';
import RightComponent from './RightComponents';
import { useEffect, useCallback } from 'react';
import { useStream, getPeer } from '../../context/StreamProvider';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const Peer = getPeer();
  const { setUserMap, setLocalStream } = useStream();
  const navigate = useNavigate();
  // <--------------Events---------->
  console.log('room re-render', Peer.roomId);
  useEffect(() => {
    Peer.on('incommingCall', handleCall);
    Peer.on('RTCOffer', handleOffer);
    Peer.on('RTCAnswer', handleAnswer);
    Peer.on('iceCandidate', handleICECandidate);
    Peer.on('userDisconnected', removeUser);
    return () => {
      Peer.off('incommingCall', handleCall);
      Peer.off('RTCOffer', handleOffer);
      Peer.off('RTCAnswer', handleAnswer);
      Peer.off('iceCandidate', handleICECandidate);
      Peer.off('userDisconnected', removeUser);
    };
  }, [Peer]);

  // <----------Effects------------>

  useEffect(() => {
    if (Peer.roomId === '') navigate(`/`, { replace: true });

    // (async () => {
    //   await Peer.setLocalStream();
    //   setLocalStream(Peer.localStream);
    // })();
  }, []);

  // <----------- Functions----------->

  const handleCall = useCallback(
    async (offer) => {
      console.log('got call');
      await Peer.handleIncommingCall(offer);
    },
    [Peer]
  );

  const handleOffer = useCallback(
    (offer) => {
      Peer.handleRTCOffer(offer);
    },
    [Peer]
  );
  const handleAnswer = useCallback(
    async (offer) => {
      await Peer.handleRTCAnswer(offer);
    },
    [Peer]
  );

  const handleICECandidate = useCallback(
    (offer) => {
      Peer.handleIceCandidate(offer);
    },
    [Peer]
  );

  const removeUser = useCallback(
    (userId) => {
      setUserMap((prevUserMap) => {
        const newUserMap = { ...prevUserMap };
        delete newUserMap[userId];
        return newUserMap;
      });

      Peer.removeRemoteStream(userId);
    },
    [Peer]
  );

  return (
    <MainContainer>
      <LeftNav />
      <MiddleContent />
      <RightComponent />
    </MainContainer>
  );
};

export default Splash;

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 5fr 2fr;
  height: 100dvh;
  max-height: 100dvh;
  position: relative;
  padding: 12px;
  &::before {
    content: '';
    position: absolute;
    background-image: url('.../../../src/images/skulls.png');
    inset: 0;
    opacity: 0.2;
    filter: invert();
  }
`;
