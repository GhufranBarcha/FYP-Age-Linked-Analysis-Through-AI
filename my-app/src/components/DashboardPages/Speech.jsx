import { useState } from "react";
import FormOne from "./SpeechComponents/FormOne";
import FormTwo from "./SpeechComponents/FormTwo";
import FormThree from "./SpeechComponents/FormThree";
import FormFour from "./SpeechComponents/FormFour";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { storage, db } from "../../auth/config";
import { v4 as uuidv4 } from "uuid"; // for generating unique IDs
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
const Speech = () => {
  const [Id, setId] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  // Validation function to ensure either an uploaded file or audio URL exists
  const handleNextStep = () => {
    if (uploadedFiles.length > 0 || audioUrl) {
      setId((prevId) => prevId + 1);
    } else {
      alert("Please upload a file or record audio before proceeding.");
    }
  };

  const uploadAudio = async () => {
    setButtonDisable(true);
    const loadingToast = toast.loading("Saving your audio, please wait...");
    try {
      let file;
      if (uploadedFiles.length > 0) {
        file = uploadedFiles[0];
      } else if (audioUrl) {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        file = new File([blob], `recording-${uuidv4()}.wav`, {
          type: blob.type,
        });
      }

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        // Send the audio file for prediction
        const response = await axios.post(
          "http://127.0.0.1:5000/predict",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Handle prediction response
        if (response.data) {
          const predictionData = response.data;

          // Extract user ID from local storage
          const userId = localStorage.getItem("userId");
          if (!userId) {
            console.error("User ID not found in local storage.");
            return;
          }

          // Prepare unique file name and upload to Firebase Storage
          const uniqueFileName = `${userId}-${uuidv4()}-${file.name}`;
          const storageRef = ref(storage, `userAudio/${uniqueFileName}`);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);

          // Store audio metadata and prediction data in Firestore
          await setDoc(doc(db, "userAudio", uniqueFileName), {
            userId: userId,
            audioUrl: downloadURL,
            fileName: file.name,
            uploadedAt: new Date(),
            predicted_age: predictionData.predicted_age, // Assuming response data includes these fields
            confidence: predictionData.confidence,
          });
          toast.dismiss(loadingToast);
          toast.success("Audio uploaded and data saved successfully!");
          setId(3); // Move to the next step after uploading
        }
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      toast.error("Failed to upload audio.");
    } finally {
      setButtonDisable(false);
    }
  };

  const onDeleteFile = () => {
    setUploadedFiles([]);
    setAudioUrl(null); // Reset the audio URL as well
  };
  return (
    <div className="w-full ">
      <Toaster />
      <div
        className={`lg:w-[90%] mx-auto DropShadow rounded-lg  bg-white lg:p-8 p-4  pt-5`}>
        <div className="flex justify-between relative ">
          <div className="absolute h-[.2rem] bg-[#E7E7F4] lg:w-[90%] w-[80%] xl:right-[5rem] right-[3rem] top-4"></div>
          <div className="flex flex-col items-center justify-center space-y-8 z-30">
            <div>
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="16.5"
                  cy="16.5"
                  r="16"
                  fill={`${Id === 1 ? "#6E39CB" : "#DECCFE"} `}
                />
              </svg>
            </div>
            <h1 className="text-[#89868D] lg:text-lg  text-sm font-bold">
              Upload or Record
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center space-y-8 z-30">
            <div>
              {" "}
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="16.5"
                  cy="16.5"
                  r="16"
                  fill={`${Id === 2 ? "#6E39CB" : "#DECCFE"} `}
                />
              </svg>
            </div>
            <h1 className="text-[#89868D] font-bold lg:text-lg  text-sm">
              Confirm Speech Test
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center space-y-8 z-30">
            <div>
              {" "}
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="16.5"
                  cy="16.5"
                  r="16"
                  fill={`${Id === 3 ? "#6E39CB" : "#DECCFE"} `}
                />
              </svg>
            </div>
            <h1 className="text-[#89868D] font-bold lg:text-lg  text-sm">
              Child&apos;s Information-
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center space-y-8 z-20">
            <div>
              {" "}
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="16.5"
                  cy="16.5"
                  r="16"
                  fill={`${Id === 4 ? "#6E39CB" : "#DECCFE"} `}
                />
              </svg>
            </div>
            <h1 className="text-[#89868D] font-bold lg:text-lg  text-sm">
              Submission Complted
            </h1>
          </div>
        </div>
      </div>
      <div
        className={`w-[90%] mx-auto DropShadow rounded-lg mt-[4rem] p-8 ${
          Id === 2 || Id === 4 ? "bg-[#cb3cff79]" : "bg-white"
        }`}>
        {Id === 1 && (
          <FormOne
            setId={setId}
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
            audioUrl={audioUrl}
            handleNextStep={handleNextStep}
            setAudioUrl={setAudioUrl}
          />
        )}

        {Id === 2 && (
          <FormTwo
            setId={setId}
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
            audioUrl={audioUrl}
            buttonDisable={buttonDisable}
            setAudioUrl={setAudioUrl}
            onDeleteFile={onDeleteFile}
            uploadAudio={uploadAudio}
          />
        )}

        {Id === 3 && <FormThree setId={setId} />}
        {Id === 4 && <FormFour setId={setId} />}
      </div>
    </div>
  );
};

export default Speech;
