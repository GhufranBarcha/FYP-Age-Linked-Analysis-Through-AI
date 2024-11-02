import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import WaveSurfer from "wavesurfer.js";
import styled from "styled-components";

// Styled components for styling the waveform and button
const WaveformContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
  background: transparent;
`;

const Wave = styled.div`
  width: 100%;
  height: 90px;
`;

const PlayButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background: #efefef;
  border-radius: 50%;
  border: none;
  outline: none;
  cursor: pointer;
  padding-bottom: 3px;
  &:hover {
    background: #ddd;
  }
`;

const FormTwo = ({
  uploadedFiles,
  audioUrl,
  buttonDisable,
  onDeleteFile,
  setId,
  uploadAudio,
}) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  console.log(buttonDisable);
  useEffect(() => {
    // Determine the audio source
    if (audioUrl) {
      setAudioSource(audioUrl);
    } else if (uploadedFiles.length > 0) {
      const fileUrl = URL.createObjectURL(uploadedFiles[0]);
      setAudioSource(fileUrl);
      return () => {
        URL.revokeObjectURL(fileUrl); // Clean up object URL when component unmounts
      };
    } else {
      setAudioSource(null);
    }
  }, [audioUrl, uploadedFiles]);

  useEffect(() => {
    if (audioSource && waveformRef.current) {
      // Clean up previous WaveSurfer instance if it exists
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }

      // Initialize a new WaveSurfer instance
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        barWidth: 3,
        cursorWidth: 1,
        backend: "WebAudio",
        height: 80,
        progressColor: "#2D5BFF",
        responsive: true,
        waveColor: "#EFEFEF",
        cursorColor: "transparent",
      });

      // Load the audio file into WaveSurfer
      wavesurferRef.current.load(audioSource);

      // Set the audio as ready when fully loaded
      wavesurferRef.current.on("ready", () => {
        setIsReady(true);
      });

      wavesurferRef.current.on("error", (error) => {
        console.error("WaveSurfer error:", error);
      });

      // Clean up when the component unmounts or when audioSource changes
      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
          wavesurferRef.current = null;
        }
      };
    }
  }, [audioSource]);

  const handlePlayPause = () => {
    if (isReady && wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };
  const handelSubmit = () => {
    uploadAudio();
  };
  const handleDelete = () => {
    onDeleteFile();
    setIsReady(false);
    setIsPlaying(false);

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }
  };

  return (
    <div className="">
      <div className="flex justify-end">
        {" "}
        <button
          onClick={handleDelete}
          className="ml-4 px-4 py-2 text-white bg-red-500 rounded">
          Delete
        </button>
      </div>
      {audioSource ? (
        <WaveformContainer>
          <PlayButton onClick={handlePlayPause}>
            {isPlaying ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 6C2 4.114 2 3.172 2.586 2.586C3.172 2 4.114 2 6 2C7.886 2 8.828 2 9.414 2.586C10 3.172 10 4.114 10 6V18C10 19.886 10 20.828 9.414 21.414C8.828 22 7.886 22 6 22C4.114 22 3.172 22 2.586 21.414C2 20.828 2 19.886 2 18V6ZM14 6C14 4.114 14 3.172 14.586 2.586C15.172 2 16.114 2 18 2C19.886 2 20.828 2 21.414 2.586C22 3.172 22 4.114 22 6V18C22 19.886 22 20.828 21.414 21.414C20.828 22 19.886 22 18 22C16.114 22 15.172 22 14.586 21.414C14 20.828 14 19.886 14 18V6Z"
                  fill="#6E39CB"
                />
              </svg>
            ) : (
              <svg
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.409 7.353C17.8893 7.60841 18.291 7.98969 18.5712 8.45599C18.8514 8.92228 18.9994 9.45602 18.9994 10C18.9994 10.544 18.8514 11.0777 18.5712 11.544C18.291 12.0103 17.8893 12.3916 17.409 12.647L4.597 19.614C2.534 20.737 0 19.277 0 16.968V3.033C0 0.723002 2.534 -0.735998 4.597 0.385002L17.409 7.353Z"
                  fill="#6E39CB"
                />
              </svg>
            )}
          </PlayButton>
          <Wave id="waveform" ref={waveformRef} />
        </WaveformContainer>
      ) : (
        <p className="text-sm text-gray-500">No audio uploaded yet.</p>
      )}
      <div className="flex justify-between item-center">
        <button
          onClick={() => setId(1)}
          className="px-10 text-white mt-[7rem] py-1 bg-[#6E39CB] rounded-lg text-lg ">
          Back
        </button>
        <button
          onClick={handelSubmit}
          type="button"
          disabled={buttonDisable}
          className={`px-10 text-white mt-[7rem] py-1 rounded-lg text-lg cursor-pointer ${
            buttonDisable ? "bg-gray-400 cursor-not-allowed" : "bg-[#6E39CB]"
          }`}>
          Next
        </button>
      </div>
    </div>
  );
};

FormTwo.propTypes = {
  uploadedFiles: PropTypes.array.isRequired,
  setId: PropTypes.any,
  audioUrl: PropTypes.string,
  onDeleteFile: PropTypes.func.isRequired,
  uploadAudio: PropTypes.func.isRequired,
  buttonDisable: PropTypes.any,
};

export default FormTwo;
