import React, { useEffect, useRef, useState } from 'react';
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
} from 'react-icons/fa';

const VideoGrid = React.memo(({ participants }) => {
  const reversedParticipants = participants.reverse()
  return (
    <div className="w-full h-full overflow-y-auto p-4 flex justify-center">
      <div className="flex flex-wrap justify-center gap-5 w-full ">
        {reversedParticipants.map((participant) => (
          <div
            key={participant.id + Date.now()}
            className="
              bg-gray-800 rounded-lg overflow-hidden shadow-md 
              flex flex-col items-center justify-center 
              w-full sm:w-1/2 md:w-1/3 lg:w-1/4
            "
          >
            <VideoPlayer stream={participant.stream} isLocal={participant.isLocal} />
            <div className="text-center font-bold text-sm p-2 text-white">
              {participant.isLocal ? 'You' : participant.username}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const VideoPlayer = ({ stream, isLocal }) => {
  const videoRef = useRef();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleTrack = (kind) => {
    const tracks = videoRef.current?.srcObject?.getTracks();
    if (!tracks) return;

    tracks.forEach((track) => {
      if (track.kind === kind) {
        track.enabled = !track.enabled;
        if (kind === 'video') setIsVideoOn(track.enabled);
        if (kind === 'audio') setIsAudioOn(track.enabled);
      }
    });
  };

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full max-h-[60vh] object-contain rounded-t-lg scale-x-[-1]"
      />

      {isLocal && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-4 z-10">
          <button
            onClick={() => toggleTrack('video')}
            className="bg-gray-900/80 text-white p-2 rounded-full hover:bg-gray-700"
          >
            {isVideoOn ? <FaVideo size={14} /> : <FaVideoSlash size={14} />}
          </button>
          <button
            onClick={() => toggleTrack('audio')}
            className="bg-gray-900/80 text-white p-2 rounded-full hover:bg-gray-700"
          >
            {isAudioOn ? <FaMicrophone size={14} /> : <FaMicrophoneSlash size={14} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
